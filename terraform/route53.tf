# Route 53 DNS Configuration for gowalkr.com

# Get existing hosted zone for gowalkr.com from management account
data "aws_route53_zone" "main" {
  provider     = aws.management
  name         = var.domain_name
  private_zone = false
}

# SSL Certificate for API Gateway (must be in us-east-1 for CloudFront/API Gateway)
resource "aws_acm_certificate" "api" {
  provider          = aws.us_east_1
  domain_name       = "${var.api_subdomain}.${var.domain_name}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "API Certificate"
  }
}

# DNS validation for API certificate (in management account)
resource "aws_route53_record" "api_cert_validation" {
  provider = aws.management
  
  for_each = {
    for dvo in aws_acm_certificate.api.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.main.zone_id
}

# Wait for certificate validation
resource "aws_acm_certificate_validation" "api" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.api.arn
  validation_record_fqdns = [for record in aws_route53_record.api_cert_validation : record.fqdn]
}

# SSL Certificate for CloudFront (CDN)
resource "aws_acm_certificate" "cdn" {
  provider          = aws.us_east_1
  domain_name       = "${var.cdn_subdomain}.${var.domain_name}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "CDN Certificate"
  }
}

# DNS validation for CDN certificate (in management account)
resource "aws_route53_record" "cdn_cert_validation" {
  provider = aws.management
  
  for_each = {
    for dvo in aws_acm_certificate.cdn.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.main.zone_id
}

# Wait for CDN certificate validation
resource "aws_acm_certificate_validation" "cdn" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.cdn.arn
  validation_record_fqdns = [for record in aws_route53_record.cdn_cert_validation : record.fqdn]
}

# DNS record for API Gateway (in management account)
resource "aws_route53_record" "api" {
  provider = aws.management
  zone_id  = data.aws_route53_zone.main.zone_id
  name     = "${var.api_subdomain}.${var.domain_name}"
  type     = "A"

  alias {
    name                   = aws_api_gateway_domain_name.api.cloudfront_domain_name
    zone_id                = aws_api_gateway_domain_name.api.cloudfront_zone_id
    evaluate_target_health = false
  }
}

# DNS record for CloudFront CDN (in management account)
resource "aws_route53_record" "cdn" {
  provider = aws.management
  zone_id  = data.aws_route53_zone.main.zone_id
  name     = "${var.cdn_subdomain}.${var.domain_name}"
  type     = "A"

  alias {
    name                   = aws_cloudfront_distribution.profile_photos_cdn.domain_name
    zone_id                = aws_cloudfront_distribution.profile_photos_cdn.hosted_zone_id
    evaluate_target_health = false
  }
}

# Custom domain for API Gateway
resource "aws_api_gateway_domain_name" "api" {
  domain_name              = "${var.api_subdomain}.${var.domain_name}"
  regional_certificate_arn = aws_acm_certificate_validation.api.certificate_arn

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  depends_on = [aws_acm_certificate_validation.api]
}

# Map API Gateway stage to custom domain
resource "aws_api_gateway_base_path_mapping" "api" {
  api_id      = aws_api_gateway_rest_api.main.id
  stage_name  = aws_api_gateway_stage.prod.stage_name
  domain_name = aws_api_gateway_domain_name.api.domain_name
}

# Cognito custom domain
resource "aws_cognito_user_pool_domain" "main" {
  domain          = var.auth_subdomain
  user_pool_id    = aws_cognito_user_pool.main.id
  certificate_arn = aws_acm_certificate_validation.api.certificate_arn

  depends_on = [aws_acm_certificate_validation.api]
}
