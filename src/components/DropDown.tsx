"use client";

import React, { useRef } from "react";

interface DropdownItem {
  label: string;
  onClick: () => void;
}

interface DropdownProps {
  items: DropdownItem[];
}

export const Dropdown: React.FC<DropdownProps> = ({ items }) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={ref}>
      <button
        // onClick={() => setOpen((v) => !v)}
        className="px-2 text-gray-500 hover:text-black"
      >
        ⋯
      </button>

        <div className="absolute right-0 mt-2 w-32 rounded-md border bg-white shadow-md z-10">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                // item.onClick();
                // setOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              {item.label}
            </button>
          ))}
        </div>
    </div>
  );
};
