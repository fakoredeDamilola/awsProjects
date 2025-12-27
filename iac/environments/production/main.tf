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

module "lambda_api_prod" {
    source = "../../lambda-api-s3-module"

    # VARIABLES
    artifact_bucket_name = "lambda-api-artifact-12345"
    function_name = "lambda-api-prod"
    lambda_api_zip_bucket_name = "prod-lambda-api-handler"
    api_gateway_name = "prod-lambda-api"
    dynamodb_table_name = "prod-lambda-api_db"
}