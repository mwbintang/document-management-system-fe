"use client";

import Image from "next/image";
import React from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  imageAlt?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  icon,
  imageAlt = "button icon",
  disabled = false,
  variant = "primary",
}) => {
  const baseStyle =
    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition";

  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-gray-100 text-black hover:bg-gray-200",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
    >
      {icon && <span className="flex items-center">{icon}</span>}

      {label}
    </button>
  );
};
