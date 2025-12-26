"use client";
import React from "react";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";

interface ConfirmModalProps {
  heading: string;
  text: string;
  onConfirm: () => void;
  btnClass?: string;
  trigger?: React.ReactNode; // Optional: custom trigger button/icon
}

export default function ConfirmModal({
  heading,
  text,
  onConfirm,
  btnClass,
  trigger
}: ConfirmModalProps) {
  const { isOpen, openModal, closeModal } = useModal();

  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  return (
    <>
      {/* Trigger Button/Icon */}
      {trigger ? (
        <div onClick={openModal}>{trigger}</div>
      ) : (
        <button
          onClick={openModal}
          className="p-1 text-gray-400 hover:text-error-500 dark:hover:text-error-400 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        showCloseButton={false}
        className="max-w-[507px] p-6 lg:p-10"
      >
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error-100 text-error-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          {/* Heading */}
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {heading}
          </h4>

          {/* Description */}
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            {text}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-center w-full gap-3 mt-8">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              size="sm"
              className={btnClass}
              onClick={handleConfirm}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
