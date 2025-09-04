import { useState, useEffect, useCallback } from 'react'
import { ASSET_CATEGORIES, calculateDepreciation } from '../lib/assetCategories'

const BASE_STORAGE_KEY = 'personal_assets'

// Get user-specific storage key
const getUserStorageKey = (userId) => {
  if (!userId) return `${BASE_STORAGE_KEY}_guest`
  return `${BASE_STORAGE_KEY}_${userId}`
}

// Sample data for demonstration
const SAMPLE_ASSETS = [
  {
    id: '1',
    name: 'Family Home',
    category: 'real_estate',
    subcategory: 'house',
    photos: [],
    purchasePrice: 350000,
    purchaseDate: '2020-03-15',
    currentValue: 420000,
    lastValueUpdate: new Date().toISOString(),
    details: {
      address: '123 Maple Street, Springfield',
      squareFootage: 2400,
      bedrooms: 4,
      bathrooms: 3,
      yearBuilt: 2015
    },
    tags: ['primary', 'family'],
    isFavorite: true,
    condition: 'excellent',
    createdAt: '2020-03-15T10:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: '2022 Tesla Model 3',
    category: 'vehicle',
    subcategory: 'car',
    photos: [],
    purchasePrice: 55000,
    purchaseDate: '2022-06-10',
    currentValue: 42000,
    lastValueUpdate: new Date().toISOString(),
    details: {
      make: 'Tesla',
      model: 'Model 3',
      year: 2022,
      vin: '5YJ3E1EA1NF123456',
      mileage: 15000,
      color: 'Pearl White'
    },
    tags: ['daily', 'electric'],
    isFavorite: true,
    condition: 'excellent',
    createdAt: '2022-06-10T14:30:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Rolex Submariner',
    category: 'luxury',
    subcategory: 'watch',
    photos: [],
    purchasePrice: 12000,
    purchaseDate: '2021-12-25',
    currentValue: 14500,
    lastValueUpdate: new Date().toISOString(),
    details: {
      brand: 'Rolex',
      model: 'Submariner Date',
      serialNumber: 'M123456',
      authentication: true,
      material: 'Stainless Steel'
    },
    tags: ['luxury', 'investment'],
    isFavorite: true,
    condition: 'excellent',
    createdAt: '2021-12-25T09:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'MacBook Pro 16"',
    category: 'electronics',
    subcategory: 'computer',
    photos: [],
    purchasePrice: 3500,
    purchaseDate: '2023-01-20',
    currentValue: 2200,
    lastValueUpdate: new Date().toISOString(),
    details: {
      brand: 'Apple',
      model: 'MacBook Pro 16-inch',
      serialNumber: 'C02ABC123DEF',
      specifications: 'M2 Max, 32GB RAM, 1TB SSD',
      warranty: '2024-01-20'
    },
    tags: ['work', 'professional'],
    isFavorite: false,
    condition: 'excellent',
    createdAt: '2023-01-20T16:45:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Living Room Sofa',
    category: 'home',
    subcategory: 'furniture',
    photos: [],
    purchasePrice: 2500,
    purchaseDate: '2022-08-15',
    currentValue: 1800,
    lastValueUpdate: new Date().toISOString(),
    details: {
      brand: 'West Elm',
      model: 'Andes Sectional',
      room: 'Living Room',
      material: 'Velvet',
      color: 'Navy Blue'
    },
    tags: ['furniture', 'living room'],
    isFavorite: false,
    condition: 'good',
    createdAt: '2022-08-15T11:20:00Z',
    updatedAt: new Date().toISOString()
  }
]

