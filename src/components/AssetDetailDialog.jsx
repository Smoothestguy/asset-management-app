import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Heart,
  Edit,
  Share,
  Archive,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Camera,
  Plus,
  X,
  Save,
  FileText,
  History,
  MapPin,
  Car,
  Home,
  Smartphone,
  Watch,
  Laptop,
  Upload,
  Image as ImageIcon
} from 'lucide-react'
import { ASSET_CATEGORIES, getSubcategoryLabel, FIELD_LABELS } from '../lib/assetCategories'

const AssetDetailDialog = ({ 
  asset, 
  isOpen, 
  onClose, 
  onUpdate, 
  onToggleFavorite,
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedAsset, setEditedAsset] = useState(asset || {})
  const [photos, setPhotos] = useState(asset?.photos || [])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  if (!asset) return null

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryIcon = () => {
    const iconMap = {
      'real-estate': <Home className="w-5 h-5" />,
      'vehicles': <Car className="w-5 h-5" />,
      'luxury-items': <Watch className="w-5 h-5" />,
      'electronics': <Laptop className="w-5 h-5" />,
      'home-assets': <Home className="w-5 h-5" />
    }
    return iconMap[asset.category] || <FileText className="w-5 h-5" />
  }

  const getCategoryColor = () => {
    const colorMap = {
      'real-estate': 'text-cyan-400 border-cyan-500/50',
      'vehicles': 'text-blue-400 border-blue-500/50',
      'luxury-items': 'text-purple-400 border-purple-500/50',
      'electronics': 'text-orange-400 border-orange-500/50',
      'home-assets': 'text-green-400 border-green-500/50'
    }
    return colorMap[asset.category] || 'text-gray-400 border-gray-500/50'
  }

  const gainLoss = asset.currentValue - asset.purchasePrice
  const gainLossPercentage = ((gainLoss / asset.purchasePrice) * 100).toFixed(1)
  const isGain = gainLoss >= 0

  const handleEdit = () => {
    setIsEditing(true)
    setEditedAsset({ ...asset })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedAsset({ ...asset })
  }

  const handleSave = () => {
    onUpdate(editedAsset)
    setIsEditing(false)
  }

  const handlePhotoUpload = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    setIsUploading(true)

    try {
      const newPhotos = []
      
      for (const file of files) {
        // Create a preview URL for the uploaded file
        const previewUrl = URL.createObjectURL(file)
        
        // In a real app, you would upload to a server here
        // For demo purposes, we'll just use the preview URL
        const photo = {
          id: Date.now() + Math.random(),
          url: previewUrl,
          caption: file.name,
          uploadedAt: new Date().toISOString(),
          size: file.size,
          type: file.type
        }
        
        newPhotos.push(photo)
      }

      const updatedPhotos = [...photos, ...newPhotos]
      setPhotos(updatedPhotos)
      
      // Update the asset with new photos
      const updatedAsset = { ...asset, photos: updatedPhotos }
      onUpdate(updatedAsset)
      
    } catch (error) {
      console.error('Error uploading photos:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeletePhoto = (photoId) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId)
    setPhotos(updatedPhotos)
    
    // Update the asset
    const updatedAsset = { ...asset, photos: updatedPhotos }
    onUpdate(updatedAsset)
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-gray-700/50 backdrop-blur-xl">
        <DialogHeader className="border-b border-gray-700/50 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className={`w-12 h-12 border-2 ${getCategoryColor()}`}>
                <AvatarFallback className="bg-gray-800 text-white">
                  {getCategoryIcon()}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  {asset.name}
                </DialogTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={`${getCategoryColor()} bg-transparent`}>
                    {ASSET_CATEGORIES[asset.category]?.name}
                  </Badge>
                  <Badge variant="outline" className="text-gray-400 border-gray-600">
                    {getSubcategoryLabel(asset.category, asset.subcategory)}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(asset.id)}
                className={`${asset.isFavorite ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-red-400'}`}
              >
                <Heart className={`w-4 h-4 ${asset.isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleEdit} className="text-gray-400 hover:text-white">
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Overview
            </TabsTrigger>
            <TabsTrigger value="financial" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
              Financial
            </TabsTrigger>
            <TabsTrigger value="photos" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              Photos ({photos.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Current Value</span>
                    <span className="text-sm font-medium text-white">{formatCurrency(asset.currentValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Purchase Price</span>
                    <span className="text-sm font-medium">{formatCurrency(asset.purchasePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Gain/Loss</span>
                    <span className={`text-sm font-medium ${isGain ? 'text-green-400' : 'text-red-400'}`}>
                      {isGain ? '+' : ''}{formatCurrency(gainLoss)} ({isGain ? '+' : ''}{gainLossPercentage}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Purchase Date</span>
                    <span className="text-sm font-medium">{formatDate(asset.purchaseDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Condition</span>
                    <Badge variant="secondary" className="capitalize">
                      {asset.condition}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Information */}
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    {getCategoryIcon()}
                    <span className="ml-2">Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-300">
                  {asset.details && Object.entries(asset.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm text-gray-400">
                        {FIELD_LABELS[key] || key}
                      </span>
                      <span className="text-sm font-medium">{value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Tags */}
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {asset.tags?.map(tag => (
                    <Badge key={tag} variant="outline" className="text-gray-300 border-gray-600">
                      {tag}
                    </Badge>
                  ))}
                  {(!asset.tags || asset.tags.length === 0) && (
                    <span className="text-sm text-gray-400">No tags added</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Current Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{formatCurrency(asset.currentValue)}</div>
                  <p className="text-xs text-gray-400">
                    Last updated: {formatDate(asset.lastValueUpdate)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Calendar className="w-5 h-5 mr-2" />
                    Purchase Price
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{formatCurrency(asset.purchasePrice)}</div>
                  <p className="text-xs text-gray-400">
                    Purchased: {formatDate(asset.purchaseDate)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    {isGain ? <TrendingUp className="w-5 h-5 mr-2 text-green-400" /> : <TrendingDown className="w-5 h-5 mr-2 text-red-400" />}
                    Gain/Loss
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${isGain ? 'text-green-400' : 'text-red-400'}`}>
                    {isGain ? '+' : ''}{formatCurrency(gainLoss)}
                  </div>
                  <p className={`text-xs ${isGain ? 'text-green-400' : 'text-red-400'}`}>
                    {isGain ? '+' : ''}{gainLossPercentage}% from purchase
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-6 mt-6">
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Photo Gallery ({photos.length})
                  </div>
                  <Button
                    onClick={triggerFileUpload}
                    disabled={isUploading}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Photos
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                
                {photos.length === 0 ? (
                  <div className="h-64 flex items-center justify-center bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-600">
                    <div className="text-center">
                      <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-400 mb-2">No photos added yet</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={triggerFileUpload}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload First Photo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((photo) => (
                      <motion.div 
                        key={photo.id} 
                        className="relative group"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption || 'Asset photo'}
                          className="w-full h-32 object-cover rounded-lg border border-gray-600"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        {photo.caption && (
                          <p className="text-xs text-gray-400 mt-1 truncate">{photo.caption}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6 mt-6">
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <History className="w-5 h-5 mr-2" />
                  Activity History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Asset created</p>
                      <p className="text-xs text-gray-400">{formatDate(asset.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Value updated</p>
                      <p className="text-xs text-gray-400">{formatDate(asset.lastValueUpdate)}</p>
                    </div>
                  </div>

                  {photos.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Photos added ({photos.length})</p>
                        <p className="text-xs text-gray-400">Latest: {formatDate(photos[photos.length - 1]?.uploadedAt || asset.createdAt)}</p>
                      </div>
                    </div>
                  )}

                  {asset.updatedAt !== asset.createdAt && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Asset modified</p>
                        <p className="text-xs text-gray-400">{formatDate(asset.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default AssetDetailDialog

