# StepBuddy AWS Infrastructure

This directory contains Terraform configurations to deploy the StepBuddy backend infrastructure on AWS.

## Architecture Overview

The infrastructure includes:
- **AWS Cognito**: User authentication with email/password and Google OAuth
- **DynamoDB**: NoSQL tables for users, profiles, matches, messages, and swipes
- **S3 + CloudFront**: Profile photo storage and CDN delivery
- **API Gateway**: REST API and WebSocket API for real-time messaging
- **Lambda**: Serverless functions for business logic
- **SNS/SQS**: Notifications and async task processing

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **Terraform** >= 1.0 installed ([Download](https://www.terraform.io/downloads))
3. **AWS CLI** configured with credentials ([Setup Guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html))
4. **Google OAuth Credentials** (if using Google sign-in):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

## Quick Start

### 1. Configure Variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your values:
- Update `google_client_id` and `google_client_secret`
- Set your domain URLs in `cognito_callback_urls`, `cognito_logout_urls`, and `allowed_origins`
- Choose your AWS region

### 2. Initialize Terraform

```bash
terraform init
```

This downloads required providers and modules.

### 3. Review Infrastructure Plan

```bash
terraform plan
```

Review what resources will be created. Check for any errors.

### 4. Deploy Infrastructure

```bash
terraform apply
```

Type `yes` when prompted. Deployment takes ~5-10 minutes.

### 5. Get Output Values

```bash
terraform output
```

Save these values - you'll need them to configure your frontend:
- `cognito_user_pool_id`
- `cognito_user_pool_client_id`
- `api_gateway_url`
- `websocket_api_endpoint`
- `cloudfront_domain`

## Lambda Functions

Before deploying, you need to create Lambda function code. Create these files:

```
lambda/
├── user-management/
│   ├── index.js
│   └── package.json
├── matching-algorithm/
│   ├── index.js
│   └── package.json
└── chat-handler/
    ├── index.js
    └── package.json
```

### Example Lambda Structure

**lambda/user-management/index.js**:
```javascript
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const { httpMethod, pathParameters, body } = event;
    
    if (httpMethod === 'GET') {
      // Get user profile
      const result = await ddb.send(new GetCommand({
        TableName: process.env.USERS_TABLE,
        Key: { id: pathParameters.id }
      }));
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(result.Item)
      };
    }
    
    // Add other methods...
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### Package Lambda Functions

```bash
cd lambda/user-management
npm install
zip -r ../user-management.zip .
cd ../..
```

Repeat for each Lambda function.

## DynamoDB Table Structures

### Users Table
- **Hash Key**: `id` (String) - User ID from Cognito
- **Attributes**: email, createdAt, lastLogin

### Profiles Table
- **Hash Key**: `userId` (String)
- **Attributes**: name, photoUrl, age, location, stepGoal, pace, availability, bio, badges
- **GSI**: LocationIndex on `location`

### Matches Table
- **Hash Key**: `id` (String)
- **Range Key**: `matchedAt` (String - ISO timestamp)
- **Attributes**: userA, userB
- **GSI**: UserAIndex, UserBIndex for querying user's matches

### Messages Table
- **Hash Key**: `conversationId` (String) - Format: `{userA}-{userB}` (sorted)
- **Range Key**: `timestamp` (String - ISO timestamp)
- **Attributes**: fromUserId, toUserId, content
- **GSI**: FromUserIndex for querying sent messages
- **Stream**: Enabled for real-time updates

### Swipes Table
- **Hash Key**: `userId` (String)
- **Range Key**: `targetUserId` (String)
- **Attributes**: direction (left/right), swipedAt

## API Endpoints

### REST API
- `GET /profiles` - Get potential matches (filtered by location, preferences)
- `POST /swipe` - Record swipe action
- `GET /matches` - Get user's matches
- `GET /users/{id}` - Get user profile
- `PUT /users/{id}` - Update user profile

### WebSocket API
- `$connect` - Establish WebSocket connection
- `$disconnect` - Close connection
- `sendMessage` - Send chat message

## Monitoring & Logs

View logs in CloudWatch:
```bash
aws logs tail /aws/lambda/stepbuddy-prod --follow
aws logs tail /aws/apigateway/stepbuddy-api-prod --follow
```

## Cost Estimation

**Monthly costs (estimated for moderate usage):**
- DynamoDB: ~$25-50 (pay per request)
- Lambda: ~$10-30 (1M requests free tier)
- API Gateway: ~$15-25
- S3 + CloudFront: ~$10-20
- Cognito: Free tier up to 50k MAU
- **Total: ~$60-125/month**

Actual costs depend on traffic. AWS Free Tier can significantly reduce initial costs.

## Cleanup

To destroy all infrastructure:

```bash
terraform destroy
```

**Warning**: This deletes all data! Make backups first.

## Security Best Practices

1. **Enable MFA** for AWS root account
2. **Use IAM roles** with least privilege
3. **Enable CloudTrail** for audit logging
4. **Set up AWS Budget** alerts
5. **Rotate secrets** regularly
6. **Enable WAF** for production (set `enable_waf = true`)
7. **Review RLS policies** for DynamoDB access

## Troubleshooting

### Lambda Timeout Errors
Increase timeout in `main.tf`:
```hcl
timeout = 60  # Increase from 30
```

### CORS Issues
Verify `allowed_origins` includes your domain.

### Cognito Redirect Errors
Check `cognito_callback_urls` match exactly (including trailing slashes).

### DynamoDB Throttling
Switch to provisioned capacity or increase WCU/RCU.

## Next Steps

1. Implement Lambda function business logic
2. Set up CI/CD pipeline
3. Configure custom domain with Route53
4. Add monitoring dashboards
5. Implement backup strategy
6. Set up staging environment

## Support

For issues or questions:
- AWS Documentation: https://docs.aws.amazon.com/
- Terraform AWS Provider: https://registry.terraform.io/providers/hashicorp/aws/latest/docs
