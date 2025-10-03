# Cross-Account Route 53 Setup

Your domain `gowalkr.com` is in the **management account** (784074784474), but you're deploying infrastructure to a **workload account**.

## Architecture

```
Management Account (784074784474)
└── Route 53 Hosted Zone: gowalkr.com
    └── DNS Records created by workload account

Workload Account (your deployment account)
├── API Gateway (eu-west-2)
├── Lambda Functions (eu-west-2)
├── DynamoDB (eu-west-2)
├── S3 + CloudFront (global)
└── SSL Certificates (us-east-1 - required by AWS)
```

## What's Already Configured

✅ Cross-account provider in `main.tf`
✅ Route 53 role ARN: `arn:aws:iam::784074784474:role/Route53CrossAccountRole`
✅ All Route 53 operations use management account
✅ SSL certificates in us-east-1 (AWS requirement)
✅ Infrastructure in eu-west-2 (London)

## IAM Role Requirements

The role `Route53CrossAccountRole` in management account needs:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "route53:GetHostedZone",
        "route53:ListHostedZones",
        "route53:GetChange",
        "route53:ChangeResourceRecordSets",
        "route53:ListResourceRecordSets"
      ],
      "Resource": "*"
    }
  ]
}
```

Trust relationship:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::<WORKLOAD_ACCOUNT_ID>:root"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

## Deployment Flow

1. **Workload account** creates resources (API, Lambda, etc.) in eu-west-2
2. **Workload account** creates SSL certificates in us-east-1
3. **Workload account** assumes role in management account
4. **Management account** creates DNS records in Route 53
5. **Management account** creates certificate validation records

## DNS Records Created

In management account's Route 53:
- `api.gowalkr.com` → API Gateway
- `cdn.gowalkr.com` → CloudFront
- Certificate validation records (TXT)

## Testing Cross-Account Access

```bash
# Test assume role works
aws sts assume-role \
  --role-arn arn:aws:iam::784074784474:role/Route53CrossAccountRole \
  --role-session-name test

# List hosted zones
aws route53 list-hosted-zones \
  --profile management
```

## Troubleshooting

### "Access Denied" on Route 53
- Check role exists in management account
- Verify trust relationship allows workload account
- Confirm IAM permissions on role

### "Certificate validation timeout"
- DNS records take 5-10 minutes to propagate
- Check validation records created in Route 53
- Verify hosted zone ID is correct

### "Hosted zone not found"
- Confirm gowalkr.com exists in management account
- Check zone ID matches
- Verify provider alias is correct

## GitHub Actions Setup

Add to secrets:
- `AWS_ACCESS_KEY_ID` - Workload account credentials
- `AWS_SECRET_ACCESS_KEY` - Workload account credentials

The workload account credentials must have permission to assume the Route53CrossAccountRole.

## Manual Deployment

```bash
cd terraform

# Initialize
terraform init

# Plan (will assume role automatically)
terraform plan

# Apply
terraform apply
```

Terraform will automatically:
1. Use workload account for infrastructure
2. Assume role for Route 53 operations
3. Create certificates in us-east-1
4. Deploy resources in eu-west-2

---

**Everything is configured for cross-account Route 53 access!**
