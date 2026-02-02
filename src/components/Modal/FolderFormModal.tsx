"use client";

import React from "react";
import { FolderFormModalProps } from "./ModalProps";
import { Modal } from "./Modal";
import { TextInput } from "../Input/TextInput";
import { Button } from "../Button";
import { FolderPlus } from "lucide-react";

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
    <Modal onClose={onCancel}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {/* Header */}
        <div className="bg-[#00195c] text-white px-4 py-3 font-medium">
          {title}
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <TextInput
            label="Folder Name"
            value={name}
            onChange={onNameChange}
            placeholder="Enter folder name"
            required
          />

          <TextInput
            label="Description"
            value={description}
            onChange={onDescriptionChange}
            placeholder="Optional description..."
            textarea
            rows={3}
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
            label={submitLabel}
            icon={<FolderPlus size={16} />}
            loading={loading}
            disabled={!name}
            variant="submit"
          />
        </div>
      </form>
    </Modal>
  );
};
