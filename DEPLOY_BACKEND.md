# Deploy gowalkr Backend to AWS

## Prerequisites

✅ AWS Account
✅ AWS CLI installed and configured
✅ Terraform installed (v1.0+)
✅ gowalkr.com domain in Route 53

## Step 1: Configure AWS CLI

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: us-east-1
# Default output format: json
```

## Step 2: Review Configuration

Check `terraform/terraform.tfvars`:
- ✅ domain_name = "gowalkr.com"
- ✅ api_subdomain = "api"
- ✅ auth_subdomain = "auth"
- ✅ cdn_subdomain = "cdn"

## Step 3: Initialize Terraform

```bash
cd terraform
terraform init
```

This downloads AWS provider and sets up Terraform.

## Step 4: Plan Deployment

```bash
terraform plan
```

Review what will be created:
- DynamoDB tables (users, profiles, matches, messages, swipes)
- Cognito User Pool (authentication)
- API Gateway (REST API)
- Lambda Functions (matching, chat, user management)
- S3 + CloudFront (photo storage)
- Route 53 DNS records
- SSL Certificates

## Step 5: Deploy!

```bash
terraform apply
```

Type `yes` when prompted.

**Time: 10-15 minutes** (SSL certificates take longest)

## Step 6: Get Your URLs

```bash
terraform output frontend_config
```

You'll see:
```json
{
  "api_url": "https://api.gowalkr.com",
  "auth_domain": "auth-prod.gowalkr.com",
  "cdn_url": "https://cdn.gowalkr.com",
  "user_pool_id": "us-east-1_ABC123",
  "user_pool_client_id": "abc123def456",
  "region": "us-east-1"
}
```

## Step 7: Test Your API

```bash
# Test API is live
curl https://api.gowalkr.com/health

# Should return: {"status": "ok"}
```

## What Got Deployed

### Your Custom Domains
- `https://api.gowalkr.com` - REST API
- `auth-prod.gowalkr.com` - Authentication
- `https://cdn.gowalkr.com` - Photo CDN

### AWS Resources
- **DynamoDB**: 5 tables for data storage
- **Cognito**: User authentication
- **Lambda**: 3 functions for backend logic
- **API Gateway**: REST + WebSocket APIs
- **S3**: Photo storage
- **CloudFront**: CDN for fast photo delivery
- **Route 53**: DNS records
- **ACM**: SSL certificates (free!)

### Monthly Cost
- **First year**: $5-15/month (free tier)
- **After free tier**: $20-50/month (1K users)

## Troubleshooting

### "Error: domain not found"
- Check gowalkr.com is in Route 53
- Verify hosted zone exists

### "Certificate validation timeout"
- Wait 5-10 minutes for DNS propagation
- Check Route 53 has validation records

### "Access Denied"
- Run `aws configure` again
- Check IAM permissions

### "Resource already exists"
- Someone else deployed already
- Or previous deployment didn't clean up
- Run `terraform destroy` then `terraform apply`

## Next Steps

1. ✅ Backend deployed
2. Configure frontend with these URLs
3. Test authentication
4. Build iOS app
5. Submit to App Store

## Updating Backend

When you make changes:

```bash
cd terraform
terraform plan    # Review changes
terraform apply   # Deploy changes
```

## Destroying Everything

If you need to start over:

```bash
terraform destroy
```

**Warning**: This deletes ALL data!

## Support

- Terraform docs: https://terraform.io/docs
- AWS docs: https://docs.aws.amazon.com
- Your outputs: `terraform output`

---

**Ready to deploy? Run `terraform apply` in the terraform/ directory!**
