terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    # Configure this for your state storage
    # bucket = "stepbuddy-terraform-state"
    # key    = "prod/terraform.tfstate"
    # region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "StepBuddy"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# DynamoDB Tables
resource "aws_dynamodb_table" "users" {
  name           = "${var.project_name}-users-${var.environment}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"
  
  attribute {
    name = "id"
    type = "S"
  }
  
  attribute {
    name = "email"
    type = "S"
  }
  
  global_secondary_index {
    name            = "EmailIndex"
    hash_key        = "email"
    projection_type = "ALL"
  }
  
  point_in_time_recovery {
    enabled = true
  }
  
  tags = {
    Name = "Users Table"
  }
}

resource "aws_dynamodb_table" "profiles" {
  name           = "${var.project_name}-profiles-${var.environment}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"
  
  attribute {
    name = "userId"
    type = "S"
  }
  
  attribute {
    name = "location"
    type = "S"
  }
  
  global_secondary_index {
    name            = "LocationIndex"
    hash_key        = "location"
    projection_type = "ALL"
  }
  
  point_in_time_recovery {
    enabled = true
  }
  
  tags = {
    Name = "Profiles Table"
  }
}

resource "aws_dynamodb_table" "matches" {
  name           = "${var.project_name}-matches-${var.environment}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"
  range_key      = "matchedAt"
  
  attribute {
    name = "id"
    type = "S"
  }
  
  attribute {
    name = "matchedAt"
    type = "S"
  }
  
  attribute {
    name = "userA"
    type = "S"
  }
  
  attribute {
    name = "userB"
    type = "S"
  }
  
  global_secondary_index {
    name            = "UserAIndex"
    hash_key        = "userA"
    range_key       = "matchedAt"
    projection_type = "ALL"
  }
  
  global_secondary_index {
    name            = "UserBIndex"
    hash_key        = "userB"
    range_key       = "matchedAt"
    projection_type = "ALL"
  }
  
  point_in_time_recovery {
    enabled = true
  }
  
  tags = {
    Name = "Matches Table"
  }
}

resource "aws_dynamodb_table" "messages" {
  name           = "${var.project_name}-messages-${var.environment}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "conversationId"
  range_key      = "timestamp"
  
  attribute {
    name = "conversationId"
    type = "S"
  }
  
  attribute {
    name = "timestamp"
    type = "S"
  }
  
  attribute {
    name = "fromUserId"
    type = "S"
  }
  
  global_secondary_index {
    name            = "FromUserIndex"
    hash_key        = "fromUserId"
    range_key       = "timestamp"
    projection_type = "ALL"
  }
  
  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
  
  point_in_time_recovery {
    enabled = true
  }
  
  tags = {
    Name = "Messages Table"
  }
}

resource "aws_dynamodb_table" "swipes" {
  name           = "${var.project_name}-swipes-${var.environment}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"
  range_key      = "targetUserId"
  
  attribute {
    name = "userId"
    type = "S"
  }
  
  attribute {
    name = "targetUserId"
    type = "S"
  }
  
  point_in_time_recovery {
    enabled = true
  }
  
  tags = {
    Name = "Swipes Table"
  }
}

# Cognito User Pool
resource "aws_cognito_user_pool" "main" {
  name = "${var.project_name}-user-pool-${var.environment}"
  
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]
  
  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 7
  }
  
  mfa_configuration = "OPTIONAL"
  
  software_token_mfa_configuration {
    enabled = true
  }
  
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }
  
  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = false
  }
  
  schema {
    name                = "name"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }
  
  tags = {
    Name = "StepBuddy User Pool"
  }
}

resource "aws_cognito_user_pool_client" "web" {
  name         = "${var.project_name}-web-client-${var.environment}"
  user_pool_id = aws_cognito_user_pool.main.id
  
  generate_secret                      = false
  refresh_token_validity               = 30
  access_token_validity                = 1
  id_token_validity                    = 1
  token_validity_units {
    refresh_token = "days"
    access_token  = "hours"
    id_token      = "hours"
  }
  
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
  
  prevent_user_existence_errors = "ENABLED"
  
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
  callback_urls                        = var.cognito_callback_urls
  logout_urls                          = var.cognito_logout_urls
  
  supported_identity_providers = ["GOOGLE"]
}

# Google OAuth Identity Provider (configure with your credentials)
resource "aws_cognito_identity_provider" "google" {
  user_pool_id  = aws_cognito_user_pool.main.id
  provider_name = "Google"
  provider_type = "Google"
  
  provider_details = {
    authorize_scopes = "email profile openid"
    client_id        = var.google_client_id
    client_secret    = var.google_client_secret
  }
  
  attribute_mapping = {
    email    = "email"
    name     = "name"
    username = "sub"
  }
}

# S3 Buckets
resource "aws_s3_bucket" "profile_photos" {
  bucket = "${var.project_name}-profile-photos-${var.environment}"
  
  tags = {
    Name = "Profile Photos"
  }
}

