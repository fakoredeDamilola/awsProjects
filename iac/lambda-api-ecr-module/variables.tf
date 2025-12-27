

variable "function_name" {
    type = string
    description = "Name of the function"
}



variable "api_gateway_name" {
    type = string
    description = "Name of the api gateway"
}

variable "dynamodb_table_name" {
    type = string
    description = "Name of the dynamodb table"
}

variable "ecr_repository_name" {
    type = string
    description = "Name of the ecr repository"
}

variable "aws_region" {
  type        = string
  description = "AWS region"
  default = "us-east-1"
}

variable "image_tag" {
  type        = string
  description = "Tag for the ECR image"
  default     = "latest"
}

variable "aws_account_id" {
  type        = string
  description = "AWS account ID"
}
