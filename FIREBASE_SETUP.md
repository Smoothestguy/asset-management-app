# Firebase Authentication Setup Guide

## 🔥 Setting Up Firebase for Production

Your Personal Asset Tracker now uses **real Firebase authentication** instead of mock authentication. Follow these steps to set up Firebase for production use.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Enter project name: `personal-asset-tracker` (or your preferred name)
4. Choose whether to enable Google Analytics (recommended)
5. Click **"Create project"**

## Step 2: Enable Authentication

1. In your Firebase project dashboard, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Enable the following providers:

### Email/Password Authentication
- Click **"Email/Password"**
- Enable **"Email/Password"**
- Optionally enable **"Email link (passwordless sign-in)"**
- Click **"Save"**

### Google Authentication (Optional)
- Click **"Google"**
- Enable the provider
- Select your project support email
- Click **"Save"**

### GitHub Authentication (Optional)
- Click **"GitHub"**
- Enable the provider
- You'll need to create a GitHub OAuth App:
  1. Go to GitHub Settings > Developer settings > OAuth Apps
  2. Click "New OAuth App"
  3. Fill in the details and get Client ID and Client Secret
  4. Add them to Firebase
- Click **"Save"**

## Step 3: Get Firebase Configuration

1. Go to **Project Settings** (gear icon in left sidebar)
2. Scroll down to **"Your apps"** section
3. Click **"Add app"** and select the web icon (`</>`)
4. Register your app with nickname: `personal-asset-tracker-web`
5. Copy the Firebase configuration object

## Step 4: Configure Environment Variables

1. Create a `.env` file in your project root (copy from `.env.example`)
2. Replace the placeholder values with your Firebase config:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Step 5: Configure Authentication Settings

### Email Verification (Recommended)
1. In Firebase Console > Authentication > Settings
2. Under **"User account linking"**, configure as needed
3. Under **"Authorized domains"**, add your production domain

### Password Policy
1. Go to Authentication > Settings > Password policy
2. Set minimum password length (default: 6 characters)
3. Configure additional requirements as needed

## Step 6: Set Up Security Rules (Important!)

1. Go to **Firestore Database** (if you plan to use it)
2. Click **"Rules"** tab
3. Set up proper security rules (example provided below)

## Features Now Available

✅ **Real Email/Password Authentication**
- User registration with email verification
- Secure login with proper error handling
- Password reset functionality
- Account management (update profile, change password, delete account)

✅ **Social Authentication**
- Google Sign-In (if enabled)
- GitHub Sign-In (if enabled)

✅ **Security Features**
- Email verification required for new accounts
- Password strength validation
- User-friendly error messages
- Secure session management

✅ **Production Ready**
- Environment variable configuration
- Proper error handling
- Firebase security rules ready

## Testing the Setup

1. Start your development server: `pnpm dev`
2. Try creating a new account - you should receive an email verification
3. Test login with the new account
4. Test password reset functionality
5. Test social sign-in (if enabled)

## Important Security Notes

⚠️ **Never commit your `.env` file to version control**
⚠️ **Set up proper Firebase security rules before going live**
⚠️ **Enable email verification for production**
⚠️ **Configure authorized domains in Firebase Console**

## Next Steps

1. Set up Firestore security rules if using database
2. Configure email templates in Firebase Console
3. Set up monitoring and analytics
4. Test thoroughly before production deployment

Your app now has enterprise-grade authentication! 🎉