export const usePersonalAssets = (user) => {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get user-specific storage key
  const storageKey = getUserStorageKey(user?.id || user?.uid || user?.email)

  // Load assets from localStorage on mount or when user changes
  useEffect(() => {
    try {
      setLoading(true)
      const stored = localStorage.getItem(storageKey)
      
      if (stored) {
        const parsedAssets = JSON.parse(stored)
        setAssets(parsedAssets)
      } else {
        // Check if there's legacy data to migrate
        const legacyData = localStorage.getItem(BASE_STORAGE_KEY)
        if (legacyData && user) {
          // Migrate legacy data to user-specific storage
          const legacyAssets = JSON.parse(legacyData)
          setAssets(legacyAssets)
          localStorage.setItem(storageKey, JSON.stringify(legacyAssets))
          // Remove legacy data
          localStorage.removeItem(BASE_STORAGE_KEY)
        } else {
          // Initialize with sample data for new users
          setAssets(SAMPLE_ASSETS)
          localStorage.setItem(storageKey, JSON.stringify(SAMPLE_ASSETS))
        }
      }
    } catch (err) {
      console.error('Error loading assets:', err)
      setError('Failed to load assets')
      setAssets(SAMPLE_ASSETS)
    } finally {
      setLoading(false)
    }
  }, [storageKey, user])

  // Save assets to localStorage whenever assets change
  useEffect(() => {
    if (assets.length > 0 && !loading) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(assets))
      } catch (err) {
        console.error('Error saving assets:', err)
        setError('Failed to save assets')
      }
    }
  }, [assets, storageKey, loading])

  // Add new asset
  const addAsset = useCallback((assetData) => {
    const newAsset = {
      id: Date.now().toString(),
      ...assetData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photos: assetData.photos || [],
      tags: assetData.tags || [],
      isFavorite: false
    }

    setAssets(prev => [newAsset, ...prev])
    return newAsset
  }, [])

  // Update existing asset
  const updateAsset = useCallback((assetId, updates) => {
    setAssets(prev => prev.map(asset => 
      asset.id === assetId 
        ? { ...asset, ...updates, updatedAt: new Date().toISOString() }
        : asset
    ))
  }, [])

  // Delete asset
  const deleteAsset = useCallback((assetId) => {
    setAssets(prev => prev.filter(asset => asset.id !== assetId))
  }, [])

  // Toggle favorite status
  const toggleFavorite = useCallback((assetId) => {
    setAssets(prev => prev.map(asset =>
      asset.id === assetId
        ? { ...asset, isFavorite: !asset.isFavorite, updatedAt: new Date().toISOString() }
        : asset
    ))
  }, [])

  // Update asset value
  const updateAssetValue = useCallback((assetId, newValue) => {
    setAssets(prev => prev.map(asset =>
      asset.id === assetId
        ? { 
            ...asset, 
            currentValue: newValue, 
            lastValueUpdate: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        : asset
    ))
  }, [])

  // Calculate portfolio summary
  const portfolioSummary = useCallback(() => {
    const totalValue = assets.reduce((sum, asset) => sum + (asset.currentValue || 0), 0)
    const totalPurchaseValue = assets.reduce((sum, asset) => sum + (asset.purchasePrice || 0), 0)
    const totalGainLoss = totalValue - totalPurchaseValue
    const totalGainLossPercent = totalPurchaseValue > 0 ? (totalGainLoss / totalPurchaseValue) * 100 : 0

    // Category breakdown
    const categoryBreakdown = {}
    assets.forEach(asset => {
      const category = ASSET_CATEGORIES[asset.category]
      if (category) {
        if (!categoryBreakdown[asset.category]) {
          categoryBreakdown[asset.category] = {
            name: category.name,
            icon: category.icon,
            color: category.color,
            value: 0,
            count: 0
          }
        }
        categoryBreakdown[asset.category].value += asset.currentValue || 0
        categoryBreakdown[asset.category].count += 1
      }
    })

    // Top category by value
    const topCategory = Object.values(categoryBreakdown).reduce((top, category) => 
      category.value > (top?.value || 0) ? category : top, null
    )

    // Most valuable asset
    const mostValuableAsset = assets.reduce((top, asset) => 
      (asset.currentValue || 0) > (top?.currentValue || 0) ? asset : top, null
    )

    return {
      totalValue,
      totalPurchaseValue,
      totalGainLoss,
      totalGainLossPercent,
      assetCount: assets.length,
      categoryBreakdown: Object.values(categoryBreakdown),
      topCategory,
      mostValuableAsset,
      formattedTotalValue: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(totalValue),
      formattedGainLoss: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        signDisplay: 'always'
      }).format(totalGainLoss)
    }
  }, [assets])

  // Filter and search assets
  const filterAssets = useCallback((filters = {}) => {
    let filtered = [...assets]

    if (filters.category) {
      filtered = filtered.filter(asset => asset.category === filters.category)
    }

    if (filters.subcategory) {
      filtered = filtered.filter(asset => asset.subcategory === filters.subcategory)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(searchLower) ||
        asset.details?.make?.toLowerCase().includes(searchLower) ||
        asset.details?.model?.toLowerCase().includes(searchLower) ||
        asset.details?.brand?.toLowerCase().includes(searchLower)
      )
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(asset => 
        filters.tags.some(tag => asset.tags.includes(tag))
      )
    }

    if (filters.favorites) {
      filtered = filtered.filter(asset => asset.isFavorite)
    }

    if (filters.minValue !== undefined) {
      filtered = filtered.filter(asset => (asset.currentValue || 0) >= filters.minValue)
    }

    if (filters.maxValue !== undefined) {
      filtered = filtered.filter(asset => (asset.currentValue || 0) <= filters.maxValue)
    }

    // Sort options
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'value_desc':
            return (b.currentValue || 0) - (a.currentValue || 0)
          case 'value_asc':
            return (a.currentValue || 0) - (b.currentValue || 0)
          case 'name_asc':
            return a.name.localeCompare(b.name)
          case 'name_desc':
            return b.name.localeCompare(a.name)
          case 'date_desc':
            return new Date(b.createdAt) - new Date(a.createdAt)
          case 'date_asc':
            return new Date(a.createdAt) - new Date(b.createdAt)
          default:
            return 0
        }
      })
    }

    return filtered
  }, [assets])

  // Get recent assets (last 5 added/updated)
  const recentAssets = useCallback(() => {
    return [...assets]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5)
  }, [assets])

  return {
    assets,
    loading,
    error,
    addAsset,
    updateAsset,
    deleteAsset,
    toggleFavorite,
    updateAssetValue,
    portfolioSummary: portfolioSummary(),
    filterAssets,
    recentAssets: recentAssets(),
    setError
  }
}

