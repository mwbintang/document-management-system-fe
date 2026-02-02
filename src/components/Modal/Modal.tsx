"use client";

import React from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string; // optional customization
}

export const Modal: React.FC<ModalProps> = ({
  children,
  onClose,
  maxWidth = "max-w-md",
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal container */}
      <div
        className={`relative w-full ${maxWidth} rounded-lg bg-white shadow-lg`}
      >
        {children}
      </div>
    </div>
  );
};
