output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.main.id
}

output "cognito_user_pool_client_id" {
  description = "Cognito User Pool Client ID"
  value       = aws_cognito_user_pool_client.web.id
}

output "cognito_user_pool_endpoint" {
  description = "Cognito User Pool Endpoint"
  value       = aws_cognito_user_pool.main.endpoint
}

output "api_gateway_url" {
  description = "API Gateway REST API URL"
  value       = aws_api_gateway_rest_api.main.execution_arn
}

output "websocket_api_endpoint" {
  description = "WebSocket API Endpoint"
  value       = aws_apigatewayv2_api.websocket.api_endpoint
}

output "profile_photos_bucket" {
  description = "S3 bucket name for profile photos"
  value       = aws_s3_bucket.profile_photos.id
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain for profile photos"
  value       = aws_cloudfront_distribution.profile_photos_cdn.domain_name
}

output "dynamodb_tables" {
  description = "DynamoDB table names"
  value = {
    users    = aws_dynamodb_table.users.name
    profiles = aws_dynamodb_table.profiles.name
    matches  = aws_dynamodb_table.matches.name
    messages = aws_dynamodb_table.messages.name
    swipes   = aws_dynamodb_table.swipes.name
  }
}

output "sns_topic_arn" {
  description = "SNS Topic ARN for notifications"
  value       = aws_sns_topic.notifications.arn
}

output "sqs_queue_url" {
  description = "SQS Queue URL for async tasks"
  value       = aws_sqs_queue.async_tasks.url
}

output "lambda_functions" {
  description = "Lambda function names"
  value = {
    user_management    = aws_lambda_function.user_management.function_name
    matching_algorithm = aws_lambda_function.matching_algorithm.function_name
    chat_handler       = aws_lambda_function.chat_handler.function_name
  }
}
