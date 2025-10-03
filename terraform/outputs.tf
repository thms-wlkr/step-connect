# gowalkr Infrastructure Outputs

# Custom Domain URLs
output "api_url" {
  description = "API Gateway custom domain URL"
  value       = "https://${var.api_subdomain}.${var.domain_name}"
}

output "auth_domain" {
  description = "Cognito authentication domain"
  value       = "${var.auth_subdomain}.${var.domain_name}"
}

output "cdn_url" {
  description = "CloudFront CDN URL for photos"
  value       = "https://${var.cdn_subdomain}.${var.domain_name}"
}

# Cognito
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

# API Gateway
output "api_gateway_url" {
  description = "API Gateway REST API URL"
  value       = "https://${aws_api_gateway_rest_api.main.id}.execute-api.${var.aws_region}.amazonaws.com/${var.environment}"
}

output "websocket_api_endpoint" {
  description = "WebSocket API Endpoint"
  value       = aws_apigatewayv2_api.websocket.api_endpoint
}

# Storage
output "profile_photos_bucket" {
  description = "S3 bucket name for profile photos"
  value       = aws_s3_bucket.profile_photos.id
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain for profile photos"
  value       = aws_cloudfront_distribution.profile_photos_cdn.domain_name
}

# Database
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

# Messaging
output "sns_topic_arn" {
  description = "SNS Topic ARN for notifications"
  value       = aws_sns_topic.notifications.arn
}

output "sqs_queue_url" {
  description = "SQS Queue URL for async tasks"
  value       = aws_sqs_queue.async_tasks.url
}

# Lambda Functions
output "lambda_functions" {
  description = "Lambda function names"
  value = {
    user_management    = aws_lambda_function.user_management.function_name
    matching_algorithm = aws_lambda_function.matching_algorithm.function_name
    chat_handler       = aws_lambda_function.chat_handler.function_name
  }
}

# Configuration for Frontend
output "frontend_config" {
  description = "Configuration values for frontend app"
  value = {
    api_url              = "https://${var.api_subdomain}.${var.domain_name}"
    auth_domain          = "${var.auth_subdomain}.${var.domain_name}"
    cdn_url              = "https://${var.cdn_subdomain}.${var.domain_name}"
    user_pool_id         = aws_cognito_user_pool.main.id
    user_pool_client_id  = aws_cognito_user_pool_client.web.id
    region               = var.aws_region
  }
  sensitive = false
}
