"use client";

import React, { useRef } from "react";
import { FileIcon, UploadIcon } from "lucide-react";

interface FileInputProps {
  label?: string;
  fileName?: string; // existing file name (update case)
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  onFileChange: (file: File | null) => void;
}

export const FileInput: React.FC<FileInputProps> = ({
  label,
  fileName,
  required = false,
  disabled = false,
  helperText,
  onFileChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium">
          {label} {required && !fileName && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        onClick={() => !disabled && inputRef.current?.click()}
        className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-50 transition"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
          {fileName ? (
            <FileIcon className="h-5 w-5 text-gray-600" />
          ) : (
            <UploadIcon className="h-5 w-5 text-gray-500" />
          )}
        </div>

        <div className="flex flex-col text-sm">
          <span className="font-medium">
            {fileName ?? "Choose file"}
          </span>
          <span className="text-xs text-gray-500">
            Click to upload / replace
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          disabled={disabled}
          required={required && !fileName}
          onChange={(e) =>
            onFileChange(e.target.files?.[0] ?? null)
          }
        />
      </div>

      {helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
