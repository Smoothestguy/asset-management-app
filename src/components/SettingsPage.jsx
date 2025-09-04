import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Settings as SettingsIcon,
  Palette,
  Zap,
  Bell,
  Shield,
  User,
  Database,
  Monitor,
  Volume2,
  Sparkles,
  RotateCcw,
  Save
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const SettingsPage = () => {
  const {
    currentTheme,
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
  } = useTheme()

  const [activeTab, setActiveTab] = useState('appearance')
  const [currency, setCurrency] = useState('USD')
  const [notifications, setNotifications] = useState({
    desktop: true,
    email: false,
    push: true
  })

  const tabs = [
    { id: 'appearance', name: 'Appearance', icon: Palette, color: 'cyan' },
    { id: 'performance', name: 'Performance', icon: Zap, color: 'purple' },
    { id: 'notifications', name: 'Notifications', icon: Bell, color: 'orange' },
    { id: 'privacy', name: 'Privacy', icon: Shield, color: 'green' },
    { id: 'profile', name: 'Profile', icon: User, color: 'red' },
    { id: 'data', name: 'Data', icon: Database, color: 'blue' }
  ]

  const getTabColor = (color, isActive) => {
    const colors = {
      cyan: isActive ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10',
      purple: isActive ? 'border-purple-500 bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:text-purple-400 hover:bg-purple-500/10',
      orange: isActive ? 'border-orange-500 bg-orange-500/20 text-orange-400' : 'text-gray-400 hover:text-orange-400 hover:bg-orange-500/10',
      green: isActive ? 'border-green-500 bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10',
      red: isActive ? 'border-red-500 bg-red-500/20 text-red-400' : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10',
      blue: isActive ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10'
    }
    return colors[color] || colors.cyan
  }

  const handleSaveSettings = () => {
    // Settings are automatically saved via the theme context
    // Show a success message or animation here
    console.log('Settings saved!')
  }

  const handleResetSettings = () => {
    resetSettings()
    setCurrency('USD')
    setNotifications({ desktop: true, email: false, push: true })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 neon-text">SETTINGS</h1>
          <p className="text-gray-400">Configure your experience</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            <Monitor className="w-3 h-3 mr-1" />
            OPTIMAL
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
            <Zap className="w-3 h-3 mr-1" />
            ENABLED
          </Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          {tabs.map((tab, index) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 border ${getTabColor(tab.color, isActive)}`}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
                {tab.id === 'notifications' && notifications.desktop && (
                  <Badge className="ml-auto bg-orange-500/20 text-orange-400 text-xs">3</Badge>
                )}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <SettingsIcon className="w-5 h-5 text-cyan-400" />
                <span className="neon-cyan">
                  {tabs.find(t => t.id === activeTab)?.name} Settings
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">Theme</label>
                      <select
                        value={currentTheme}
                        onChange={(e) => changeTheme(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                      >
                        {Object.entries(themes).map(([key, theme]) => (
                          <option key={key} value={key}>{theme.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">Currency</label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                      >
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="GBP">British Pound (£)</option>
                        <option value="JPY">Japanese Yen (¥)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Neon Intensity: {neonIntensity}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={neonIntensity}
                        onChange={(e) => setNeonIntensity(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-neon"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Animation Speed: {animationSpeed}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="200"
                        value={animationSpeed}
                        onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-neon"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <div>
                        <h3 className="text-white font-medium">Particle Effects</h3>
                        <p className="text-gray-400 text-sm">Enable background particle animations</p>
                      </div>
                      <button
                        onClick={() => setParticleEffects(!particleEffects)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                          particleEffects 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                            : 'bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                            particleEffects ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <div>
                        <h3 className="text-white font-medium">Sound Effects</h3>
                        <p className="text-gray-400 text-sm">Enable UI sound feedback</p>
                      </div>
                      <button
                        onClick={() => setSoundEffects(!soundEffects)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                          soundEffects 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                            : 'bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                            soundEffects ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Settings */}
              {activeTab === 'performance' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <div>
                        <h3 className="text-white font-medium">High Performance Mode</h3>
                        <p className="text-gray-400 text-sm">Enable GPU acceleration and advanced effects</p>
                      </div>
                      <button className="relative w-12 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500">
                        <div className="absolute top-1 translate-x-7 w-4 h-4 bg-white rounded-full" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <div>
                        <h3 className="text-white font-medium">Reduced Motion</h3>
                        <p className="text-gray-400 text-sm">Minimize animations for better performance</p>
                      </div>
                      <button className="relative w-12 h-6 rounded-full bg-gray-600">
                        <div className="absolute top-1 translate-x-1 w-4 h-4 bg-white rounded-full" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-6">
                    <h3 className="text-white font-medium mb-4">System Information</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">GPU Acceleration:</span>
                        <span className="text-green-400 ml-2 font-medium">Enabled</span>
                      </div>
                      <div>
                        <span className="text-gray-400">WebGL Support:</span>
                        <span className="text-green-400 ml-2 font-medium">Available</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Memory Usage:</span>
                        <span className="text-cyan-400 ml-2 font-medium">45.2 MB</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Frame Rate:</span>
                        <span className="text-cyan-400 ml-2 font-medium">60 FPS</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other tabs content */}
              {activeTab !== 'appearance' && activeTab !== 'performance' && (
                <div className="text-center py-12">
                  <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Coming Soon</h3>
                  <p className="text-gray-500">This section is under development</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700/50">
                <Button
                  onClick={handleResetSettings}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={handleSaveSettings}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white modern-btn"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default SettingsPage

