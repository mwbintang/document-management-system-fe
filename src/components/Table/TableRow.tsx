import React, { useEffect, useRef, useState } from "react";
import { TableRowProps } from "./TableProps";
import { formatDate } from "@/src/lib/date";
import { ActionDropdown } from "../DropDown/ActionDropDown";

export const TableRow: React.FC<TableRowProps> = ({
  item,
  columns,
  isSelected,
  onSelect,
  handleUpdateData,
  handleDeleteData,
  handleClickDetail
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <tr className="hover:bg-gray-50 bg-white">
      <td className="p-3 border-b border-[#dcdcde]">
        <input type="checkbox" checked={isSelected} onChange={onSelect} />
      </td>

      {columns.map((col) => (
        <td
          key={col.key}
          className={`border-b border-[#dcdcde] ${handleClickDetail ? 'cursor-pointer' : ''}`}
          onClick={() => handleClickDetail && handleClickDetail(item.id)}
        >
          {col.date ? formatDate(item[col.key]) : item[col.key]}
        </td>
      ))}

      {/* Actions */}
      <td className="p-3 border-b border-[#dcdcde] text-right relative">
        <div ref={dropdownRef} className="inline-block text-left">
          <button
            className="px-2 py-1 text-gray-500 cursor-pointer hover:text-black"
            onClick={() => setOpen((prev) => !prev)}
          >
            ⋯
          </button>

          {open && (
            <ActionDropdown
              onUpdate={() => handleUpdateData?.(item.id)}
              onDelete={() => handleDeleteData?.(item.id)}
            />
          )}
        </div>
      </td>
    </tr>
  );
};
