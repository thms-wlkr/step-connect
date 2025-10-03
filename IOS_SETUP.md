# iOS App Store Setup Guide

Your React app is now ready for iOS! Here's how to get it in the App Store.

## ✅ What's Done

- Capacitor installed and configured
- iOS project created in `/ios` folder
- Your React app will run natively on iOS
- All your existing code works as-is

## 📱 Next Steps

### 1. Install Xcode (Required for iOS development)

```bash
# Download Xcode from Mac App Store (free, ~40GB)
# Or visit: https://apps.apple.com/us/app/xcode/id497799835
```

After installing Xcode:
```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
```

### 2. Install CocoaPods (iOS dependency manager)

```bash
sudo gem install cocoapods
cd ios/App
pod install
```

### 3. Open in Xcode

```bash
npx cap open ios
```

This opens your iOS project in Xcode.

### 4. Configure App in Xcode

In Xcode:
1. Click on "App" in the left sidebar
2. Under "Signing & Capabilities":
   - Select your Team (you'll need an Apple Developer account - $99/year)
   - Bundle Identifier: `com.stepbuddy.app` (or change to your preference)
3. Update Display Name to "walkr"
4. Set minimum iOS version to 13.0 or higher

### 5. Test on Simulator

In Xcode:
1. Select a simulator (e.g., iPhone 15 Pro)
2. Click the Play button (▶️)
3. Your app will launch in the simulator

### 6. Test on Real Device

1. Connect your iPhone via USB
2. Select your device in Xcode
3. Click Play
4. On your iPhone: Settings > General > VPN & Device Management > Trust your developer certificate

## 🚀 Deploy to App Store

### Prerequisites

1. **Apple Developer Account** ($99/year)
   - Sign up at: https://developer.apple.com

2. **App Store Connect Setup**
   - Go to: https://appstoreconnect.apple.com
   - Click "My Apps" > "+" > "New App"
   - Fill in app details:
     - Platform: iOS
     - Name: walkr
     - Primary Language: English
     - Bundle ID: com.stepbuddy.app
     - SKU: stepbuddy-001

### Create App Icons

You need icons in these sizes:
- 1024x1024 (App Store)
- 180x180, 120x120, 87x87, 80x80, 76x76, 60x60, 58x58, 40x40, 29x29, 20x20

Use a tool like:
- https://www.appicon.co (free)
- https://makeappicon.com (free)

Place icons in: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### Build for Release

In Xcode:
1. Select "Any iOS Device (arm64)" as target
2. Product > Archive
3. Wait for build to complete
4. Click "Distribute App"
5. Select "App Store Connect"
6. Follow the wizard

### Submit for Review

In App Store Connect:
1. Add app description, screenshots, keywords
2. Set pricing (free or paid)
3. Add privacy policy URL (required!)
4. Submit for review

**Review time:** Usually 1-3 days

## 🔄 Update Your App

When you make changes to your React code:

```bash
# 1. Build your React app
npm run build

# 2. Sync with iOS
npx cap sync ios

# 3. Open in Xcode
npx cap open ios

# 4. Test and deploy
```

## 📝 Important Files

- `capacitor.config.ts` - Capacitor configuration
- `ios/App/App/Info.plist` - iOS app permissions and settings
- `ios/App/Podfile` - iOS dependencies

## 🎨 Customization

### App Name
Edit in Xcode: App > General > Display Name

### App Icon
Replace icons in: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### Splash Screen
Edit: `ios/App/App/Assets.xcassets/Splash.imageset/`

### Permissions (for future features)

Add to `ios/App/App/Info.plist`:

```xml
<!-- Camera access (for photo verification) -->
<key>NSCameraUsageDescription</key>
<string>Take photos for your profile</string>

<!-- Location access (for finding nearby walkers) -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>Find walking buddies near you</string>

<!-- Photo library (for profile photos) -->
<key>NSPhotoLibraryUsageDescription</key>
<string>Choose photos for your profile</string>

<!-- Health data (for step tracking) -->
<key>NSHealthShareUsageDescription</key>
<string>Track your walking progress</string>
<key>NSHealthUpdateUsageDescription</key>
<string>Update your step count</string>
```

## 🐛 Troubleshooting

### "xcode-select: error"
```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

### "CocoaPods not installed"
```bash
sudo gem install cocoapods
```

### "No provisioning profile"
- You need an Apple Developer account ($99/year)
- In Xcode: Signing & Capabilities > Select your team

### App crashes on device
- Check Console in Xcode for errors
- Ensure all permissions are in Info.plist

## 📱 Native Features You Can Add

With Capacitor, you can easily add:

```typescript
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { PushNotifications } from '@capacitor/push-notifications';
import { Haptics } from '@capacitor/haptics';

// Take photo
const photo = await Camera.getPhoto({
  quality: 90,
  allowEditing: true,
  resultType: CameraResultType.Uri
});

// Get location
const position = await Geolocation.getCurrentPosition();

// Haptic feedback
await Haptics.impact({ style: ImpactStyle.Medium });
```

## 🎯 Next Steps After iOS

1. **Android**: `npx cap add android` (same process)
2. **Push Notifications**: Set up Firebase Cloud Messaging
3. **Analytics**: Add Firebase Analytics
4. **Crash Reporting**: Add Sentry or Firebase Crashlytics

## 📚 Resources

- Capacitor Docs: https://capacitorjs.com/docs
- iOS Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/

---

**You're ready for the App Store! 🎉**

Your React app now runs natively on iOS with zero code changes.
