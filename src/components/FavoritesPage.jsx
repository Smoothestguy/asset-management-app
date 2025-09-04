import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Heart,
  Star,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Edit,
  Share,
  Filter,
  Search,
  Grid3X3,
  List,
  Award,
  Target,
  Zap,
  Activity,
  Calendar,
  BarChart3,
} from "lucide-react";
import { usePersonalAssets } from "../hooks/usePersonalAssets";
import { ASSET_CATEGORIES, getSubcategoryLabel } from "../lib/assetCategories";

const FavoritesPage = () => {
  const { assets, toggleFavorite } = usePersonalAssets();
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("value"); // 'value', 'performance', 'date'

  // Get favorite assets
  const favoriteAssets = assets.filter((asset) => asset.isFavorite);

  // Sort favorites
  const sortedFavorites = [...favoriteAssets].sort((a, b) => {
    switch (sortBy) {
      case "value":
        return b.currentValue - a.currentValue;
      case "performance":
        const aGain =
          ((a.currentValue - a.purchasePrice) / a.purchasePrice) * 100;
        const bGain =
          ((b.currentValue - b.purchasePrice) / b.purchasePrice) * 100;
        return bGain - aGain;
      case "date":
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  // Calculate favorites statistics
  const favoritesStats = {
    totalValue: favoriteAssets.reduce(
      (sum, asset) => sum + asset.currentValue,
      0
    ),
    totalCost: favoriteAssets.reduce(
      (sum, asset) => sum + asset.purchasePrice,
      0
    ),
    count: favoriteAssets.length,
    topPerformer: favoriteAssets.reduce((best, asset) => {
      const gain =
        ((asset.currentValue - asset.purchasePrice) / asset.purchasePrice) *
        100;
      const bestGain = best
        ? ((best.currentValue - best.purchasePrice) / best.purchasePrice) * 100
        : -Infinity;
      return gain > bestGain ? asset : best;
    }, null),
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const FavoriteCard = ({ asset, index }) => {
    const category = ASSET_CATEGORIES[asset.category];
    const gainLoss = asset.currentValue - asset.purchasePrice;
    const gainLossPercent =
      asset.purchasePrice > 0 ? (gainLoss / asset.purchasePrice) * 100 : 0;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 0 30px rgba(255, 107, 53, 0.4)",
          y: -6,
        }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer group mobile-touch-feedback"
      >
        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-2 border-orange-500/30 hover:border-orange-400/60 transition-all duration-300 backdrop-blur-sm overflow-hidden relative mobile-card-enhanced">
          {/* Favorite Star with enhanced mobile interaction */}
          <div className="absolute top-4 right-4 z-20">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(asset.id);
              }}
              whileHover={{ scale: 1.2, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-orange-500/20 rounded-full border border-orange-500/50 backdrop-blur-sm min-h-[44px] min-w-[44px] mobile-touch-target"
            >
              <Heart className="w-4 h-4 text-orange-400 fill-orange-400" />
            </motion.button>
          </div>

          {/* Background Effects */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-red-500/20" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
          </div>

          {/* Enhanced mobile card content */}
          <CardContent className="p-4 lg:p-6 relative z-10">
            {/* Header with mobile optimizations */}
            <div className="flex items-start space-x-3 lg:space-x-4 mb-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Avatar
                  className="w-10 h-10 lg:w-12 lg:h-12 border-2 border-orange-500/50"
                  style={{ backgroundColor: category?.bgColor }}
                >
                  <AvatarFallback
                    className="text-base lg:text-lg font-bold"
                    style={{ color: category?.color }}
                  >
                    {category?.icon}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-base lg:text-lg truncate group-hover:text-orange-300 transition-colors">
                  {asset.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {getSubcategoryLabel(asset.subcategory)} • {category?.name}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Added {formatDate(asset.createdAt)}
                </p>
              </div>
            </div>

            {/* Performance Indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Performance</span>
                <Badge
                  className={`${
                    gainLoss >= 0
                      ? "bg-green-500/20 text-green-400 border-green-500/50"
                      : "bg-red-500/20 text-red-400 border-red-500/50"
                  }`}
                >
                  {gainLoss >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {gainLoss >= 0 ? "+" : ""}
                  {gainLossPercent.toFixed(1)}%
                </Badge>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    gainLoss >= 0
                      ? "bg-gradient-to-r from-green-500 to-green-400"
                      : "bg-gradient-to-r from-red-500 to-red-400"
                  }`}
                  style={{
                    width: `${Math.min(Math.abs(gainLossPercent), 100)}%`,
                    boxShadow: `0 0 10px ${
                      gainLoss >= 0 ? "#10b981" : "#ef4444"
                    }60`,
                  }}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(Math.abs(gainLossPercent), 100)}%`,
                  }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                />
              </div>
            </div>

            {/* Value Information */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Current Value</span>
                <span className="text-white font-bold text-lg">
                  {formatCurrency(asset.currentValue)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Purchase Price</span>
                <span className="text-gray-300 text-sm">
                  {formatCurrency(asset.purchasePrice)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
                <span className="text-gray-400 text-sm">Gain/Loss</span>
                <span
                  className={`font-bold ${
                    gainLoss >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {gainLoss >= 0 ? "+" : ""}
                  {formatCurrency(gainLoss)}
                </span>
              </div>
            </div>

            {/* Tags */}
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

            {/* Action Buttons */}
            <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-700/50">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
              >
                <Share className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="mb-6">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center border-2 border-orange-500/30">
          <Heart className="w-12 h-12 text-orange-400" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No Favorites Yet</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        Start adding assets to your favorites to quickly access your most
        important investments and track their performance.
      </p>
      <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
        <Heart className="w-4 h-4 mr-2" />
        Browse Assets
      </Button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
      {/* Mobile Background Enhancement */}
      <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl animate-pulse" />
        <div
          className="absolute top-20 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-28 h-28 bg-pink-500/5 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Use mobile-optimized padding */}
      <div className="p-4 lg:p-6 relative z-10">
        {/* Header with mobile optimizations */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-8"
        >
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <motion.div
                className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-[0_0_20px_rgba(255,107,53,0.5)]"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <motion.h1
                  className="text-2xl lg:text-3xl font-bold text-white neon-text"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  FAVORITES
                </motion.h1>
                <motion.p
                  className="text-gray-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Quick access to your most valuable assets
                </motion.p>
              </div>
            </div>

            {/* Mobile-optimized controls */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="flex bg-gray-800/50 rounded-lg p-1 backdrop-blur-sm">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 min-h-[44px] ${
                    viewMode === "grid"
                      ? "bg-orange-500 text-white shadow-[0_0_10px_rgba(255,107,53,0.4)]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Grid
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 min-h-[44px] ${
                    viewMode === "list"
                      ? "bg-orange-500 text-white shadow-[0_0_10px_rgba(255,107,53,0.4)]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </motion.button>
              </div>

              {/* Sort dropdown with mobile optimization */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm backdrop-blur-sm min-h-[44px] focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 mobile-optimized"
              >
                <option value="value">Sort by Value</option>
                <option value="performance">Sort by Performance</option>
                <option value="date">Sort by Date Added</option>
              </select>
            </div>
          </div>
        </motion.div>

        {favoriteAssets.length > 0 && (
          <>
            {/* Statistics Cards with mobile enhancements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 lg:mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30 backdrop-blur-sm hover:border-orange-400/50 transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(255,107,53,0.1)] hover:shadow-[0_8px_30px_rgba(255,107,53,0.2)] mobile-card-enhanced">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-400 text-sm font-medium">
                          Total Favorites
                        </p>
                        <p className="text-xl lg:text-2xl font-bold text-white">
                          {favoritesStats.count}
                        </p>
                      </div>
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Heart className="w-6 h-6 lg:w-8 lg:h-8 text-orange-400" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(0,255,255,0.1)] hover:shadow-[0_8px_30px_rgba(0,255,255,0.2)] mobile-card-enhanced">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-cyan-400 text-sm font-medium">
                          Total Value
                        </p>
                        <p className="text-xl lg:text-2xl font-bold text-white">
                          {formatCurrency(favoritesStats.totalValue)}
                        </p>
                      </div>
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <DollarSign className="w-6 h-6 lg:w-8 lg:h-8 text-cyan-400" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-400 text-sm font-medium">
                        Total Gain/Loss
                      </p>
                      <p
                        className={`text-2xl font-bold ${
                          favoritesStats.totalValue -
                            favoritesStats.totalCost >=
                          0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {favoritesStats.totalValue - favoritesStats.totalCost >=
                        0
                          ? "+"
                          : ""}
                        {formatCurrency(
                          favoritesStats.totalValue - favoritesStats.totalCost
                        )}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-400 text-sm font-medium">
                        Top Performer
                      </p>
                      <p className="text-lg font-bold text-white truncate">
                        {favoritesStats.topPerformer?.name || "N/A"}
                      </p>
                    </div>
                    <Award className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedFavorites.map((asset, index) => (
                <FavoriteCard key={asset.id} asset={asset} index={index} />
              ))}
            </div>
          </>
        )}

        {favoriteAssets.length === 0 && <EmptyState />}
      </div>
    </div>
  );
};

export default FavoritesPage;
