import firebaseAuthService from './firebaseAuthService'

class UnifiedAuthService {
  constructor() {
    this.apiBaseUrl = 'http://localhost:5000/api'
    this.currentUser = null
    this.authMethod = null // 'local', 'backend', 'firebase'
    this.authToken = null
  }

  // Initialize the unified auth service
  async initialize() {
    try {
      // Check for existing local session
      const storedUser = localStorage.getItem('auth_user')
      const storedToken = localStorage.getItem('auth_token')
      const storedMethod = localStorage.getItem('auth_method')

      if (storedUser && storedToken && storedMethod) {
        this.currentUser = JSON.parse(storedUser)
        this.authToken = storedToken
        this.authMethod = storedMethod

        // Validate the session based on method
        if (storedMethod === 'backend') {
          const isValid = await this.validateBackendSession(storedToken)
          if (!isValid) {
            this.clearSession()
            return null
          }
        }

        return this.currentUser
      }

      // Check Firebase Auth state
      const firebaseUser = firebaseAuthService.getCurrentUser()
      if (firebaseUser) {
        this.currentUser = firebaseUser
        this.authMethod = 'firebase'
        return firebaseUser
      }

      return null
    } catch (error) {
      console.error('Error initializing auth service:', error)
      this.clearSession()
      return null
    }
  }

