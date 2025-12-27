terraform {

    backend "s3" {
    bucket = "fako-terraform-state-bucket-01"
    key = "web-app/terraform.tfstate"
    region = "us-east-1"
    dynamodb_table = "terraform-state-locking"
    encrypt = true
    }

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

