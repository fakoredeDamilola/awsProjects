    terraform {

    backend "s3" {
    bucket = "terraform-lambda-api-backend"
    key = "web-app/terraform.tfstate"
    region = "us-east-1"
    dynamodb_table = "terraform-lambda-api-backend"
    encrypt = true
    }

    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "~> 4.16"
        }
    }
}

module "lambda_api_staging" {
    source = "../../lambda-api-s3-module"

    # VARIABLES
    artifact_bucket_name = "lambda-api-artifact-12345"
    function_name = "lambda-api-staging"
    lambda_api_zip_bucket_name = "staging-lambda-api-handler"
    api_gateway_name = "staging-lambda-api"
    dynamodb_table_name = "staging-lambda-api_db"
}