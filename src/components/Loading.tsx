"use client";

import React from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  overlay?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = "md",
  overlay = false,
}) => {
  const sizeMap = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-4",
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-gray-300 border-t-black ${sizeMap[size]}`}
    />
  );

  if (!overlay) return spinner;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      {spinner}
    </div>
  );
};
