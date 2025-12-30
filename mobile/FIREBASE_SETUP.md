# Firebase Setup Guide for Push Notifications

This guide will help you set up Firebase Cloud Messaging (FCM) for push notifications in the Brewfest mobile app.

## Prerequisites

- A Firebase account (https://console.firebase.google.com/)
- Access to the Google Cloud Console
- Xcode (for iOS)
- Android Studio (for Android)

## Step 1: Create a Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name: "Brewfest" (or your preferred name)
   - Disable Google Analytics if not needed
   - Click "Create project"

## Step 2: Add iOS App to Firebase

1. In the Firebase Console, click the iOS icon to add an iOS app
2. Fill in the required information:
   - **iOS bundle ID**: `com.example.mobile` (or your custom bundle ID from Xcode)
   - App nickname: "Brewfest iOS" (optional)
   - App Store ID: (leave blank for now)
3. Click "Register app"
4. **Download `GoogleService-Info.plist`**
5. Add the file to your iOS project:
   - Open `ios/Runner.xcworkspace` in Xcode
   - Right-click on the `Runner` folder in Xcode
   - Select "Add Files to Runner"
   - Select the downloaded `GoogleService-Info.plist`
   - **Important**: Make sure "Copy items if needed" is checked
   - Make sure the file is added to the "Runner" target

## Step 3: Add Android App to Firebase

1. In the Firebase Console, click the Android icon to add an Android app
2. Fill in the required information:
   - **Android package name**: `com.example.mobile` (must match your `applicationId` in `android/app/build.gradle`)
   - App nickname: "Brewfest Android" (optional)
   - Debug signing certificate SHA-1: (optional for now)
3. Click "Register app"
4. **Download `google-services.json`**
5. Move the file to your Android app:
   - Place it in `android/app/google-services.json`

## Step 4: Configure iOS for Push Notifications

### Enable Push Notifications in Xcode

1. Open `ios/Runner.xcworkspace` in Xcode
2. Select the "Runner" project in the navigator
3. Select the "Runner" target
4. Go to the "Signing & Capabilities" tab
5. Click "+ Capability"
6. Add "Push Notifications"
7. Add "Background Modes" and check:
   - Background fetch
   - Remote notifications

### Configure APNs (Apple Push Notification service)

1. Go to https://developer.apple.com/account/
2. Navigate to "Certificates, Identifiers & Profiles"
3. Create an APNs authentication key:
   - Click "Keys" → "+" button
   - Enter a name (e.g., "Brewfest APNs Key")
   - Check "Apple Push Notifications service (APNs)"
   - Click "Continue" → "Register" → "Download"
   - **Save the `.p8` file securely** (you can't download it again)
   - Note the Key ID

4. Upload APNs key to Firebase:
   - Go to Firebase Console → Project Settings → Cloud Messaging
   - Under "Apple app configuration", click "Upload"
   - Upload your `.p8` file
   - Enter your Key ID and Team ID (found in Apple Developer account)

## Step 5: Configure Android for Push Notifications

The `google-services.json` file should be sufficient for Android. The build system will automatically configure FCM.

### Optional: Get Server Key for Backend

1. In Firebase Console, go to Project Settings → Cloud Messaging
2. Under "Cloud Messaging API (Legacy)", find your Server Key
3. **Copy this key** - you'll need it in your backend API

OR (Recommended - newer method):

1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Select your Firebase project
3. Enable "Firebase Cloud Messaging API"
4. Create a service account and download the JSON key
5. Use this service account key in your backend for sending notifications

## Step 6: Update Info.plist (iOS)

Add the following to `ios/Runner/Info.plist` (inside the `<dict>` tag):

```xml
<key>FirebaseAppDelegateProxyEnabled</key>
<false/>
```

## Step 7: Verify Installation

Run the app and check the console logs for:

```
✅ [Main] Firebase initialized
✅ [NotificationService] Initialized successfully
📱 [NotificationService] FCM Token: [your-token]
```

If you see these messages, Firebase is configured correctly!

## Step 8: Backend Configuration

Make sure your Rust backend is configured with Firebase credentials:

1. Copy your Firebase service account JSON key
2. Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable or configure FCM in your backend
3. Ensure the backend can send notifications using the FCM API

## Testing Notifications

1. Launch the app
2. Go to the "Alerts" tab
3. Tap "Subscribe" to subscribe to event notifications
4. Tap "Send Test" to send a test notification
5. You should receive a notification on your device

## Troubleshooting

### iOS: "No Firebase App '[DEFAULT]' has been created"
- Make sure `GoogleService-Info.plist` is in the Xcode project
- Make sure it's added to the Runner target
- Clean build folder (Xcode → Product → Clean Build Folder)

### Android: Build fails with google-services error
- Make sure `google-services.json` is in `android/app/`
- Make sure the package name matches in both files
- Run `flutter clean && flutter pub get`

### Not receiving notifications
- Check that you've subscribed in the app
- Check that notification permissions are granted
- Check backend logs to see if notifications are being sent
- Check that your device token is registered in the database
- Make sure your backend has valid Firebase credentials

### iOS: Notifications not appearing
- Make sure APNs key is uploaded to Firebase
- Check that Push Notifications capability is enabled in Xcode
- Make sure you're testing on a real device (not simulator)
- Check iOS Settings → Notifications → Brewfest → Allow Notifications

## Additional Resources

- Firebase Console: https://console.firebase.google.com/
- FlutterFire Documentation: https://firebase.flutter.dev/
- FCM Documentation: https://firebase.google.com/docs/cloud-messaging
- Apple Developer: https://developer.apple.com/
