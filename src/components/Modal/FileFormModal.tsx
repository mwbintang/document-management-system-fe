"use client";

import React from "react";
import { FileFormModalProps } from "./ModalProps";
import { Loading } from "../Loading";
import { Modal } from "./Modal";
import { TextInput } from "../Input/TextInput";
import { Upload } from "lucide-react";
import { Button } from "../Button";
import { FileInput } from "../Input/FileInput";

export const FileFormModal: React.FC<FileFormModalProps> = ({
  mode = "create",
  title,
  file,
  description,
  loading = false,
  onFileChange,
  onDescriptionChange,
  onSubmit,
  onCancel,
  fileName
}) => {
  const isCreate = mode === "create";

  return (
    <Modal onClose={onCancel}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {/* Header */}
        <div className="bg-dark-blue text-white px-4 py-3 font-medium">
          {title ?? (isCreate ? "Upload File" : "Update File")}
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 mt-1">
          {/* File input */}
          <FileInput
            label={`File ${isCreate ? "" : "(optional)"}`}
            required={isCreate}
            onFileChange={onFileChange}
            fileName={fileName}
            helperText={
              !isCreate ? "Click image to change file" : undefined
            }
          />

          <TextInput
            label="Description"
            value={description}
            onChange={onDescriptionChange}
            placeholder="Optional description..."
            textarea
          />

        </div>

        {/* Footer */}
        <div className="px-4 py-3 flex justify-end gap-2">
          <Button
            label="Cancel"
            variant="secondary"
            onClick={onCancel}
          />

          <Button
            type="submit"
            label={isCreate ? "Upload" : "Update"}
            icon={<Upload size={16} />}
            loading={loading}
            disabled={isCreate && !file}
            variant="submit"
          />
        </div>
      </form>
    </Modal>
  );
};
