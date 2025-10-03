variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "eu-west-2"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "stepbuddy"
}

variable "google_client_id" {
  description = "Google OAuth client ID"
  type        = string
  sensitive   = true
  default     = "placeholder-setup-later"
}

variable "google_client_secret" {
  description = "Google OAuth client secret"
  type        = string
  sensitive   = true
  default     = "placeholder-setup-later"
}

variable "cognito_callback_urls" {
  description = "Allowed callback URLs for Cognito"
  type        = list(string)
  default     = [
    "http://localhost:5173",
    "https://app.gowalkr.com",
    "gowalkr://callback",
    "gowalkr://auth"
  ]
}

variable "cognito_logout_urls" {
  description = "Allowed logout URLs for Cognito"
  type        = list(string)
  default     = [
    "http://localhost:5173",
    "https://app.gowalkr.com",
    "gowalkr://logout"
  ]
}

variable "allowed_origins" {
  description = "Allowed CORS origins for S3"
  type        = list(string)
  default     = [
    "http://localhost:5173",
    "https://app.gowalkr.com",
    "capacitor://localhost",
    "http://localhost",
    "ionic://localhost"
  ]
}

variable "enable_waf" {
  description = "Enable AWS WAF for API Gateway"
  type        = bool
  default     = false
}

variable "enable_xray" {
  description = "Enable AWS X-Ray tracing"
  type        = bool
  default     = false
}

variable "domain_name" {
  description = "Root domain name (e.g., gowalkr.com)"
  type        = string
  default     = "gowalkr.com"
}

variable "api_subdomain" {
  description = "Subdomain for API (e.g., api.gowalkr.com)"
  type        = string
  default     = "api"
}

variable "auth_subdomain" {
  description = "Subdomain for Cognito auth (e.g., auth.gowalkr.com)"
  type        = string
  default     = "auth"
}

variable "cdn_subdomain" {
  description = "Subdomain for CDN (e.g., cdn.gowalkr.com)"
  type        = string
  default     = "cdn"
}

variable "route53_role_arn" {
  description = "IAM role ARN for cross-account Route 53 access in management account"
  type        = string
  default     = "arn:aws:iam::784074784474:role/Route53CrossAccountRole"
}

variable "management_account_id" {
  description = "AWS Management account ID where Route 53 hosted zone exists"
  type        = string
  default     = "784074784474"
}
