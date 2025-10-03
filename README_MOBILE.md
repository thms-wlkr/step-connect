# StepBuddy Mobile App

A React Native mobile app for finding walking partners based on step goals, pace, and location.

## Features Implemented

### Core Features
- ✅ AWS Cognito Authentication (Email/Password)
- ✅ Swipe-to-match interface with real-time animations
- ✅ Real GPS location tracking
- ✅ Distance calculation between users
- ✅ Match management
- ✅ User profiles with walking preferences
- ✅ Achievement badges system

### Safety Features
- ✅ Location-based matching
- ✅ Profile verification ready (AWS Cognito)
- ✅ Block/report functionality ready for backend integration
- 🔄 Background checks (planned for premium)

### Technical Stack
- React Native + TypeScript + Expo
- AWS Amplify for Cognito integration
- React Navigation for routing
- Expo Location for GPS
- React Native Gesture Handler for swipe gestures

## Setup Instructions

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- AWS account with Terraform deployed infrastructure

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure AWS credentials:
   - Copy `.env.example` to `.env`
   - Fill in your AWS Cognito details from terraform outputs:
   ```bash
   terraform output -json > outputs.json
   ```
   - Update `.env` with your User Pool ID, Client ID, API endpoint, etc.

3. Start the development server:
```bash
npx expo start
```

4. Run on device:
   - iOS: Press `i` or scan QR code with Camera app
   - Android: Press `a` or scan QR code with Expo Go app

## Terraform Integration

After deploying the AWS infrastructure with Terraform, you'll need these outputs:

```bash
# Get Cognito User Pool ID
terraform output cognito_user_pool_id

# Get Cognito Client ID
terraform output cognito_user_pool_client_id

# Get API Gateway URL
terraform output api_gateway_url

# Get S3 Bucket for profile photos
terraform output profile_photos_bucket
```

## Building for Production

### iOS (requires macOS)
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## App Store Requirements Checklist

### Required for iOS App Store
- ✅ Privacy policy (location data)
- ✅ Location permission descriptions in app.json
- ✅ Authentication system
- 🔄 Content moderation (block/report)
- 🔄 User verification system

### Required for Google Play Store
- ✅ Privacy policy (location data)
- ✅ Location permissions in app.json
- ✅ Authentication system
- 🔄 Content moderation (block/report)
- 🔄 User verification system

## Next Steps for Production

1. **Safety Features (Critical)**
   - Implement block/report API endpoints
   - Add photo verification flow
   - Add emergency contact features
   - Implement user rating system

2. **Enhanced Matching**
   - Connect to matching algorithm Lambda function
   - Implement real-time match notifications
   - Add group walk support

3. **Engagement**
   - Integrate Apple Health / Google Fit
   - Add walk scheduling with calendar
   - Implement post-walk stats tracking
   - Add gamification features

4. **Push Notifications**
   - Set up Expo Push Notifications
   - Configure SNS topics for notifications
   - Implement notification preferences

5. **Testing**
   - Add unit tests with Jest
   - Add E2E tests with Detox
   - Test on multiple device sizes
   - Beta testing with TestFlight/Play Console

## Architecture

```
src/
├── config/          # AWS Amplify configuration
├── contexts/        # React contexts (Auth)
├── hooks/           # Custom hooks (useLocation)
├── navigation/      # React Navigation setup
├── screens/         # App screens
│   ├── AuthScreen
│   ├── DiscoverScreen (swipe interface)
│   ├── MatchesScreen
│   └── ProfileScreen
├── types/           # TypeScript interfaces
└── App.tsx          # Root component
```

## Environment Variables

Required environment variables in `.env`:
- `EXPO_PUBLIC_USER_POOL_ID` - Cognito User Pool ID
- `EXPO_PUBLIC_USER_POOL_CLIENT_ID` - Cognito App Client ID
- `EXPO_PUBLIC_AWS_REGION` - AWS region
- `EXPO_PUBLIC_COGNITO_DOMAIN` - Cognito hosted UI domain
- `EXPO_PUBLIC_API_ENDPOINT` - API Gateway endpoint
- `EXPO_PUBLIC_S3_BUCKET` - S3 bucket for profile photos

## Troubleshooting

### Location not working
- Ensure location permissions are granted in device settings
- Check that location services are enabled

### Authentication errors
- Verify AWS Cognito configuration in `.env`
- Check that User Pool and App Client are correctly configured in AWS

### Build errors
- Clear Expo cache: `expo start -c`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## Support

For issues or questions, please refer to:
- [Expo Documentation](https://docs.expo.dev/)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [React Navigation Documentation](https://reactnavigation.org/)
