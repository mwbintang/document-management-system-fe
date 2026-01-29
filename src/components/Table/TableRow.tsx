import React from "react";
import { TableRowProps } from "./TableProps";

export const TableRow: React.FC<TableRowProps> = ({
  item,
  columns,
  isSelected,
  onSelect,
}) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="p-3 border-b">
        <input type="checkbox" checked={isSelected} onChange={onSelect} />
      </td>

      {columns.map((col) => (
        <td key={col.key} className="p-3 border-b">
          {item[col.key]}
        </td>
      ))}

      {/* Actions */}
      <td className="p-3 border-b text-right">
        <button
          className="px-2 text-gray-500 hover:text-black"
          onClick={() => console.log("Action for:", item.id)}
        >
          ⋯
        </button>
      </td>
    </tr>
  );
};
