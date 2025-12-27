resource "aws_apigatewayv2_api" "users_api" {
    name = var.api_gateway_name
    protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
    api_id = aws_apigatewayv2_api.users_api.id
    integration_type = "AWS_PROXY"
    integration_uri = aws_lambda_function.api_lambda.invoke_arn
     payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_users" {
    api_id = aws_apigatewayv2_api.users_api.id
    route_key = "GET /users"
    target = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "put_users" {
    api_id = aws_apigatewayv2_api.users_api.id
    route_key = "PUT /users"
    target = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "default" {
    api_id = aws_apigatewayv2_api.users_api.id
    name = "$default"
    auto_deploy = true
}

resource "aws_lambda_permission" "allow_api_gateway" {
        statement_id = "AllowAPIGatewayInvoke"
        action = "lambda:InvokeFunction"
        function_name = aws_lambda_function.api_lambda.function_name
        principal = "apigateway.amazonaws.com"
        source_arn = "${aws_apigatewayv2_api.users_api.execution_arn}/*/*"


}