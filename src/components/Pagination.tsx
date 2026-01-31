"use client";

import React, { useEffect, useState } from "react";

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
  // if (totalPages <= 1) return null;

  const [startPage, setStartPage] = useState(1);
  // const [endPage, setEndPage] = useState(Math.min(PAGE_WINDOW, totalPages));

  // Keep window in sync when page jumps (first / last / external change)
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
    <div className="flex items-center justify-between mt-4">
      {/* Limit */}
      <div className="flex items-center gap-2 text-sm">
        <span>Show</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="border rounded-md px-2 py-1"
        >
          {[1, 2, 3, 10, 20, 50].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <span>entries</span>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-1">
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
            className={`px-3 py-1 rounded border text-sm ${
              page === p
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