resource "aws_s3_bucket_public_access_block" "profile_photos" {
  bucket = aws_s3_bucket.profile_photos.id
  
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "profile_photos" {
  bucket = aws_s3_bucket.profile_photos.id
  
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "profile_photos" {
  bucket = aws_s3_bucket.profile_photos.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "profile_photos" {
  bucket = aws_s3_bucket.profile_photos.id
  
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE"]
    allowed_origins = var.allowed_origins
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# CloudFront Distribution for S3
resource "aws_cloudfront_distribution" "profile_photos_cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CDN for profile photos"
  default_root_object = ""
  
  origin {
    domain_name              = aws_s3_bucket.profile_photos.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.profile_photos.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.profile_photos.id
  }
  
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.profile_photos.id}"
    viewer_protocol_policy = "redirect-to-https"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    cloudfront_default_certificate = true
  }
  
  tags = {
    Name = "Profile Photos CDN"
  }
}

resource "aws_cloudfront_origin_access_control" "profile_photos" {
  name                              = "profile-photos-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# API Gateway REST API
resource "aws_api_gateway_rest_api" "main" {
  name        = "${var.project_name}-api-${var.environment}"
  description = "StepBuddy REST API"
  
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

# API Gateway WebSocket API for real-time chat
resource "aws_apigatewayv2_api" "websocket" {
  name                       = "${var.project_name}-websocket-${var.environment}"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
  
  tags = {
    Name = "StepBuddy WebSocket API"
  }
}

# Lambda Execution Role
resource "aws_iam_role" "lambda_execution" {
  name = "${var.project_name}-lambda-execution-${var.environment}"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_dynamodb_policy" {
  name = "${var.project_name}-lambda-dynamodb-${var.environment}"
  role = aws_iam_role.lambda_execution.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.users.arn,
          aws_dynamodb_table.profiles.arn,
          aws_dynamodb_table.matches.arn,
          aws_dynamodb_table.messages.arn,
          aws_dynamodb_table.swipes.arn,
          "${aws_dynamodb_table.users.arn}/index/*",
          "${aws_dynamodb_table.profiles.arn}/index/*",
          "${aws_dynamodb_table.matches.arn}/index/*",
          "${aws_dynamodb_table.messages.arn}/index/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]
        Resource = "${aws_s3_bucket.profile_photos.arn}/*"
      }
    ]
  })
}

# CloudWatch Log Groups for Lambda
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}"
  retention_in_days = 14
}

# Example Lambda Functions (you'll need to add the actual code)
# User Management Lambda
resource "aws_lambda_function" "user_management" {
  filename      = "lambda/user-management.zip"  # You'll need to create this
  function_name = "${var.project_name}-user-management-${var.environment}"
  role          = aws_iam_role.lambda_execution.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 30
  memory_size   = 512
  
  environment {
    variables = {
      USERS_TABLE    = aws_dynamodb_table.users.name
      PROFILES_TABLE = aws_dynamodb_table.profiles.name
      ENVIRONMENT    = var.environment
    }
  }
  
  depends_on = [aws_cloudwatch_log_group.lambda_logs]
}

# Matching Algorithm Lambda
resource "aws_lambda_function" "matching_algorithm" {
  filename      = "lambda/matching-algorithm.zip"
  function_name = "${var.project_name}-matching-${var.environment}"
  role          = aws_iam_role.lambda_execution.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 30
  memory_size   = 1024
  
  environment {
    variables = {
      PROFILES_TABLE = aws_dynamodb_table.profiles.name
      MATCHES_TABLE  = aws_dynamodb_table.matches.name
      SWIPES_TABLE   = aws_dynamodb_table.swipes.name
      ENVIRONMENT    = var.environment
    }
  }
  
  depends_on = [aws_cloudwatch_log_group.lambda_logs]
}

# Chat Handler Lambda
resource "aws_lambda_function" "chat_handler" {
  filename      = "lambda/chat-handler.zip"
  function_name = "${var.project_name}-chat-${var.environment}"
  role          = aws_iam_role.lambda_execution.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 30
  memory_size   = 512
  
  environment {
    variables = {
      MESSAGES_TABLE = aws_dynamodb_table.messages.name
      ENVIRONMENT    = var.environment
    }
  }
  
  depends_on = [aws_cloudwatch_log_group.lambda_logs]
}

# SNS Topic for notifications
resource "aws_sns_topic" "notifications" {
  name = "${var.project_name}-notifications-${var.environment}"
  
  tags = {
    Name = "User Notifications"
  }
}

# SQS Queue for async processing
resource "aws_sqs_queue" "async_tasks" {
  name                       = "${var.project_name}-async-tasks-${var.environment}"
  visibility_timeout_seconds = 300
  message_retention_seconds  = 1209600
  
  tags = {
    Name = "Async Tasks Queue"
  }
}
