import {
  auth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "./firebaseConfig";

class FirebaseAuthService {
  constructor() {
    this.auth = auth;
    this.googleProvider = new GoogleAuthProvider();
    this.githubProvider = new GithubAuthProvider();
  }

  // Initialize Firebase Auth listener
  initAuthListener(callback) {
    return onAuthStateChanged(this.auth, callback);
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      return {
        success: true,
        user: this.formatFirebaseUser(result.user),
        provider: "google",
      };
    } catch (error) {
      console.error("Google sign-in error:", error);
      return {
        success: false,
        error: error.message || "Google sign-in failed",
      };
    }
  }

  // Sign in with GitHub
  async signInWithGitHub() {
    try {
      const result = await signInWithPopup(this.auth, this.githubProvider);
      return {
        success: true,
        user: this.formatFirebaseUser(result.user),
        provider: "github",
      };
    } catch (error) {
      console.error("GitHub sign-in error:", error);
      return {
        success: false,
        error: error.message || "GitHub sign-in failed",
      };
    }
  }

  // Sign in with email and password
  async signInWithEmailAndPassword(email, password) {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return {
        success: true,
        user: this.formatFirebaseUser(result.user),
        provider: "email",
      };
    } catch (error) {
      console.error("Email sign-in error:", error);
      return {
        success: false,
        error: this.getAuthErrorMessage(error.code) || "Email sign-in failed",
      };
    }
  }

  // Create user with email and password
  async createUserWithEmailAndPassword(email, password, displayName) {
    try {
      const result = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // Update the user's display name
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }

      // Send email verification
      await sendEmailVerification(result.user);

      return {
        success: true,
        user: this.formatFirebaseUser(result.user),
        provider: "email",
        emailVerificationSent: true,
      };
    } catch (error) {
      console.error("Email registration error:", error);
      return {
        success: false,
        error: this.getAuthErrorMessage(error.code) || "Registration failed",
      };
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return { success: true };
    } catch (error) {
      console.error("Password reset error:", error);
      return {
        success: false,
        error: this.getAuthErrorMessage(error.code) || "Password reset failed",
      };
    }
  }

  // Send email verification
  async sendEmailVerification() {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        return { success: false, error: "No user signed in" };
      }
      await sendEmailVerification(user);
      return { success: true };
    } catch (error) {
      console.error("Email verification error:", error);
      return {
        success: false,
        error: error.message || "Email verification failed",
      };
    }
  }

  // Sign out from Firebase
  async signOut() {
    try {
      await signOut(this.auth);
      return { success: true };
    } catch (error) {
      console.error("Firebase sign-out error:", error);
      return {
        success: false,
        error: error.message || "Sign-out failed",
      };
    }
  }

  // Get user-friendly error messages for Firebase auth errors
  getAuthErrorMessage(errorCode) {
    const errorMessages = {
      "auth/user-not-found": "No account found with this email address.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/weak-password": "Password should be at least 6 characters long.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/user-disabled": "This account has been disabled.",
      "auth/too-many-requests":
        "Too many failed attempts. Please try again later.",
      "auth/network-request-failed":
        "Network error. Please check your connection.",
      "auth/requires-recent-login":
        "Please sign in again to complete this action.",
      "auth/invalid-credential":
        "Invalid credentials. Please check your email and password.",
      "auth/popup-closed-by-user":
        "Sign-in popup was closed before completion.",
      "auth/cancelled-popup-request": "Sign-in was cancelled.",
      "auth/popup-blocked": "Sign-in popup was blocked by your browser.",
    };

    return (
      errorMessages[errorCode] ||
      "An unexpected error occurred. Please try again."
    );
  }

  // Format Firebase user data to match our app's user structure
  formatFirebaseUser(firebaseUser) {
    if (!firebaseUser) return null;

    return {
      id: firebaseUser.uid,
      name:
        firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
      email: firebaseUser.email,
      avatar: firebaseUser.photoURL,
      provider: firebaseUser.providerId,
      createdAt: new Date().toISOString(),
      preferences: {
        theme: "dark",
        neonIntensity: 75,
        animationSpeed: 86,
        particleEffects: true,
        soundEffects: false,
      },
    };
  }

  // Get current Firebase user
  getCurrentUser() {
    return this.auth.currentUser
      ? this.formatFirebaseUser(this.auth.currentUser)
      : null;
  }

  // Check if user is signed in with Firebase
  isSignedIn() {
    return !!this.auth.currentUser;
  }
}

export default new FirebaseAuthService();
