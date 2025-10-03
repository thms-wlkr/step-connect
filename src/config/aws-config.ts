import { Amplify } from 'aws-amplify';

// AWS Cognito Configuration
// Replace these values with your actual AWS Cognito settings from terraform outputs
export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.EXPO_PUBLIC_USER_POOL_ID || 'us-east-1_XXXXXXXXX',
      userPoolClientId: process.env.EXPO_PUBLIC_USER_POOL_CLIENT_ID || 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        oauth: {
          domain: process.env.EXPO_PUBLIC_COGNITO_DOMAIN || 'stepbuddy-prod.auth.us-east-1.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: ['stepbuddy://'],
          redirectSignOut: ['stepbuddy://'],
          responseType: 'code' as const,
        },
        email: true,
      },
    },
  },
  API: {
    REST: {
      StepBuddyAPI: {
        endpoint: process.env.EXPO_PUBLIC_API_ENDPOINT || 'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod',
        region: process.env.EXPO_PUBLIC_AWS_REGION || 'us-east-1',
      },
    },
  },
  Storage: {
    S3: {
      bucket: process.env.EXPO_PUBLIC_S3_BUCKET || 'stepbuddy-profile-photos-prod',
      region: process.env.EXPO_PUBLIC_AWS_REGION || 'us-east-1',
    },
  },
};

export const configureAmplify = () => {
  Amplify.configure(awsConfig);
};
