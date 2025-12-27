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

module "lambda_api_ecr_staging" {
    source = "../../../lambda-api-ecr-module"

    # VARIABLES
    
    ecr_repository_name = "lambda-api-ecr-staging"
    
    function_name = "lambda-api-ecr-lambda-staging"
    api_gateway_name = "staging-lambda-api"
    dynamodb_table_name = "staging-lambda-api_db"

    aws_account_id = "017915196139"
}