// Firebase configuration
// Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "asset-tracker-demo.firebaseapp.com",
  projectId: "asset-tracker-demo",
  storageBucket: "asset-tracker-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Mock Firebase Auth implementation for demo purposes
// In a real implementation, you would use the actual Firebase SDK

class MockFirebaseAuth {
  constructor() {
    this.currentUser = null;
    this.authStateListeners = [];
  }

  // Mock Google Sign-In
  async signInWithPopup(provider) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          uid: 'firebase_' + Date.now(),
          email: 'user@gmail.com',
          displayName: 'Firebase User',
          photoURL: 'https://via.placeholder.com/150',
          providerId: 'google.com'
        };
        this.currentUser = mockUser;
        this.notifyAuthStateChange(mockUser);
        resolve({ user: mockUser });
      }, 1000);
    });
  }

  // Mock GitHub Sign-In
  async signInWithGitHub() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          uid: 'firebase_github_' + Date.now(),
          email: 'user@github.com',
          displayName: 'GitHub User',
          photoURL: 'https://via.placeholder.com/150',
          providerId: 'github.com'
        };
        this.currentUser = mockUser;
        this.notifyAuthStateChange(mockUser);
        resolve({ user: mockUser });
      }, 1000);
    });
  }

  // Mock sign out
  async signOut() {
    this.currentUser = null;
    this.notifyAuthStateChange(null);
  }

  // Mock auth state listener
  onAuthStateChanged(callback) {
    this.authStateListeners.push(callback);
    // Immediately call with current state
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  notifyAuthStateChange(user) {
    this.authStateListeners.forEach(callback => callback(user));
  }
}

// Mock providers
class MockGoogleAuthProvider {
  static credential() {
    return { providerId: 'google.com' };
  }
}

class MockGitHubAuthProvider {
  static credential() {
    return { providerId: 'github.com' };
  }
}

// Export mock Firebase services
export const auth = new MockFirebaseAuth();
export const GoogleAuthProvider = MockGoogleAuthProvider;
export const GitHubAuthProvider = MockGitHubAuthProvider;

// For real Firebase implementation, uncomment and use this:
/*
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut, onAuthStateChanged };
*/

export default firebaseConfig;

