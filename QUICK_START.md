# 🚀 Quick Start - Get Your App on iOS

## What Just Happened?

Your React web app is now an iOS app! No code rewrite needed.

## Immediate Next Steps

### 1. Install Xcode (if you haven't)
- Open Mac App Store
- Search "Xcode"
- Download (it's free, but ~40GB)
- Takes 30-60 minutes to download

### 2. Set Up Xcode Command Line Tools
```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
```

### 3. Install CocoaPods
```bash
sudo gem install cocoapods
cd ios/App
pod install
cd ../..
```

### 4. Open Your iOS App
```bash
npx cap open ios
```

This opens Xcode with your app ready to run!

### 5. Run on Simulator
In Xcode:
1. Select "iPhone 15 Pro" (or any simulator) from the device dropdown
2. Click the Play button (▶️)
3. Your app launches! 🎉

## Making Changes

Every time you update your React code:

```bash
# 1. Build
npm run build

# 2. Sync to iOS
npx cap sync ios

# 3. Open in Xcode (if not already open)
npx cap open ios
```

## App Store Submission

See `IOS_SETUP.md` for complete App Store deployment guide.

**Requirements:**
- Apple Developer Account ($99/year)
- App icons (1024x1024 and various sizes)
- Screenshots (iPhone 6.7", 6.5", 5.5")
- Privacy policy URL
- App description

**Timeline:**
- Setup: 2-3 hours
- Review: 1-3 days

## What Works Right Now

✅ All your React components
✅ Swipe gestures
✅ Navigation
✅ Chat interface
✅ Profile views
✅ Matches display

## What You Can Add Easily

📸 Camera access
📍 Location services
🔔 Push notifications
📊 HealthKit integration
⚡ Haptic feedback

See `IOS_SETUP.md` for code examples.

## Troubleshooting

**"xcode-select: error"**
```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

**"CocoaPods not found"**
```bash
sudo gem install cocoapods
```

**"No team selected"**
- You need an Apple Developer account
- In Xcode: Signing & Capabilities > Select team

## File Structure

```
step-connect/
├── ios/                    # iOS native project
│   └── App/
│       ├── App.xcodeproj  # Xcode project
│       └── App/           # iOS app files
├── src/                   # Your React code (unchanged!)
├── dist/                  # Built web app
└── capacitor.config.ts    # Capacitor config
```

## Commands Reference

```bash
# Build React app
npm run build

# Sync changes to iOS
npx cap sync ios

# Open in Xcode
npx cap open ios

# Update Capacitor
npm install @capacitor/core@latest @capacitor/cli@latest @capacitor/ios@latest

# Clean iOS build
cd ios/App
pod install
cd ../..
npx cap sync ios
```

## Need Help?

- Capacitor Docs: https://capacitorjs.com/docs
- Full iOS Guide: See `IOS_SETUP.md`
- Xcode Help: https://developer.apple.com/xcode/

---

**You're ready to test on iOS! 📱**