  // Validate backend session
  async validateBackendSession(token) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Update user data from backend
        this.currentUser = { ...this.currentUser, ...data.user }
        localStorage.setItem('auth_user', JSON.stringify(this.currentUser))
        return true
      }

      return false
    } catch (error) {
      console.error('Error validating backend session:', error)
      return false
    }
  }

  // Register user with backend API
  async registerWithBackend(userData) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (response.ok) {
        this.currentUser = data.user
        this.authToken = data.token
        this.authMethod = 'backend'
        this.saveSession()
        return { success: true, user: data.user, token: data.token }
      } else {
        return { success: false, error: data.error || 'Registration failed' }
      }
    } catch (error) {
      console.error('Backend registration error:', error)
      return { success: false, error: 'Network error during registration' }
    }
  }

  // Login user with backend API
  async loginWithBackend(email, password) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        this.currentUser = data.user
        this.authToken = data.token
        this.authMethod = 'backend'
        this.saveSession()
        return { success: true, user: data.user, token: data.token }
      } else {
        return { success: false, error: data.error || 'Login failed' }
      }
    } catch (error) {
      console.error('Backend login error:', error)
      return { success: false, error: 'Network error during login' }
    }
  }

  // Sign in with Firebase and optionally sync with backend
  async signInWithFirebase(provider) {
    try {
      let result
      if (provider === 'google') {
        result = await firebaseAuthService.signInWithGoogle()
      } else if (provider === 'github') {
        result = await firebaseAuthService.signInWithGitHub()
      } else {
        return { success: false, error: 'Unsupported provider' }
      }

      if (result.success) {
        this.currentUser = result.user
        this.authMethod = 'firebase'
        this.authToken = null // Firebase handles its own tokens
        this.saveSession()

        // Optionally sync with backend (create user record if doesn't exist)
        await this.syncFirebaseUserWithBackend(result.user)

        return { success: true, user: result.user }
      } else {
        return result
      }
    } catch (error) {
      console.error('Firebase sign-in error:', error)
      return { success: false, error: error.message }
    }
  }

  // Sync Firebase user with backend
  async syncFirebaseUserWithBackend(firebaseUser) {
    try {
      // Try to create a backend user record for the Firebase user
      const response = await fetch(`${this.apiBaseUrl}/auth/firebase-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firebase_uid: firebaseUser.id,
          name: firebaseUser.name,
          email: firebaseUser.email,
          avatar: firebaseUser.avatar,
          provider: firebaseUser.provider
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Firebase user synced with backend:', data)
      }
    } catch (error) {
      console.error('Error syncing Firebase user with backend:', error)
      // Don't fail the authentication if sync fails
    }
  }

  // Local authentication (for demo/offline use)
  async authenticateLocally(email, password, isSignup = false, name = null) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (isSignup) {
        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]')
        if (existingUsers.find(u => u.email === email)) {
          return { success: false, error: 'User already exists with this email' }
        }

        // Create new user
        const userData = {
          id: Date.now(),
          email,
          name: name || email.split('@')[0],
          avatar: null,
          createdAt: new Date().toISOString(),
          preferences: {
            theme: 'dark',
            neonIntensity: 75,
            animationSpeed: 86,
            particleEffects: true,
            soundEffects: false
          }
        }

        // Store user in registered users list
        existingUsers.push({ email, password, userData })
        localStorage.setItem('registered_users', JSON.stringify(existingUsers))

        this.currentUser = userData
        this.authMethod = 'local'
        this.authToken = 'local_token_' + Date.now()
        this.saveSession()

        return { success: true, user: userData }
      } else {
        // Login existing user
        const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]')
        const user = existingUsers.find(u => u.email === email && u.password === password)

        if (user) {
          this.currentUser = user.userData
          this.authMethod = 'local'
          this.authToken = 'local_token_' + Date.now()
          this.saveSession()

          return { success: true, user: user.userData }
        } else {
          return { success: false, error: 'Invalid email or password' }
        }
      }
    } catch (error) {
      console.error('Local authentication error:', error)
      return { success: false, error: 'Authentication failed' }
    }
  }

  // Update user profile
  async updateUserProfile(updates) {
    try {
      if (this.authMethod === 'backend' && this.authToken) {
        const response = await fetch(`${this.apiBaseUrl}/auth/me`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
        })

        if (response.ok) {
          const data = await response.json()
          this.currentUser = { ...this.currentUser, ...data.user }
          this.saveSession()
          return { success: true, user: this.currentUser }
        } else {
          const data = await response.json()
          return { success: false, error: data.error || 'Update failed' }
        }
      } else {
        // Local or Firebase update
        this.currentUser = { ...this.currentUser, ...updates }
        this.saveSession()
        return { success: true, user: this.currentUser }
      }
    } catch (error) {
      console.error('Error updating user profile:', error)
      return { success: false, error: 'Update failed' }
    }
  }

  // Sign out from all services
  async signOut() {
    try {
      if (this.authMethod === 'firebase') {
        await firebaseAuthService.signOut()
      }

      this.clearSession()
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      this.clearSession() // Clear session anyway
      return { success: false, error: error.message }
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'No user logged in' }
      }

      if (this.authMethod === 'backend') {
        // Update via backend API
        const response = await fetch('http://localhost:5000/api/auth/me', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
          },
          body: JSON.stringify(profileData)
        })

        const data = await response.json()
        
        if (response.ok) {
          this.currentUser = { ...this.currentUser, ...data.user }
          this.saveSession()
          return { success: true, user: this.currentUser }
        } else {
          return { success: false, error: data.error || 'Failed to update profile' }
        }
      } else if (this.authMethod === 'firebase') {
        // Update Firebase profile
        const result = await firebaseAuthService.updateProfile(profileData)
        if (result.success) {
          this.currentUser = { ...this.currentUser, ...result.user }
          this.saveSession()
          return { success: true, user: this.currentUser }
        } else {
          return { success: false, error: result.error }
        }
      } else {
        // Update local profile
        const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]')
        const userIndex = existingUsers.findIndex(u => u.userData.email === this.currentUser.email)
        
        if (userIndex !== -1) {
          existingUsers[userIndex].userData = { ...existingUsers[userIndex].userData, ...profileData }
          localStorage.setItem('registered_users', JSON.stringify(existingUsers))
          
          this.currentUser = { ...this.currentUser, ...profileData }
          this.saveSession()
          return { success: true, user: this.currentUser }
        } else {
          return { success: false, error: 'User not found' }
        }
      }
    } catch (error) {
      console.error('Update profile error:', error)
      return { success: false, error: 'Failed to update profile' }
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'No user logged in' }
      }

      if (this.authMethod === 'backend') {
        // Change password via backend API
        const response = await fetch('http://localhost:5000/api/auth/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword
          })
        })

        const data = await response.json()
        
        if (response.ok) {
          return { success: true }
        } else {
          return { success: false, error: data.error || 'Failed to change password' }
        }
      } else if (this.authMethod === 'firebase') {
        // Firebase password change
        const result = await firebaseAuthService.changePassword(currentPassword, newPassword)
        return result
      } else {
        // Change local password
        const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]')
        const userIndex = existingUsers.findIndex(u => u.userData.email === this.currentUser.email)
        
        if (userIndex !== -1) {
          // Verify current password
          if (existingUsers[userIndex].password !== currentPassword) {
            return { success: false, error: 'Current password is incorrect' }
          }
          
          // Update password
          existingUsers[userIndex].password = newPassword
          localStorage.setItem('registered_users', JSON.stringify(existingUsers))
          
          return { success: true }
        } else {
          return { success: false, error: 'User not found' }
        }
      }
    } catch (error) {
      console.error('Change password error:', error)
      return { success: false, error: 'Failed to change password' }
    }
  }

  // Delete account
  async deleteAccount() {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'No user logged in' }
      }

      if (this.authMethod === 'backend') {
        // Delete via backend API
        const response = await fetch(`http://localhost:5000/api/users/${this.currentUser.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.authToken}`
          }
        })

        const data = await response.json()
        
        if (response.ok) {
          this.clearSession()
          return { success: true }
        } else {
          return { success: false, error: data.error || 'Failed to delete account' }
        }
      } else if (this.authMethod === 'firebase') {
        // Delete Firebase account
        const result = await firebaseAuthService.deleteAccount()
        if (result.success) {
          this.clearSession()
        }
        return result
      } else {
        // Delete local account
        const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]')
        const filteredUsers = existingUsers.filter(u => u.userData.email !== this.currentUser.email)
        localStorage.setItem('registered_users', JSON.stringify(filteredUsers))
        
        this.clearSession()
        return { success: true }
      }
    } catch (error) {
      console.error('Delete account error:', error)
      return { success: false, error: 'Failed to delete account' }
    }
  }

  // Save session to localStorage
  saveSession() {
    if (this.currentUser) {
      localStorage.setItem('auth_user', JSON.stringify(this.currentUser))
      localStorage.setItem('auth_method', this.authMethod)
      if (this.authToken) {
        localStorage.setItem('auth_token', this.authToken)
      }
    }
  }

  // Clear session
  clearSession() {
    this.currentUser = null
    this.authMethod = null
    this.authToken = null
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_method')
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser
  }

  // Get auth method
  getAuthMethod() {
    return this.authMethod
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser
  }

  // Get auth token (for backend API calls)
  getAuthToken() {
    return this.authToken
  }
}

export default new UnifiedAuthService()

