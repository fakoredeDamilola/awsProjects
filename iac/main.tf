    terraform {
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "~> 4.16"
        }
    }
    }

    provider "aws" {
        region = "us-east-1"
    }

    resource "aws_s3_bucket" "terraform_lambda_api_backend" {
        bucket = "terraform-lambda-api-backend"
        force_destroy = true
    }

    resource "aws_s3_bucket_versioning" "terraform_lambda_api_backend" {
        bucket = aws_s3_bucket.terraform_lambda_api_backend.id
        versioning_configuration {
            status = "Enabled"
        }
    }

    resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_lambda_api_backend_encryption" {
        bucket = aws_s3_bucket.terraform_lambda_api_backend.id
        
        rule {
            apply_server_side_encryption_by_default {
                sse_algorithm = "AES256"
            }
        }
    }

    resource "aws_dynamodb_table" "terraform_lambda_api_backend_db" {
        name = "terraform-lambda-api-backend"
        hash_key = "lockID"
        
        attribute {
            name = "lockID"
            type = "S"
        }
        
        billing_mode = "PAY_PER_REQUEST"
    }

