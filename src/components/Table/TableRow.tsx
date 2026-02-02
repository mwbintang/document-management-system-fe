import React, { useEffect, useRef, useState } from "react";
import { TableRowProps } from "./TableProps";
import { formatDate } from "@/src/lib/date";
import { ActionDropdown } from "../DropDown/ActionDropDown";
import { File, Folder } from "lucide-react";

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
      <td className="p-3 border-b border-primary-grey">
        <input type="checkbox" checked={isSelected} onChange={onSelect} />
      </td>

      {columns.map((col) => {
        const isNameColumn = col.key === "name";

        return (
          <td
            key={col.key}
            className={`border-b border-primary-grey ${handleClickDetail && isNameColumn ? "cursor-pointer" : ""
              }`}
            onClick={() =>
              isNameColumn && handleClickDetail && handleClickDetail(item.id)
            }
          >
            {isNameColumn ? (
              <div className="flex items-center gap-2">
                {item.type === "FOLDER" && (
                  <Folder size={16} className="text-yellow-600 shrink-0" />
                )}

                {item.type === "FILE" && (
                  <File size={16} className="text-blue-600 shrink-0" />
                )}

                <span className="truncate">{item[col.key]}</span>
              </div>
            ) : col.date ? (
              formatDate(item[col.key])
            ) : (
              item[col.key]
            )}
          </td>
        );
      })}

      {/* Actions */}
      <td className="p-3 border-b border-primary-grey text-right relative">
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
