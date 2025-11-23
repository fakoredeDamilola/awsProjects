```sh
# create a node artifacts folder for dependencies and utils function that does not change which lambda will use across different functions and lambdas
# the folder should be in the root of the project and should be named nodejs/node_modules and contain all the dependencies minus aws-lambda
# zip the folder
cd ../layers/common
zip -r layer.zip nodejs

# deploy node artifacts layer to s3
aws s3 mb s3://my-dependencies-artifacts-12345 --region us-east-1
aws s3 cp layer.zip s3://my-dependencies-artifacts-12345/layer.zip





# compile just the build for the user domain lambda
./build-users.sh

#deploy to s3
aws s3 mb s3://my-user-handler-12345 --region us-east-1
aws s3 cp users.zip s3://my-user-handler-12345/users.zip

# deploy events domain to lambda
./build-events.sh
aws s3 mb s3://my-events-handler-12345 --region us-east-1
aws s3 cp events.zip s3://my-events-handler-12345/events.zip


# deploy cfn ensure route for events and users has been apped to apigateway cfn
./deploy


# upldate lambda code in s3 if there was an update
aws lambda update-function-code --function-name event-user-domain-stack-users --s3-bucket my-user-handler-12345 --s3-key event-user-domain-stack/users.zip

aws lambda update-function-code --function-name event-user-domain-stack-events --s3-bucket my-events-handler-12345 --s3-key event-user-domain-stack/events.zip
```