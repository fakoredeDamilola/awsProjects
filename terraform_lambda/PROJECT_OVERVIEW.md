
# Lambda Users API – Overview & Setup

## 1. Architecture

- **Goal**  
  Minimal serverless users API on AWS, managed with Terraform.

- **Components**
  - **Lambda (Node.js 18)**  
    - Entry: [src/handle-users.ts](cci:7://file:///Users/fakorededamilola/aws_projects/terraform_lambda_api/src/handle-users.ts:0:0-0:0)
    - Routes:
      - `GET /users` → [getUserhandler](cci:1://file:///Users/fakorededamilola/aws_projects/terraform_lambda_api/src/users/getUser.ts:20:0-51:1) ([src/users/getUser.ts](cci:7://file:///Users/fakorededamilola/aws_projects/terraform_lambda_api/src/users/getUser.ts:0:0-0:0))
      - `PUT /users` → [putUserhandler](cci:1://file:///Users/fakorededamilola/aws_projects/terraform_lambda_api/src/users/putUser.ts:22:0-56:1) ([src/users/putUser.ts](cci:7://file:///Users/fakorededamilola/aws_projects/terraform_lambda_api/src/users/putUser.ts:0:0-0:0))
    - Uses `APIGatewayProxyEventV2` and HTTP API payload v2.
  - **DynamoDB**
    - Users table managed by Terraform:
      - Name: from `var.dynamodb_table_name` (e.g. `staging-lambda-api_db`)
      - Partition key: `userId` (string)
    - Items: `{ userId, email, password: <bcrypt hash>, name }`.
  - **API Gateway HTTP API (v2)**
    - Routes:
      - `GET /users`
      - `PUT /users`
    - `$default` stage, auto‑deploy.
  - **Lambda Layer**
    - Shared `nodejs/node_modules` with runtime deps (`bcrypt`, `dotenv`, etc.).
  - **Terraform**
    - `iac/environments/staging` – staging environment (S3 backend + DynamoDB lock table).
    - `iac/lambda-api-module` – reusable module with:
      - [compute.tf](cci:7://file:///Users/fakorededamilola/aws_projects/terraform_lambda_api/iac/lambda-api-module/compute.tf:0:0-0:0) – Lambda + layer + env vars.
      - [networking.tf](cci:7://file:///Users/fakorededamilola/aws_projects/terraform_lambda_api/iac/lambda-api-module/networking.tf:0:0-0:0) – HTTP API, integration, routes, stage, permissions.
      - [database.tf](cci:7://file:///Users/fakorededamilola/aws_projects/terraform_lambda_api/iac/lambda-api-module/database.tf:0:0-0:0) – users DynamoDB table.
      - [lambda_execution_role.tf](cci:7://file:///Users/fakorededamilola/aws_projects/terraform_lambda_api/iac/lambda-api-module/lambda_execution_role.tf:0:0-0:0) – IAM role + logging + DynamoDB access.

---

## 2. Local Development

### 2.1 Install dependencies

```sh
npm install
```

### 2.2 Configure environment variables

Create [.env](cci:7://file:///Users/fakorededamilola/aws_projects/terraform_lambda_api/.env:0:0-0:0) in the project root:

```env
TABLE_NAME="staging-lambda-api_db"   # or your local users table name
```

Handlers load this with:

```ts
import * as dotenv from "dotenv";
dotenv.config();

const tableName = process.env.TABLE_NAME;
```

### 2.3 Run DynamoDB Local with Docker

[docker-compose.yml](cci:7://file:///Users/fakorededamilola/aws_projects/terraform_lambda_api/docker-compose.yml:0:0-0:0) defines a local DynamoDB:

```yaml
services:
  dynamodb-local:
    image: "amazon/dynamodb-local:latest"
    container_name: dynamodb-local
    command: "-jar DynamoDBLocal.jar -sharedDb -dbPath ./data"
    ports:
      - "8000:8000"
    volumes:
      - "./docker/dynamodb:/home/dynamodblocal/data"
    working_dir: /home/dynamodblocal
```

Start it:

```sh
docker compose up -d dynamodb-local
docker ps | grep dynamodb-local
```

Create the local users table:

```sh
aws dynamodb create-table \
  --table-name events-user-creation \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000 \
  --region local
```

For local code, use:

```ts
const client = new DynamoDBClient({
  region: "local",
  endpoint: "http://localhost:8000",
});
```

### 2.4 Local Lambda simulation

You have helper scripts using `ts-node`, e.g.:

- [local-put-users.ts](cci:7://file:///Users/fakorededamilola/aws_projects/terraform_lambda_api/local-put-users.ts:0:0-0:0) – simulates `PUT /users`.
- [local-get-users.ts](cci:7://file:///Users/fakorededamilola/aws_projects/terraform_lambda_api/local-get-users.ts:0:0-0:0) – simulates `GET /users`.

Example run:

```sh
npm run local:put-users   # ts-node local-put-users.ts
npm run local:get-users   # ts-node local-get-users.ts
```

These construct an event and log `{ statusCode, body }` from the handlers.

---

## 3. Building & Packaging for AWS

### 3.1 Build Lambda code

`users.tsconfig.json` compiles `src/users/**/*.ts` and [src/handle-users.ts](cci:7://file:///Users/fakorededamilola/aws_projects/terraform_lambda_api/src/handle-users.ts:0:0-0:0) to `release/users-build`.

Build & zip:

```sh
./build-users.sh
# Result: release/users.zip
```

Upload code bundle to S3:

```sh
aws s3 cp release/users.zip s3://staging-lambda-api-handler
```

Lambda is configured (via Terraform) with:

- `runtime = "nodejs18.x"`
- `handler = "src/handle-users.handler"`
- `s3_bucket = var.lambda_api_zip_bucket_name`
- `s3_key = "users.zip"`

### 3.2 Build Lambda layer

Create `layer/nodejs/node_modules` containing runtime deps (e.g. `bcrypt`, `dotenv`) and zip:

```sh
cd layer
zip -r layer.zip nodejs
aws s3 cp layer.zip s3://lambda-api-artifact-12345/layer.zip
```

Terraform `aws_lambda_layer_version.node_dependencies` points to this zip and is attached to `aws_lambda_function.api_lambda`.

---

## 4. Terraform: Staging Infrastructure

### 4.1 Initialization

From the staging environment directory:

```sh
cd iac/environments/staging
terraform init
```

This:

- Configures S3 backend + DynamoDB lock table.
- Loads the `lambda_api_staging` module from `../../lambda-api-module`.

### 4.2 Module configuration (staging)

In [iac/environments/staging/main.tf](cci:7://file:///Users/fakorededamilola/aws_projects/terraform_lambda_api/iac/environments/staging/main.tf:0:0-0:0):

```hcl
module "lambda_api_staging" {
  source                     = "../../lambda-api-module"

  artifact_bucket_name       = "lambda-api-artifact-12345"
  function_name              = "lambda-api-staging"
  lambda_api_zip_bucket_name = "staging-lambda-api-handler"
  api_gateway_name           = "staging-lambda-api"
  dynamodb_table_name        = "staging-lambda-api_db"
}
```

The module:

- Creates DynamoDB users table `staging-lambda-api_db` with key `userId`.
- Sets Lambda env vars:

  ```hcl
  environment {
    variables = {
      TABLE_NAME = var.dynamodb_table_name
    }
  }
  ```

- Grants IAM `dynamodb:GetItem/PutItem/UpdateItem/DeleteItem/Query/Scan` on that table.
- Creates an HTTP API with:
  - Integration: Lambda, payload format v2.
  - Routes: `GET /users`, `PUT /users`.
  - `$default` stage with auto‑deploy.

### 4.3 Plan & apply

```sh
terraform plan
terraform apply
```

After apply:

- Get the HTTP API id from the console or Terraform output.
- Call the API:

```sh
# Create/update user
curl -X PUT \
  "https://<api-id>.execute-api.us-east-1.amazonaws.com/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"Damilola","email":"damilola@example.com","password":"password"}'

# List users
curl "https://<api-id>.execute-api.us-east-1.amazonaws.com/users"
```

---

## 5. Things to Watch Out For

- **Do not mix lock table and app table**
  - Terraform backend uses a dedicated DynamoDB table with `LockID` as key.
  - The app users table uses `userId` as key. Keep these separate.
- **Keep Terraform state in sync**
  - Avoid creating/deleting API Gateway routes, DynamoDB tables, etc., directly in the console.  
    If you do, import or reflect the changes in Terraform to avoid drift and conflicts.
- **Event shape**
  - HTTP API is configured for **payload_format_version = "2.0"**.
  - Use `event.rawPath` and `event.requestContext.http.method` in handlers.

