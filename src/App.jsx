import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Package,
  Grid3X3,
  Heart,
  Settings,
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Zap,
  Target,
  Award,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";
import { usePersonalAssets } from "./hooks/usePersonalAssets";
import { ASSET_CATEGORIES, getSubcategoryLabel } from "./lib/assetCategories";
import AssetDetailDialog from "./components/AssetDetailDialog";
import AddAssetDialog from "./components/AddAssetDialog";
import SettingsPage from "./components/SettingsPage";
import CategoriesPage from "./components/CategoriesPage";
import FavoritesPage from "./components/FavoritesPage";
import UserProfilePage from "./components/UserProfilePage";
import ParticleBackground from "./components/ParticleBackground";
import AuthWrapper from "./components/AuthWrapper";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import "./App.css";

function App() {
  const { particleEffects } = useTheme();
  const { isAuthenticated, loading, user, logout } = useAuth();
  const {
    assets,
    portfolioSummary,
    addAsset,
    updateAsset,
    deleteAsset,
    toggleFavorite,
  } = usePersonalAssets(user);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.4)] mx-auto mb-4">
            <Zap className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-white text-lg neon-cyan">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication forms if not authenticated
  if (!isAuthenticated) {
    return <AuthWrapper />;
  }

  // Filter assets based on search and category
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAssetClick = (asset) => {
    setSelectedAsset(asset);
    setIsDetailDialogOpen(true);
  };

  const handleAddAsset = (assetData) => {
    addAsset(assetData);
    setIsAddDialogOpen(false);
  };

  const navigation = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
      color: "cyan",
    },
    { id: "assets", name: "Assets", icon: Package, color: "blue" },
    { id: "categories", name: "Categories", icon: Grid3X3, color: "purple" },
    { id: "favorites", name: "Favorites", icon: Heart, color: "orange" },
    { id: "profile", name: "Profile", icon: User, color: "pink" },
    { id: "settings", name: "Settings", icon: Settings, color: "green" },
  ];

  const getNavColor = (color, isActive) => {
    const colors = {
      cyan: isActive
        ? "border-cyan-500 bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
        : "text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10",
      blue: isActive
        ? "border-blue-500 bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        : "text-gray-400 hover:text-blue-400 hover:bg-blue-500/10",
      purple: isActive
        ? "border-purple-500 bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        : "text-gray-400 hover:text-purple-400 hover:bg-purple-500/10",
      orange: isActive
        ? "border-orange-500 bg-orange-500/20 text-orange-400 shadow-[0_0_15px_rgba(255,107,53,0.3)]"
        : "text-gray-400 hover:text-orange-400 hover:bg-orange-500/10",
      pink: isActive
        ? "border-pink-500 bg-pink-500/20 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
        : "text-gray-400 hover:text-pink-400 hover:bg-pink-500/10",
      green: isActive
        ? "border-green-500 bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        : "text-gray-400 hover:text-green-400 hover:bg-green-500/10",
    };
    return colors[color] || colors.cyan;
  };

  const Sidebar = () => (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-r border-gray-700/50 z-50 flex flex-col"
    >
      {/* Logo - Fixed at top */}
      <div className="p-6 border-b border-gray-700/50 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.4)]">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white neon-cyan">
              ASSET TRACKER
            </h1>
            <p className="text-xs text-gray-400">Professional Edition</p>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-2">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 border min-h-[44px] ${getNavColor(
                  item.color,
                  isActive
                )}`}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </motion.button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Fixed User Profile at bottom */}
      <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10 border-2 border-cyan-500/50">
                <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                  {user?.name?.charAt(0)?.toUpperCase() ||
                    user?.email?.charAt(0)?.toUpperCase() ||
                    "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-gray-400 text-xs truncate">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-400 hover:text-red-400 transition-colors p-2 min-h-[44px] min-w-[44px]"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Summary */}
      <div className="p-4">
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Total Portfolio</p>
              <p className="text-2xl font-bold text-white mb-2">
                {formatCurrency(portfolioSummary.totalValue)}
              </p>
              <div className="flex items-center justify-center space-x-2">
                {portfolioSummary.totalGainLoss >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span
                  className={`text-sm font-semibold ${
                    portfolioSummary.totalGainLoss >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {portfolioSummary.totalGainLoss >= 0 ? "+" : ""}
                  {formatCurrency(portfolioSummary.totalGainLoss)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  const MobileHeader = () => (
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 z-40 safe-area-top">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-400 hover:text-white min-h-[44px] min-w-[44px]"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
          <h1 className="text-lg font-bold text-white">ASSET TRACKER</h1>
        </div>

        {/* Search and Add buttons for mobile */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white min-h-[44px] min-w-[44px]"
          >
            <Search className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-[0_0_15px_rgba(0,255,255,0.4)] min-h-[44px]"
            size="sm"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8 border-2 border-cyan-500/50">
              <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs">
                {user?.name?.charAt(0)?.toUpperCase() ||
                  user?.email?.charAt(0)?.toUpperCase() ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-white text-sm font-medium hidden sm:block">
              {user?.name || user?.email?.split("@")[0]}
            </span>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-gray-400 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>

          {/* Add Asset Button */}
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-[0_0_15px_rgba(0,255,255,0.4)]"
            size="sm"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const DashboardContent = () => (
    <div className="space-y-6 lg:space-y-8">
      {/* Header - Mobile optimized */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 neon-text">
            DASHBOARD
          </h1>
          <p className="text-gray-400">Track your assets with precision</p>
        </div>

        {/* Desktop search and add button */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
            />
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-[0_0_15px_rgba(0,255,255,0.4)] modern-btn"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </motion.div>

      {/* Portfolio Summary Cards - Mobile optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
      >
        <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30 backdrop-blur-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-400 text-sm font-medium">Total Value</p>
                <p className="text-xl lg:text-2xl font-bold text-white">
                  {formatCurrency(portfolioSummary.totalValue)}
                </p>
              </div>
              <div className="p-2 lg:p-3 bg-cyan-500/20 rounded-lg">
                <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">
                  Total Gain/Loss
                </p>
                <p
                  className={`text-xl lg:text-2xl font-bold ${
                    portfolioSummary.totalGainLoss >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {portfolioSummary.totalGainLoss >= 0 ? "+" : ""}
                  {formatCurrency(portfolioSummary.totalGainLoss)}
                </p>
              </div>
              <div className="p-2 lg:p-3 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">
                  Total Assets
                </p>
                <p className="text-xl lg:text-2xl font-bold text-white">
                  {assets.length}
                </p>
              </div>
              <div className="p-2 lg:p-3 bg-purple-500/20 rounded-lg">
                <Package className="w-5 h-5 lg:w-6 lg:h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30 backdrop-blur-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-400 text-sm font-medium">Favorites</p>
                <p className="text-xl lg:text-2xl font-bold text-white">
                  {assets.filter((a) => a.isFavorite).length}
                </p>
              </div>
              <div className="p-2 lg:p-3 bg-orange-500/20 rounded-lg">
                <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Assets Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-lg lg:text-xl font-bold text-white">
            Your Assets
          </h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none min-h-[44px]"
          >
            <option value="all">All Categories</option>
            {Object.values(ASSET_CATEGORIES).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filteredAssets.map((asset, index) => {
            const category = ASSET_CATEGORIES[asset.category];
            const gainLoss = asset.currentValue - asset.purchasePrice;
            const gainLossPercent =
              asset.purchasePrice > 0
                ? (gainLoss / asset.purchasePrice) * 100
                : 0;

            return (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: `0 0 30px ${category?.color}40`,
                  y: -8,
                }}
                className="cursor-pointer modern-hover"
                onClick={() => handleAssetClick(asset)}
              >
                <Card
                  className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-2 hover:border-opacity-80 transition-all duration-300 backdrop-blur-sm overflow-hidden relative modern-border modern-card-enhanced"
                  style={{ borderColor: category?.color + "40" }}
                >
                  {/* Favorite Star */}
                  {asset.isFavorite && (
                    <div className="absolute top-4 right-4 z-10">
                      <Heart className="w-4 h-4 text-orange-400 fill-orange-400" />
                    </div>
                  )}

                  {/* Background Effects */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
                    <div
                      className="absolute top-0 right-0 w-32 h-32 transform rotate-45 translate-x-16 -translate-y-16"
                      style={{ backgroundColor: category?.color + "20" }}
                    />
                  </div>

                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-start space-x-4 mb-4">
                      <Avatar
                        className="w-12 h-12 border-2"
                        style={{
                          backgroundColor: category?.bgColor,
                          borderColor: category?.color + "50",
                        }}
                      >
                        <AvatarFallback
                          className="text-lg font-bold"
                          style={{ color: category?.color }}
                        >
                          {category?.icon}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-lg truncate">
                          {asset.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {getSubcategoryLabel(asset.subcategory)} •{" "}
                          {category?.name}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">
                          Current Value
                        </span>
                        <span className="text-white font-bold">
                          {formatCurrency(asset.currentValue)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Gain/Loss</span>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`font-bold ${
                              gainLoss >= 0 ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {gainLoss >= 0 ? "+" : ""}
                            {formatCurrency(gainLoss)}
                          </span>
                          <Badge
                            className={`${
                              gainLoss >= 0
                                ? "bg-green-500/20 text-green-400 border-green-500/50"
                                : "bg-red-500/20 text-red-400 border-red-500/50"
                            }`}
                          >
                            {gainLoss >= 0 ? "+" : ""}
                            {gainLossPercent.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {asset.tags && asset.tags.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-700/50">
                        <div className="flex flex-wrap gap-1">
                          {asset.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs border-gray-600 text-gray-400"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {asset.tags.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs border-gray-600 text-gray-400"
                            >
                              +{asset.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Particle Background */}
      {particleEffects && <ParticleBackground />}

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1)_0%,transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Header */}
      <MobileHeader />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-64 h-full bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:ml-64 pt-16 lg:pt-0 px-4 py-6 lg:p-6 relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardContent />
            </motion.div>
          )}

          {activeTab === "assets" && (
            <motion.div
              key="assets"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardContent />
            </motion.div>
          )}

          {activeTab === "categories" && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CategoriesPage />
            </motion.div>
          )}

          {activeTab === "favorites" && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FavoritesPage />
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <UserProfilePage />
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SettingsPage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dialogs */}
      <AssetDetailDialog
        asset={selectedAsset}
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        onUpdate={updateAsset}
        onDelete={deleteAsset}
        onToggleFavorite={toggleFavorite}
      />

      <AddAssetDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddAsset}
      />
    </div>
  );
}

// Wrapper component with ThemeProvider and AuthProvider
function AppWithTheme() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppWithTheme;
