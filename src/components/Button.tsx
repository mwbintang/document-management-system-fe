"use client";

import React from "react";
import { Loading } from "./Loading";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "submit" | "none";
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  loading = false,
  disabled = false,
  icon,
  variant = "none",
  className = "",
}) => {
  const isDisabled = disabled || loading;

  const baseStyle =
    "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition focus:outline-none";

  const variants = {
    primary: "bg-black! text-white hover:bg-gray-800!",
    secondary: "bg-gray-100! text-black hover:bg-gray-200!",
    danger: "bg-red-600! text-white hover:bg-red-700!",
    submit: "bg-blue-600! text-white hover:bg-blue-700!",
    none: ""
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${baseStyle}
        ${variants[variant]}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
        cursor-pointer
      `}
    >
      {/* Loading has priority */}
      {loading ? (
        <Loading size="sm" />
      ) : (
        icon && <span className="flex items-center">{icon}</span>
      )}

      <span>{label}</span>
    </button>
  );
};
