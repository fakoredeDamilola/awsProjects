
## setting up dynamodb locally and running lambda functions

## start dynamodb locally
```sh
docker compose -f src/docker-compose.yml up -d

# confirm it is running
docker ps | grep dynamodb-local
```


```sh

## create table locally using aws cli
aws dynamodb create-table \
  --table-name events-user-creation \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000 \
  --region local

  ## list tables locally using aws cli
aws dynamodb list-tables \
  --endpoint-url http://localhost:8000 \
  --region local

  ## delete table locally using aws cli
aws dynamodb delete-table \
  --table-name events-user-creation \
  --endpoint-url http://localhost:8000 \
  --region local

  ## scan table locally using aws cli
aws dynamodb scan \
  --table-name events-user-creation \
  --endpoint-url http://localhost:8000 \
  --region local
```

```sh
# upload zip to s3
 aws s3 cp release/users.zip s3://staging-lambda-api-handler

```



# DEPLOY AS A CONTAINER TO ECR
```sh
docker build -t lambda-api-ecr-staging .

docker tag lambda-api-ecr-staging:latest 017915196139.dkr.ecr.us-east-1.amazonaws.com/lambda-api-ecr-staging:latest

# login into ecr 
aws ecr get-login-password --region us-east-1 \
  | docker login \
    --username AWS \
    --password-stdin 017915196139.dkr.ecr.us-east-1.amazonaws.com

# create repository
aws ecr create-repository \
  --repository-name lambda-api-ecr-staging \
  --region us-east-1

docker push 017915196139.dkr.ecr.us-east-1.amazonaws.com/lambda-api-ecr-staging:latest


# after deploying to ecr, cd into iac and ecr folder and run the following

cd iac/environments/ecr/staging

terraform init

terraform apply


# DEBUG CONTAINER

docker pull 017915196139.dkr.ecr.us-east-1.amazonaws.com/lambda-api-ecr-staging:latest


docker run --rm -it --entrypoint sh lambda-api-ecr-staging
# then run
ls -R

```