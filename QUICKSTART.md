# Quickstart

## Prerequisites

- Node.js 18+
- AWS CLI configured with credentials and default region (e.g. `us-east-1`)
- Terraform CLI
- Docker (for DynamoDB Local)
- S3 buckets:
  - `lambda-api-artifact-12345` (Lambda layer artifacts)
  - `staging-lambda-api-handler` (Lambda code zip)

---

## 1. Install & configure locally

```sh
# From project root
npm install
```

Create [.env](cci:7://file:///Users/fakorededamilola/aws_projects/terraform_lambda_api/.env:0:0-0:0):

```env
TABLE_NAME="staging-lambda-api_db"   # or your local users table name
```

---

## 2. Run DynamoDB locally (optional)

```sh
# Start DynamoDB Local
docker compose up -d dynamodb-local

# Create local users table
aws dynamodb create-table \
  --table-name events-user-creation \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000 \
  --region local
```

Local code can point to DynamoDB Local via:

```ts
const client = new DynamoDBClient({
  region: "local",
  endpoint: "http://localhost:8000",
});
```

---

## 3. Build Lambda code & upload

```sh
# Build TypeScript handlers and zip
./build-users.sh

# Upload code bundle to S3
aws s3 cp release/users.zip s3://staging-lambda-api-handler
```

---

## 4. Build Lambda layer & upload

In `layer/`:

```sh
# nodejs/node_modules contains runtime deps (e.g. bcrypt, dotenv)
zip -r layer.zip nodejs

aws s3 cp layer.zip s3://lambda-api-artifact-12345/layer.zip
```

---

## 5. Provision staging infrastructure with Terraform

```sh
cd iac/environments/staging

# Initialize backend and modules
terraform init

# Review changes
terraform plan

# Apply (create/update Lambda, HTTP API, DynamoDB, IAM, etc.)
terraform apply
```

The `lambda_api_staging` module will:

- Create the DynamoDB users table (key: `userId`).
- Create the Lambda function `lambda-api-staging` with:
  - Code from `staging-lambda-api-handler/users.zip`
  - Layer from `lambda-api-artifact-12345/layer.zip`
  - Env var `TABLE_NAME` pointing to the DynamoDB table.
- Create an HTTP API with:
  - `GET /users`
  - `PUT /users`
  - `$default` stage (no stage name in URL).

---

## 6. Call the API

After apply, get the HTTP API id from the console (or Terraform output) and call:

```sh
# PUT /users – create/update user
curl -X PUT \
  "https://<api-id>.execute-api.us-east-1.amazonaws.com/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"Damilola","email":"damilola@example.com","password":"password"}'

# GET /users – list users
curl "https://<api-id>.execute-api.us-east-1.amazonaws.com/users"
```

