"use client";

import React, { useState } from "react";
import { TableRow } from "./TableRow";
import { TableProps } from "./TableProps";
import { Pagination } from "../Pagination";

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
}) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const isAllSelected =
        data.length > 0 && selectedIds.length === data.length;

    const toggleSelectAll = () => {
        const newSelected = isAllSelected ? [] : data.map((item) => item.id);
        setSelectedIds(newSelected);
        onSelectionChange?.(newSelected);
    };

    const toggleSelectOne = (id: string) => {
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

                        {/* Actions column */}
                        <th className="p-3 border-b text-right w-10"></th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((item) => (
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
                </tbody>
            </table>

            <Pagination
                page={page}
                limit={limit}
                totalPages={totalPages}
                onPageChange={onPageChange}
                onLimitChange={onLimitChange}/>
        </div>
    );
};
