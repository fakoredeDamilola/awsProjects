  resource "aws_dynamodb_table" "terraform_lambda_api_db" {
        name = var.dynamodb_table_name
        hash_key = "userId"
        
        attribute {
            name = "userId"
            type = "S"
        }
        
        billing_mode = "PAY_PER_REQUEST"
    }