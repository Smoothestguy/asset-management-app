// Asset categories configuration for personal asset tracker

export const ASSET_CATEGORIES = {
  real_estate: {
    id: 'real_estate',
    name: 'Real Estate',
    icon: '🏠',
    color: '#10B981', // Emerald
    bgColor: '#ECFDF5',
    subcategories: ['house', 'apartment', 'land', 'commercial', 'vacation_home'],
    fields: ['address', 'squareFootage', 'bedrooms', 'bathrooms', 'lotSize', 'yearBuilt'],
    depreciationRate: 0, // Real estate typically appreciates
    defaultValue: 200000
  },
  
  vehicle: {
    id: 'vehicle',
    name: 'Vehicles',
    icon: '🚗',
    color: '#3B82F6', // Blue
    bgColor: '#EFF6FF',
    subcategories: ['car', 'motorcycle', 'boat', 'rv', 'truck', 'aircraft'],
    fields: ['make', 'model', 'year', 'vin', 'mileage', 'condition', 'color'],
    depreciationRate: 15, // 15% per year average
    defaultValue: 25000
  },
  
  luxury: {
    id: 'luxury',
    name: 'Luxury Items',
    icon: '⌚',
    color: '#8B5CF6', // Purple
    bgColor: '#F3E8FF',
    subcategories: ['watch', 'jewelry', 'art', 'antique', 'designer', 'collectible'],
    fields: ['brand', 'model', 'serialNumber', 'authentication', 'condition', 'material'],
    depreciationRate: 5, // Luxury items may hold value
    defaultValue: 5000
  },
  
  electronics: {
    id: 'electronics',
    name: 'Electronics',
    icon: '💻',
    color: '#F59E0B', // Amber
    bgColor: '#FFFBEB',
    subcategories: ['computer', 'phone', 'camera', 'audio', 'gaming', 'tv'],
    fields: ['brand', 'model', 'serialNumber', 'warranty', 'condition', 'specifications'],
    depreciationRate: 25, // Electronics depreciate quickly
    defaultValue: 1000
  },
  
  home: {
    id: 'home',
    name: 'Home Assets',
    icon: '🏡',
    color: '#EF4444', // Red
    bgColor: '#FEF2F2',
    subcategories: ['furniture', 'appliance', 'tool', 'decor', 'improvement', 'garden'],
    fields: ['brand', 'model', 'room', 'condition', 'warranty', 'material'],
    depreciationRate: 10, // Moderate depreciation
    defaultValue: 500
  }
}

export const SUBCATEGORY_LABELS = {
  // Real Estate
  house: 'House',
  apartment: 'Apartment',
  land: 'Land',
  commercial: 'Commercial Property',
  vacation_home: 'Vacation Home',
  
  // Vehicles
  car: 'Car',
  motorcycle: 'Motorcycle',
  boat: 'Boat',
  rv: 'RV/Motorhome',
  truck: 'Truck',
  aircraft: 'Aircraft',
  
  // Luxury Items
  watch: 'Watch',
  jewelry: 'Jewelry',
  art: 'Art',
  antique: 'Antique',
  designer: 'Designer Item',
  collectible: 'Collectible',
  
  // Electronics
  computer: 'Computer',
  phone: 'Phone',
  camera: 'Camera',
  audio: 'Audio Equipment',
  gaming: 'Gaming System',
  tv: 'Television',
  
  // Home Assets
  furniture: 'Furniture',
  appliance: 'Appliance',
  tool: 'Tool',
  decor: 'Decor',
  improvement: 'Home Improvement',
  garden: 'Garden Equipment'
}

export const CONDITION_OPTIONS = [
  { value: 'excellent', label: 'Excellent', color: '#10B981' },
  { value: 'good', label: 'Good', color: '#3B82F6' },
  { value: 'fair', label: 'Fair', color: '#F59E0B' },
  { value: 'poor', label: 'Poor', color: '#EF4444' }
]

export const FIELD_LABELS = {
  address: 'Address',
  squareFootage: 'Square Footage',
  bedrooms: 'Bedrooms',
  bathrooms: 'Bathrooms',
  lotSize: 'Lot Size',
  yearBuilt: 'Year Built',
  make: 'Make',
  model: 'Model',
  year: 'Year',
  vin: 'VIN',
  mileage: 'Mileage',
  condition: 'Condition',
  color: 'Color',
  brand: 'Brand',
  serialNumber: 'Serial Number',
  authentication: 'Authentication',
  material: 'Material',
  warranty: 'Warranty',
  room: 'Room',
  specifications: 'Specifications'
}

// Helper functions
export const getCategoryById = (categoryId) => {
  return ASSET_CATEGORIES[categoryId] || null
}

export const getAllCategories = () => {
  return Object.values(ASSET_CATEGORIES)
}

export const getSubcategoryLabel = (subcategoryId) => {
  return SUBCATEGORY_LABELS[subcategoryId] || subcategoryId
}

export const calculateDepreciation = (purchasePrice, purchaseDate, depreciationRate) => {
  if (depreciationRate === 0) return purchasePrice // No depreciation (e.g., real estate)
  
  const now = new Date()
  const purchase = new Date(purchaseDate)
  const yearsOwned = (now - purchase) / (1000 * 60 * 60 * 24 * 365.25)
  
  const depreciatedValue = purchasePrice * Math.pow(1 - depreciationRate / 100, yearsOwned)
  return Math.max(depreciatedValue, purchasePrice * 0.1) // Minimum 10% of original value
}

