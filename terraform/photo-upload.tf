# Photo Upload Lambda
resource "aws_lambda_function" "photo_upload" {
  filename      = "lambda/photo-upload.zip"
  function_name = "${var.project_name}-photo-upload"
  role          = aws_iam_role.lambda_execution.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 30
  memory_size   = 256
  
  environment {
    variables = {
      PROFILE_PHOTOS_BUCKET = aws_s3_bucket.profile_photos.id
      CLOUDFRONT_DOMAIN     = aws_cloudfront_distribution.profile_photos_cdn.domain_name
      AWS_REGION            = var.aws_region
    }
  }
  
  depends_on = [aws_cloudwatch_log_group.lambda_logs]
}

# API Gateway integration
resource "aws_api_gateway_resource" "photo_upload" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "photo-upload"
}

resource "aws_api_gateway_method" "photo_upload_post" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.photo_upload.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id
}

resource "aws_api_gateway_integration" "photo_upload" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.photo_upload.id
  http_method = aws_api_gateway_method.photo_upload_post.http_method
  
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.photo_upload.invoke_arn
}

resource "aws_lambda_permission" "photo_upload_api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.photo_upload.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

# CORS
resource "aws_api_gateway_method" "photo_upload_options" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.photo_upload.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "photo_upload_options" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.photo_upload.id
  http_method = aws_api_gateway_method.photo_upload_options.http_method
  type        = "MOCK"
  
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "photo_upload_options" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.photo_upload.id
  http_method = aws_api_gateway_method.photo_upload_options.http_method
  status_code = "200"
  
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "photo_upload_options" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.photo_upload.id
  http_method = aws_api_gateway_method.photo_upload_options.http_method
  status_code = aws_api_gateway_method_response.photo_upload_options.status_code
  
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,Authorization'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}
