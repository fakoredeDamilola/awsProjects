locals {
  image_uri = "${var.aws_account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/${var.ecr_repository_name}:${var.image_tag}"
}

resource "aws_lambda_function" "api_lambda" {
    function_name = var.function_name
    role = aws_iam_role.lambda_execution_role.arn
  
    image_uri = local.image_uri
    package_type = "Image"
    architectures = ["arm64"]

  
    timeout = 10
    memory_size = 256

    environment {
      variables = {
        TABLE_NAME = var.dynamodb_table_name
      }
    }
}
