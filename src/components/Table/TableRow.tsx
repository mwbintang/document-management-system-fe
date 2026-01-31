import React, { useEffect, useRef, useState } from "react";
import { TableRowProps } from "./TableProps";
import { formatDate } from "@/src/lib/date";

export const TableRow: React.FC<TableRowProps> = ({
  item,
  columns,
  isSelected,
  onSelect,
  handleUpdateData,
  handleDeleteData,
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

  // const handleUpdate = () => {
  //   setOpen(false);
  //   console.log("Update:", item.id);
  //   // 👉 open update modal here
  // };

  // const handleDelete = () => {
  //   setOpen(false);
  //   console.log("Delete:", item.id);
  //   // 👉 open confirm delete modal here
  // };

  return (
    <tr className="hover:bg-gray-50">
      <td className="p-3 border-b">
        <input type="checkbox" checked={isSelected} onChange={onSelect} />
      </td>

      {columns.map((col) => (
        <td key={col.key} className="p-3 border-b">
          {col.date ? formatDate(item[col.key]) : item[col.key]}
        </td>
      ))}

      {/* Actions */}
      <td className="p-3 border-b text-right relative">
        <div ref={dropdownRef} className="inline-block text-left">
          <button
            className="px-2 py-1 text-gray-500 hover:text-black"
            onClick={() => setOpen((prev) => !prev)}
          >
            ⋯
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-32 rounded-md border bg-white shadow-lg z-10">
              <button
                // onClick={handleUpdate}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                Update
              </button>

              <button
                onClick={handleDeleteData ? () => handleDeleteData(Number(item.id)) : () => {}}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};
