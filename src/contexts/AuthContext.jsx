import { createContext, useContext, useState, useEffect } from 'react'
import unifiedAuthService from '../services/unifiedAuthService'
import firebaseAuthService from '../services/firebaseAuthService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authMethod, setAuthMethod] = useState(null) // 'local', 'backend', 'firebase'

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true)
        
        // Initialize unified auth service
        const currentUser = await unifiedAuthService.initialize()
        
        if (currentUser) {
          setUser(currentUser)
          setIsAuthenticated(true)
          setAuthMethod(unifiedAuthService.getAuthMethod())
        }

        // Set up Firebase Auth listener for real-time updates
        const unsubscribe = firebaseAuthService.initAuthListener((firebaseUser) => {
          if (firebaseUser && unifiedAuthService.getAuthMethod() === 'firebase') {
            setUser(firebaseUser)
            setIsAuthenticated(true)
            setAuthMethod('firebase')
          } else if (!firebaseUser && unifiedAuthService.getAuthMethod() === 'firebase') {
            // Firebase user signed out
            setUser(null)
            setIsAuthenticated(false)
            setAuthMethod(null)
            unifiedAuthService.clearSession()
          }
        })

        setLoading(false)
        return unsubscribe
      } catch (error) {
        console.error('Error initializing auth:', error)
        setLoading(false)
      }
    }

    const cleanup = initAuth()
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup()
      }
    }
  }, [])

  const login = async (email, password, useBackend = false) => {
    try {
      setLoading(true)
      
      let result
      if (useBackend) {
        result = await unifiedAuthService.loginWithBackend(email, password)
      } else {
        result = await unifiedAuthService.authenticateLocally(email, password, false)
      }
      
      if (result.success) {
        setUser(result.user)
        setIsAuthenticated(true)
        setAuthMethod(unifiedAuthService.getAuthMethod())
      }
      
      return result
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email, password, name, useBackend = false) => {
    try {
      setLoading(true)
      
      let result
      if (useBackend) {
        result = await unifiedAuthService.registerWithBackend({
          name,
          email,
          password
        })
      } else {
        result = await unifiedAuthService.authenticateLocally(email, password, true, name)
      }
      
      if (result.success) {
        setUser(result.user)
        setIsAuthenticated(true)
        setAuthMethod(unifiedAuthService.getAuthMethod())
      }
      
      return result
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      const result = await unifiedAuthService.signInWithFirebase('google')
      
      if (result.success) {
        setUser(result.user)
        setIsAuthenticated(true)
        setAuthMethod('firebase')
      }
      
      return result
    } catch (error) {
      console.error('Google sign-in error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGitHub = async () => {
    try {
      setLoading(true)
      const result = await unifiedAuthService.signInWithFirebase('github')
      
      if (result.success) {
        setUser(result.user)
        setIsAuthenticated(true)
        setAuthMethod('firebase')
      }
      
      return result
    } catch (error) {
      console.error('GitHub sign-in error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await unifiedAuthService.signOut()
      setUser(null)
      setIsAuthenticated(false)
      setAuthMethod(null)
    } catch (error) {
      console.error('Logout error:', error)
      // Clear state anyway
      setUser(null)
      setIsAuthenticated(false)
      setAuthMethod(null)
    }
  }

  const updateUser = async (updates) => {
    try {
      const result = await unifiedAuthService.updateUserProfile(updates)
      
      if (result.success) {
        setUser(result.user)
        return result
      }
      
      return result
    } catch (error) {
      console.error('Update user error:', error)
      return { success: false, error: error.message }
    }
  }

  // Switch authentication method
  const switchAuthMethod = async (method) => {
    if (method === authMethod) return { success: true }

    try {
      setLoading(true)
      
      if (method === 'backend' && user) {
        // Try to register/login with backend using current user data
        const result = await unifiedAuthService.registerWithBackend({
          name: user.name,
          email: user.email,
          password: 'temp_password' // In real app, would need proper password handling
        })
        
        if (result.success) {
          setUser(result.user)
          setAuthMethod('backend')
          return { success: true }
        }
      }
      
      return { success: false, error: 'Method switch not supported' }
    } catch (error) {
      console.error('Error switching auth method:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Profile management methods
  const updateProfile = async (profileData) => {
    try {
      setLoading(true)
      const result = await unifiedAuthService.updateProfile(profileData)
      
      if (result.success) {
        setUser(result.user)
        return { success: true }
      } else {
        throw new Error(result.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true)
      const result = await unifiedAuthService.changePassword(currentPassword, newPassword)
      
      if (result.success) {
        return { success: true }
      } else {
        throw new Error(result.error || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteAccount = async () => {
    try {
      setLoading(true)
      const result = await unifiedAuthService.deleteAccount()
      
      if (result.success) {
        setUser(null)
        setIsAuthenticated(false)
        setAuthMethod(null)
        return { success: true }
      } else {
        throw new Error(result.error || 'Failed to delete account')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    authMethod,
    login,
    signup,
    signInWithGoogle,
    signInWithGitHub,
    logout,
    updateUser,
    updateProfile,
    changePassword,
    deleteAccount,
    switchAuthMethod,
    // Utility functions
    getAuthToken: () => unifiedAuthService.getAuthToken(),
    isBackendAuth: () => authMethod === 'backend',
    isFirebaseAuth: () => authMethod === 'firebase',
    isLocalAuth: () => authMethod === 'local'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

