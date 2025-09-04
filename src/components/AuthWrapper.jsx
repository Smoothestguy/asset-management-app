import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

const AuthWrapper = () => {
  const [isLogin, setIsLogin] = useState(true)

  const switchToSignup = () => setIsLogin(false)
  const switchToLogin = () => setIsLogin(true)

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <LoginForm onSwitchToSignup={switchToSignup} />
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SignupForm onSwitchToLogin={switchToLogin} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AuthWrapper

