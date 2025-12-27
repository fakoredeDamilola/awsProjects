resource "aws_lambda_layer_version" "node_dependencies" {
    layer_name = "node_dependencies"
    description = "Node dependencies layer"
    s3_bucket = var.artifact_bucket_name
    s3_key = "layer.zip"
    compatible_runtimes = ["nodejs18.x"]
    
}

resource "aws_lambda_function" "api_lambda" {
    function_name = var.function_name
    role = aws_iam_role.lambda_execution_role.arn
    handler = "src/handle-users.handler"
    runtime = "nodejs18.x"
    s3_bucket = var.lambda_api_zip_bucket_name
    s3_key = "users.zip"
    layers = [
    aws_lambda_layer_version.node_dependencies.arn
  ]
    timeout = 10
    memory_size = 256

    environment {
      variables = {
        TABLE_NAME = var.dynamodb_table_name
      }
    }
}