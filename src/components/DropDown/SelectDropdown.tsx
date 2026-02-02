"use client";

import React from "react";

interface SelectDropdownProps {
  value: number | string;
  options: Array<number | string>;
  onChange: (value: any) => void;
  className?: string;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  value,
  options,
  onChange,
  className = "",
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`border border-primary-grey rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black ${className}`}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
