```sh
# create a node artifacts folder for dependencies and utils function that does not change which lambda will use across different functions and lambdas
# the folder should be in the root of the project and should be named nodejs/node_modules and contain all the dependencies minus aws-lambda
# zip the folder
zip -r layer.zip nodejs

# deploy node artifacts layer to s3
aws s3 mb s3://lambda-api-artifact-12345 --region us-east-1
aws s3 cp layer.zip s3://lambda-api-artifact-12345/layer.zip

```