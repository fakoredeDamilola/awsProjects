## setting up dynamodb locally and running lambda functions

## start dynamodb locally
```sh
docker compose -f src/docker-compose.yml up -d

# confirm it is running
docker ps | grep dynamodb-local
```


## create table
```sh
aws dynamodb create-table \
  --table-name events-user-creation \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000 \
  --region local
```