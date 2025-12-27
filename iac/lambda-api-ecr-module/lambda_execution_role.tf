data "aws_iam_policy_document" "lambda_assume_role_policy" {
   statement {
        effect = "Allow"
        actions = ["sts:AssumeRole"]
        principals {
            type = "Service"
            identifiers = ["lambda.amazonaws.com"]
        }
        
   } 
}

resource "aws_iam_role" "lambda_execution_role" {
    name = "lambda_execution_role"
    assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_policy.json
}

resource "aws_iam_role_policy_attachment" "lambda_basic_logging" {
    role = aws_iam_role.lambda_execution_role.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "lambda_extra_policy" {
    statement {
        effect = "Allow"
        actions = [
      "ssm:GetParameter",
      "secretsmanager:GetSecretValue"
    ]
        resources = ["*"]
    }
}

resource "aws_iam_policy" "lambda_extra_policy" {
    name = "lambda_extra_policy"
    policy = data.aws_iam_policy_document.lambda_extra_policy.json
}

resource "aws_iam_role_policy_attachment" "lambda_extra_policy_attachment" {
    role = aws_iam_role.lambda_execution_role.name
    policy_arn = aws_iam_policy.lambda_extra_policy.arn
}


# lambda dynamo db access
data  "aws_iam_policy_document" "lambda_dynamodb_policy" {
    statement {
        effect = "Allow"
        actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:Query",
      "dynamodb:Scan",
    ]
        resources = [
            aws_dynamodb_table.terraform_lambda_api_db.arn
        ]
    }
}

resource "aws_iam_policy" "lambda_dynamodb_policy" {
    name = "lambda_dynamodb_policy"
    policy = data.aws_iam_policy_document.lambda_dynamodb_policy.json
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb_policy_attachment" {
    role = aws_iam_role.lambda_execution_role.name
    policy_arn = aws_iam_policy.lambda_dynamodb_policy.arn
}