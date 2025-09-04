import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

const themes = {
  'dark': {
    name: 'Dark Mode',
    primary: '#00d4ff',
    secondary: '#8b5cf6', 
    accent: '#ff6b35',
    success: '#00ff88',
    background: 'from-gray-900 via-black to-gray-900',
    cardBg: 'from-gray-900/80 to-gray-800/80',
    sidebarBg: 'from-gray-900/95 to-black/95',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-400',
    border: 'border-gray-700/50',
    glowColor: 'rgba(0, 212, 255, 0.4)'
  },
  'cyberpunk': {
    name: 'Cyberpunk 2077',
    primary: '#ff0080',
    secondary: '#00ffff',
    accent: '#ffff00',
    success: '#00ff00',
    background: 'from-purple-900 via-black to-pink-900',
    cardBg: 'from-purple-900/80 to-pink-800/80',
    sidebarBg: 'from-purple-900/95 to-black/95',
    textPrimary: 'text-white',
    textSecondary: 'text-purple-300',
    border: 'border-purple-700/50',
    glowColor: 'rgba(255, 0, 128, 0.4)'
  },
  'matrix': {
    name: 'Matrix Green',
    primary: '#00ff41',
    secondary: '#008f11',
    accent: '#00ff88',
    success: '#39ff14',
    background: 'from-green-900 via-black to-green-900',
    cardBg: 'from-green-900/80 to-gray-800/80',
    sidebarBg: 'from-green-900/95 to-black/95',
    textPrimary: 'text-green-100',
    textSecondary: 'text-green-400',
    border: 'border-green-700/50',
    glowColor: 'rgba(0, 255, 65, 0.4)'
  },
  'red': {
    name: 'Red Mode',
    primary: '#ff3333',
    secondary: '#ff6600',
    accent: '#ffff00',
    success: '#00ff00',
    background: 'from-red-900 via-black to-orange-900',
    cardBg: 'from-red-900/80 to-orange-800/80',
    sidebarBg: 'from-red-900/95 to-black/95',
    textPrimary: 'text-white',
    textSecondary: 'text-red-300',
    border: 'border-red-700/50',
    glowColor: 'rgba(255, 51, 51, 0.4)'
  }
}

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('dark')
  const [neonIntensity, setNeonIntensity] = useState(75)
  const [animationSpeed, setAnimationSpeed] = useState(86)
  const [particleEffects, setParticleEffects] = useState(true)
  const [soundEffects, setSoundEffects] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme')
    const savedNeonIntensity = localStorage.getItem('neon-intensity')
    const savedAnimationSpeed = localStorage.getItem('animation-speed')
    const savedParticleEffects = localStorage.getItem('particle-effects')
    const savedSoundEffects = localStorage.getItem('sound-effects')

    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
    if (savedNeonIntensity) {
      setNeonIntensity(parseInt(savedNeonIntensity))
    }
    if (savedAnimationSpeed) {
      setAnimationSpeed(parseInt(savedAnimationSpeed))
    }
    if (savedParticleEffects !== null) {
      setParticleEffects(savedParticleEffects === 'true')
    }
    if (savedSoundEffects !== null) {
      setSoundEffects(savedSoundEffects === 'true')
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    const theme = themes[currentTheme]
    const root = document.documentElement
    
    // Set CSS custom properties
    root.style.setProperty('--theme-primary', theme.primary)
    root.style.setProperty('--theme-secondary', theme.secondary)
    root.style.setProperty('--theme-accent', theme.accent)
    root.style.setProperty('--theme-success', theme.success)
    root.style.setProperty('--theme-glow', theme.glowColor)
    root.style.setProperty('--neon-intensity', neonIntensity / 100)
    root.style.setProperty('--animation-speed', animationSpeed / 100)
    
    // Save to localStorage
    localStorage.setItem('app-theme', currentTheme)
  }, [currentTheme, neonIntensity, animationSpeed])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('neon-intensity', neonIntensity.toString())
    localStorage.setItem('animation-speed', animationSpeed.toString())
    localStorage.setItem('particle-effects', particleEffects.toString())
    localStorage.setItem('sound-effects', soundEffects.toString())
  }, [neonIntensity, animationSpeed, particleEffects, soundEffects])

  const changeTheme = (themeKey) => {
    if (themes[themeKey]) {
      setCurrentTheme(themeKey)
    }
  }

  const resetSettings = () => {
    setCurrentTheme('dark')
    setNeonIntensity(75)
    setAnimationSpeed(86)
    setParticleEffects(true)
    setSoundEffects(false)
  }

  const value = {
    currentTheme,
    theme: themes[currentTheme],
    themes,
    neonIntensity,
    animationSpeed,
    particleEffects,
    soundEffects,
    changeTheme,
    setNeonIntensity,
    setAnimationSpeed,
    setParticleEffects,
    setSoundEffects,
    resetSettings
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

