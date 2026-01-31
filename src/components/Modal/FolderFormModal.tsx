"use client";

import React from "react";
import { FolderFormModalProps } from "./ModalProps";

export const FolderFormModal: React.FC<FolderFormModalProps> = ({
  title,
  submitLabel,
  name,
  description,
  loading = false,
  onNameChange,
  onDescriptionChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

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
          <div className="space-y-1">
            <label className="text-sm font-medium">Folder Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Enter folder name"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
              rows={3}
              placeholder="Optional description..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md border text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || !name}
            className="px-4 py-2 rounded-md border text-sm disabled:opacity-50"
          >
            {loading ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};
