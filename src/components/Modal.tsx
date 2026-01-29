"use client";

import React from "react";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  children,
  onSubmit,
  submitText = "Save",
  cancelText = "Cancel",
  loading = false,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        // onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="relative w-full max-w-md rounded-lg bg-white shadow-lg"
      >
        {/* Header */}
        <div className="border-b px-4 py-3 font-medium">
          {title}
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {children}
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-3 flex justify-end gap-2">
          <button
            type="button"
            // onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-md border text-sm"
          >
            {cancelText}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md border text-sm disabled:opacity-50"
          >
            {loading ? "Saving..." : submitText}
          </button>
        </div>
      </form>
    </div>
  );
};
