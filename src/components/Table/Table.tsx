"use client";

import React, { useState } from "react";
import { TableRow } from "./TableRow";
import { TableProps } from "./TableProps";
import { Pagination } from "../Pagination";
import { Loading } from "../Loading";

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  onSelectionChange,
  onPageChange,
  onLimitChange,
  page,
  limit,
  totalPages,
  handleUpdateData,
  handleDeleteData,
  loading,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const isAllSelected =
    data.length > 0 && selectedIds.length === data.length;

  const toggleSelectAll = () => {
    const newSelected = isAllSelected ? [] : data.map((item) => item.id);
    setSelectedIds(newSelected);
    onSelectionChange?.(newSelected);
  };

  const toggleSelectOne = (id: number) => {
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];

    setSelectedIds(newSelected);
    onSelectionChange?.(newSelected);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border-b text-left">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                disabled={loading}
              />
            </th>

            {columns.map((col) => (
              <th
                key={col.key}
                className="p-3 border-b text-left font-medium"
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    <span className="text-xs text-gray-400 cursor-pointer">
                      ⇅
                    </span>
                  )}
                </div>
              </th>
            ))}

            <th className="p-3 border-b text-right w-10" />
          </tr>
        </thead>

        <tbody>
          {/* ✅ Loading state */}
          {loading && (
            <tr>
              <td colSpan={columns.length + 2} className="h-40">
                <div className="flex items-center justify-center h-full">
                  <Loading size="lg" />
                </div>
              </td>
            </tr>
          )}

          {/* ✅ Data rows */}
          {!loading &&
            data.map((item) => (
              <TableRow
                key={item.id}
                item={item}
                columns={columns}
                isSelected={selectedIds.includes(item.id)}
                onSelect={() => toggleSelectOne(item.id)}
                handleUpdateData={handleUpdateData}
                handleDeleteData={handleDeleteData}
              />
            ))}

          {/* ✅ Empty state */}
          {!loading && data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 2}
                className="py-10 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Hide pagination while loading */}
      {!loading && (
        <Pagination
          page={page}
          limit={limit}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
};
