import React from "react";

const Logo = ({
  size = "medium",
  showText = true,
  className = "",
  glowColor = "cyan",
}) => {
  const sizes = {
    small: { icon: 32, text: "text-sm" },
    medium: { icon: 40, text: "text-lg" },
    large: { icon: 64, text: "text-2xl" },
    xlarge: { icon: 80, text: "text-3xl" },
  };

  const currentSize = sizes[size] || sizes.medium;
  const iconSize = currentSize.icon;

  const glowColors = {
    cyan: "drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]",
    blue: "drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]",
    purple: "drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]",
    pink: "drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]",
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Image */}
      <div className={`${glowColors[glowColor]} transition-all duration-300`}>
        <img
          src="/my-asset-tracking.png"
          alt="My Asset Tracking Logo"
          width={iconSize}
          height={iconSize}
          className="transition-transform duration-300 hover:scale-105 object-contain"
        />
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1
            className={`font-bold text-white neon-cyan leading-tight ${currentSize.text}`}
          >
            MY ASSET
          </h1>
          <h2
            className={`font-bold text-white neon-cyan leading-tight ${currentSize.text}`}
          >
            TRACKING
          </h2>
          {size === "medium" || size === "large" || size === "xlarge" ? (
            <p className="text-xs text-gray-400 mt-1">Professional Edition</p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Logo;
