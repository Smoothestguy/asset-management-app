import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Grid3X3,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search,
  Home,
  Car,
  Watch,
  Laptop,
  Package,
  Zap,
  Target,
  Award,
  Activity,
} from "lucide-react";
import { usePersonalAssets } from "../hooks/usePersonalAssets";
import { ASSET_CATEGORIES } from "../lib/assetCategories";

const CategoriesPage = () => {
  const { assets, portfolioSummary } = usePersonalAssets();
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'stats'
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Calculate category statistics
  const categoryStats = Object.values(ASSET_CATEGORIES)
    .map((category) => {
      const categoryAssets = assets.filter(
        (asset) => asset.category === category.id
      );
      const totalValue = categoryAssets.reduce(
        (sum, asset) => sum + asset.currentValue,
        0
      );
      const totalCost = categoryAssets.reduce(
        (sum, asset) => sum + asset.purchasePrice,
        0
      );
      const gainLoss = totalValue - totalCost;
      const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;

      return {
        ...category,
        assetCount: categoryAssets.length,
        totalValue,
        totalCost,
        gainLoss,
        gainLossPercent,
        assets: categoryAssets,
        performance: gainLossPercent > 0 ? "gain" : "loss",
      };
    })
    .sort((a, b) => b.totalValue - a.totalValue);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case "real_estate":
        return <Home className="w-6 h-6" />;
      case "vehicle":
        return <Car className="w-6 h-6" />;
      case "luxury":
        return <Watch className="w-6 h-6" />;
      case "electronics":
        return <Laptop className="w-6 h-6" />;
      case "home":
        return <Package className="w-6 h-6" />;
      default:
        return <Package className="w-6 h-6" />;
    }
  };

  const CategoryCard = ({ category, index }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 30px ${category.color}40`,
        y: -6,
      }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer mobile-touch-feedback"
      onClick={() => setSelectedCategory(category)}
    >
      <Card
        className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-2 hover:border-opacity-80 transition-all duration-300 backdrop-blur-sm overflow-hidden relative mobile-card-enhanced"
        style={{ borderColor: category.color + "40" }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
          <div
            className="absolute top-0 right-0 w-32 h-32 transform rotate-45 translate-x-16 -translate-y-16"
            style={{ backgroundColor: category.color + "20" }}
          />
        </div>

        <CardContent className="p-4 lg:p-6 relative z-10">
          {/* Header with mobile optimizations */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div
                className="p-2 lg:p-3 rounded-lg shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                style={{
                  backgroundColor: category.color + "20",
                  boxShadow: `0 0 15px ${category.color}40`,
                }}
              >
                {getCategoryIcon(category.id)}
              </motion.div>
              <div>
                <h3 className="text-white font-bold text-base lg:text-lg">
                  {category.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {category.assetCount} assets
                </p>
              </div>
            </div>

            {/* Enhanced badge with mobile optimization */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge
                className={`${
                  category.performance === "gain"
                    ? "bg-green-500/20 text-green-400 border-green-500/50"
                    : "bg-red-500/20 text-red-400 border-red-500/50"
                } min-h-[32px]`}
              >
                {category.performance === "gain" ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {category.gainLossPercent > 0 ? "+" : ""}
                {category.gainLossPercent.toFixed(1)}%
              </Badge>
            </motion.div>
          </div>

          {/* Value Display */}
          <div className="mb-4">
            <div className="text-2xl font-bold text-white mb-1">
              {formatCurrency(category.totalValue)}
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-400">
                Cost: {formatCurrency(category.totalCost)}
              </span>
              <span
                className={`font-semibold ${
                  category.gainLoss >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {category.gainLoss >= 0 ? "+" : ""}
                {formatCurrency(category.gainLoss)}
              </span>
            </div>
          </div>

          {/* Performance Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Performance</span>
              <span>{Math.abs(category.gainLossPercent).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  category.performance === "gain"
                    ? "bg-gradient-to-r from-green-500 to-green-400"
                    : "bg-gradient-to-r from-red-500 to-red-400"
                }`}
                style={{
                  width: `${Math.min(
                    Math.abs(category.gainLossPercent),
                    100
                  )}%`,
                  boxShadow: `0 0 10px ${
                    category.performance === "gain" ? "#10b981" : "#ef4444"
                  }60`,
                }}
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(
                    Math.abs(category.gainLossPercent),
                    100
                  )}%`,
                }}
                transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700/50">
              <div className="text-gray-400">Avg Value</div>
              <div className="text-white font-semibold">
                {category.assetCount > 0
                  ? formatCurrency(category.totalValue / category.assetCount)
                  : "$0"}
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700/50">
              <div className="text-gray-400">Portfolio %</div>
              <div className="text-white font-semibold">
                {portfolioSummary.totalValue > 0
                  ? (
                      (category.totalValue / portfolioSummary.totalValue) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const StatsView = () => (
    <div className="space-y-6">
      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-400 text-sm font-medium">
                  Total Categories
                </p>
                <p className="text-2xl font-bold text-white">
                  {categoryStats.length}
                </p>
              </div>
              <Grid3X3 className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Profitable</p>
                <p className="text-2xl font-bold text-white">
                  {categoryStats.filter((c) => c.performance === "gain").length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-400 text-sm font-medium">Losing Value</p>
                <p className="text-2xl font-bold text-white">
                  {categoryStats.filter((c) => c.performance === "loss").length}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">
                  Best Performer
                </p>
                <p className="text-lg font-bold text-white">
                  {categoryStats[0]?.name || "N/A"}
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Stats Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-cyan-400" />
              Category Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      Category
                    </th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">
                      Assets
                    </th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">
                      Total Value
                    </th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">
                      Total Cost
                    </th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">
                      Gain/Loss
                    </th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categoryStats.map((category, index) => (
                    <motion.tr
                      key={category.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: category.color + "20" }}
                          >
                            {getCategoryIcon(category.id)}
                          </div>
                          <span className="text-white font-medium">
                            {category.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-right py-4 px-4 text-gray-300">
                        {category.assetCount}
                      </td>
                      <td className="text-right py-4 px-4 text-white font-semibold">
                        {formatCurrency(category.totalValue)}
                      </td>
                      <td className="text-right py-4 px-4 text-gray-300">
                        {formatCurrency(category.totalCost)}
                      </td>
                      <td
                        className={`text-right py-4 px-4 font-semibold ${
                          category.gainLoss >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {category.gainLoss >= 0 ? "+" : ""}
                        {formatCurrency(category.gainLoss)}
                      </td>
                      <td className="text-right py-4 px-4">
                        <Badge
                          className={`${
                            category.performance === "gain"
                              ? "bg-green-500/20 text-green-400 border-green-500/50"
                              : "bg-red-500/20 text-red-400 border-red-500/50"
                          }`}
                        >
                          {category.performance === "gain" ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {category.gainLossPercent > 0 ? "+" : ""}
                          {category.gainLossPercent.toFixed(1)}%
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
      {/* Mobile Background Enhancement */}
      <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl animate-pulse" />
        <div
          className="absolute top-20 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-28 h-28 bg-violet-500/5 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Mobile-optimized padding */}
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
                className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Grid3X3 className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <motion.h1
                  className="text-2xl lg:text-3xl font-bold text-white neon-text"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  CATEGORIES
                </motion.h1>
                <motion.p
                  className="text-gray-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Manage and analyze your asset categories
                </motion.p>
              </div>
            </div>

            {/* Mobile-optimized view toggle */}
            <div className="flex bg-gray-800/50 rounded-lg p-1 backdrop-blur-sm">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 min-h-[44px] ${
                  viewMode === "grid"
                    ? "bg-purple-500 text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Grid
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("stats")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 min-h-[44px] ${
                  viewMode === "stats"
                    ? "bg-purple-500 text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Stats
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Content with mobile optimizations */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {categoryStats.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>
        ) : (
          <StatsView />
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
