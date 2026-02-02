"use client";

import React, { useRef, useEffect } from "react";

interface ActionDropdownProps {
  onUpdate?: () => void;
  onDelete?: () => void;
}

export const ActionDropdown: React.FC<ActionDropdownProps> = ({
  onUpdate,
  onDelete
}) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="absolute right-0 mt-2 w-32 rounded-md bg-white border border-[#dcdcde] shadow-lg z-50"
    >
      {onUpdate && (
        <button
          onClick={onUpdate}
          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
        >
          Update
        </button>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      )}
    </div>
  );
};
