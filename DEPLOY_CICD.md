# Deploy gowalkr Backend with CI/CD

## Setup GitHub Actions for Automatic Deployment

### Step 1: Add AWS Credentials to GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"

Add these secrets:

**AWS_ACCESS_KEY_ID**
```
Your AWS access key
```

**AWS_SECRET_ACCESS_KEY**
```
Your AWS secret key
```

**GOOGLE_CLIENT_ID** (optional for now)
```
placeholder-setup-later
```

**GOOGLE_CLIENT_SECRET** (optional for now)
```
placeholder-setup-later
```

### Step 2: Push to Main Branch

```bash
git add .
git commit -m "Setup CI/CD for backend deployment"
git push origin main
```

GitHub Actions will automatically:
1. Initialize Terraform
2. Validate configuration
3. Plan deployment
4. Apply changes to AWS
5. Output your API URLs

### Step 3: Monitor Deployment

1. Go to GitHub → Actions tab
2. Watch the "Deploy Backend to AWS" workflow
3. Takes 10-15 minutes first time

### Step 4: Get Your URLs

After deployment completes:
1. Go to Actions → Latest workflow run
2. Check the summary for your URLs:
   - API: https://api.gowalkr.com
   - Auth: auth-prod.gowalkr.com
   - CDN: https://cdn.gowalkr.com

## Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
cd terraform

# Initialize
terraform init

# Plan (review changes)
terraform plan \
  -var="google_client_id=placeholder-setup-later" \
  -var="google_client_secret=placeholder-setup-later"

# Apply (deploy)
terraform apply \
  -var="google_client_id=placeholder-setup-later" \
  -var="google_client_secret=placeholder-setup-later"

# Get outputs
terraform output frontend_config
```

## Environment Variables (All Optional)

Override defaults by passing `-var` flags:

```bash
terraform apply \
  -var="environment=dev" \
  -var="aws_region=us-west-2" \
  -var="domain_name=gowalkr.com" \
  -var="google_client_id=$GOOGLE_CLIENT_ID"
```

## Default Configuration

All variables have sensible defaults in `variables.tf`:

- **domain_name**: gowalkr.com
- **api_subdomain**: api
- **auth_subdomain**: auth
- **cdn_subdomain**: cdn
- **aws_region**: us-east-1
- **environment**: prod
- **project_name**: gowalkr

## CI/CD Workflow

The workflow runs when:
- You push to `main` branch
- Changes are in `terraform/` or `lambda/` directories
- You manually trigger it

## Troubleshooting

### "AWS credentials not found"
- Add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to GitHub Secrets

### "Terraform state locked"
- Another deployment is running
- Wait for it to finish

### "Domain not found"
- Ensure gowalkr.com is in Route 53
- Check AWS region is us-east-1

## Next Steps

1. ✅ CI/CD configured
2. ✅ Push to deploy
3. Get API URLs from workflow output
4. Configure frontend
5. Deploy iOS app

---

**No terraform.tfvars needed! Everything uses defaults or GitHub Secrets.**
