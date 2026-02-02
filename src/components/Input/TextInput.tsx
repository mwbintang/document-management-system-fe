"use client";

import React from "react";

interface TextInputProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  type?: "text" | "search";
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  textarea = false,
  rows = 3,
  required = false,
  disabled = false,
  helperText,
  type = "text",
}) => {
  const baseClass =
    "w-full rounded-md border border-primary-grey px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black disabled:opacity-50";

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={baseClass}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={baseClass}
        />
      )}

      {helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
