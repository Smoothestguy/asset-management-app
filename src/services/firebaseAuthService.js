import { auth, GoogleAuthProvider, GitHubAuthProvider } from './firebaseConfig';

class FirebaseAuthService {
  constructor() {
    this.auth = auth;
    this.googleProvider = new GoogleAuthProvider();
    this.githubProvider = new GitHubAuthProvider();
  }

  // Initialize Firebase Auth listener
  initAuthListener(callback) {
    return this.auth.onAuthStateChanged(callback);
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const result = await this.auth.signInWithPopup(this.googleProvider);
      return {
        success: true,
        user: this.formatFirebaseUser(result.user),
        provider: 'google'
      };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return {
        success: false,
        error: error.message || 'Google sign-in failed'
      };
    }
  }

  // Sign in with GitHub
  async signInWithGitHub() {
    try {
      const result = await this.auth.signInWithGitHub();
      return {
        success: true,
        user: this.formatFirebaseUser(result.user),
        provider: 'github'
      };
    } catch (error) {
      console.error('GitHub sign-in error:', error);
      return {
        success: false,
        error: error.message || 'GitHub sign-in failed'
      };
    }
  }

  // Sign out from Firebase
  async signOut() {
    try {
      await this.auth.signOut();
      return { success: true };
    } catch (error) {
      console.error('Firebase sign-out error:', error);
      return {
        success: false,
        error: error.message || 'Sign-out failed'
      };
    }
  }

  // Format Firebase user data to match our app's user structure
  formatFirebaseUser(firebaseUser) {
    if (!firebaseUser) return null;

    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      email: firebaseUser.email,
      avatar: firebaseUser.photoURL,
      provider: firebaseUser.providerId,
      createdAt: new Date().toISOString(),
      preferences: {
        theme: 'dark',
        neonIntensity: 75,
        animationSpeed: 86,
        particleEffects: true,
        soundEffects: false
      }
    };
  }

  // Get current Firebase user
  getCurrentUser() {
    return this.auth.currentUser ? this.formatFirebaseUser(this.auth.currentUser) : null;
  }

  // Check if user is signed in with Firebase
  isSignedIn() {
    return !!this.auth.currentUser;
  }
}

export default new FirebaseAuthService();

