import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Plus,
  Save,
  X,
  Camera,
  Tag,
  DollarSign,
  Calendar,
  FileText,
  Home,
  Car,
  Watch,
  Laptop,
  Package
} from 'lucide-react'
import { ASSET_CATEGORIES, SUBCATEGORY_LABELS, CONDITION_OPTIONS } from '../lib/assetCategories'

const AddAssetDialog = ({ isOpen, onClose, onAdd }) => {
  const [step, setStep] = useState(1)
  const [newAsset, setNewAsset] = useState({
    name: '',
    category: '',
    subcategory: '',
    purchasePrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    currentValue: '',
    condition: 'excellent',
    details: {},
    tags: [],
    photos: []
  })
  const [newTag, setNewTag] = useState('')

  const resetForm = () => {
    setStep(1)
    setNewAsset({
      name: '',
      category: '',
      subcategory: '',
      purchasePrice: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      currentValue: '',
      condition: 'excellent',
      details: {},
      tags: [],
      photos: []
    })
    setNewTag('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleCategorySelect = (categoryId) => {
    const category = ASSET_CATEGORIES[categoryId]
    setNewAsset({
      ...newAsset,
      category: categoryId,
      subcategory: category.subcategories[0],
      currentValue: newAsset.currentValue || category.defaultValue.toString(),
      purchasePrice: newAsset.purchasePrice || category.defaultValue.toString()
    })
    setStep(2)
  }

  const handleAddTag = () => {
    if (newTag.trim() && !newAsset.tags.includes(newTag.trim())) {
      setNewAsset({
        ...newAsset,
        tags: [...newAsset.tags, newTag.trim()]
      })
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setNewAsset({
      ...newAsset,
      tags: newAsset.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleDetailChange = (field, value) => {
    setNewAsset({
      ...newAsset,
      details: {
        ...newAsset.details,
        [field]: value
      }
    })
  }

  const handleSubmit = () => {
    const assetToAdd = {
      ...newAsset,
      purchasePrice: parseFloat(newAsset.purchasePrice) || 0,
      currentValue: parseFloat(newAsset.currentValue) || parseFloat(newAsset.purchasePrice) || 0,
      lastValueUpdate: new Date().toISOString()
    }
    
    onAdd(assetToAdd)
    handleClose()
  }

  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case 'real_estate': return <Home className="w-6 h-6" />
      case 'vehicle': return <Car className="w-6 h-6" />
      case 'luxury': return <Watch className="w-6 h-6" />
      case 'electronics': return <Laptop className="w-6 h-6" />
      case 'home': return <Package className="w-6 h-6" />
      default: return <FileText className="w-6 h-6" />
    }
  }

  const selectedCategory = ASSET_CATEGORIES[newAsset.category]
  const isFormValid = newAsset.name && newAsset.category && newAsset.purchasePrice

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add New Asset
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose Asset Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(ASSET_CATEGORIES).map((category) => (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300"
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <Avatar 
                            className="w-12 h-12"
                            style={{ backgroundColor: category.bgColor }}
                          >
                            <AvatarFallback 
                              className="text-xl"
                              style={{ color: category.color }}
                            >
                              {category.icon}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold">{category.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {category.subcategories.length} types available
                            </p>
                          </div>
                          {getCategoryIcon(category.id)}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && selectedCategory && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar 
                  className="w-10 h-10"
                  style={{ backgroundColor: selectedCategory.bgColor }}
                >
                  <AvatarFallback 
                    className="text-lg"
                    style={{ color: selectedCategory.color }}
                  >
                    {selectedCategory.icon}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedCategory.name}</h3>
                  <p className="text-sm text-muted-foreground">Asset Details</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                Back
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Asset Name *</label>
                    <Input
                      placeholder="e.g., 2022 Tesla Model 3"
                      value={newAsset.name}
                      onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <select
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      value={newAsset.subcategory}
                      onChange={(e) => setNewAsset({...newAsset, subcategory: e.target.value})}
                    >
                      {selectedCategory.subcategories.map(sub => (
                        <option key={sub} value={sub}>
                          {SUBCATEGORY_LABELS[sub]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Condition</label>
                    <select
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      value={newAsset.condition}
                      onChange={(e) => setNewAsset({...newAsset, condition: e.target.value})}
                    >
                      {CONDITION_OPTIONS.map(condition => (
                        <option key={condition.value} value={condition.value}>
                          {condition.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Financial Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Purchase Price *</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newAsset.purchasePrice}
                      onChange={(e) => setNewAsset({...newAsset, purchasePrice: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Current Value</label>
                    <Input
                      type="number"
                      placeholder="Same as purchase price"
                      value={newAsset.currentValue}
                      onChange={(e) => setNewAsset({...newAsset, currentValue: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Purchase Date</label>
                    <Input
                      type="date"
                      value={newAsset.purchaseDate}
                      onChange={(e) => setNewAsset({...newAsset, purchaseDate: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category-specific fields */}
            {selectedCategory.fields && selectedCategory.fields.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCategory.fields.map(field => (
                      <div key={field}>
                        <label className="text-sm font-medium">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <Input
                          placeholder={`Enter ${field}`}
                          value={newAsset.details[field] || ''}
                          onChange={(e) => handleDetailChange(field, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button onClick={handleAddTag} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {newAsset.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newAsset.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-red-500" 
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Photos Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center bg-muted rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <Camera className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Photo upload coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!isFormValid}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <Save className="w-4 h-4 mr-2" />
                Add Asset
              </Button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AddAssetDialog

