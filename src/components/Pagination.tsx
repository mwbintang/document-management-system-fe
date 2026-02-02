"use client";

import React, { useEffect, useState } from "react";
import { SelectDropdown } from "./DropDown/SelectDropdown";

const PAGE_WINDOW = 5;

interface PaginationProps {
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  limit,
  totalPages,
  onPageChange,
  onLimitChange,
}) => {

  const [startPage, setStartPage] = useState(1);

  useEffect(() => {
    if (page < startPage) {
      setStartPage(page);
    } else if (page >= startPage + PAGE_WINDOW) {
      setStartPage(page - PAGE_WINDOW + 1);
    }
  }, [page]);

  const endPage = Math.min(
    startPage + PAGE_WINDOW - 1,
    totalPages
  );

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="flex items-center justify-between mt-10 mb-3 z-0">
      {/* Limit */}
        <div className="flex items-center gap-2 pl-7">
        <span>Show</span>
          <SelectDropdown
            value={limit}
            options={[1, 2, 3, 10, 20, 50]}
            onChange={onLimitChange}
          />
          <span className="text-md text-gray-600">entries</span>
        </div>

      {/* Pagination */}
      <div className="flex items-center gap-1 pr-7">
        {/* First */}
        <button
          disabled={page === 1}
          onClick={() => onPageChange(1)}
          className="px-3 py-1 rounded border text-sm disabled:opacity-50"
        >
          «
        </button>

        {/* Shift window left */}
        <button
          disabled={startPage === 1}
          onClick={() =>
            setStartPage(Math.max(1, startPage - PAGE_WINDOW))
          }
          className="px-3 py-1 rounded border text-sm disabled:opacity-50"
        >
          ‹
        </button>

        {/* Page numbers */}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded border text-sm ${page === p
              ? "bg-black text-white"
              : "hover:bg-gray-100"
              }`}
          >
            {p}
          </button>
        ))}

        {/* Shift window right */}
        <button
          disabled={endPage === totalPages}
          onClick={() =>
            setStartPage(
              Math.min(
                totalPages - PAGE_WINDOW + 1,
                startPage + PAGE_WINDOW
              )
            )
          }
          className="px-3 py-1 rounded border text-sm disabled:opacity-50"
        >
          ›
        </button>

        {/* Last */}
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-1 rounded border text-sm disabled:opacity-50"
        >
          »
        </button>
      </div>
    </div>
  );
};
