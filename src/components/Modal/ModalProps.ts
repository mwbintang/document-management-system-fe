export interface FolderFormModalProps {
  title: string;
  submitLabel: string;
  name: string;
  description: string;
  loading?: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export interface FileFormModalProps {
  mode?: "create" | "update";
  title?: string;
  file: File | null;
  description: string;
  loading?: boolean;
  onFileChange: (file: File | null) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  fileName?: string;
}