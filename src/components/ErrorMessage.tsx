"use client";

import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  message = "Something went wrong",
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-red-600">
      <AlertTriangle className="w-10 h-10 mb-3 text-red-500" />
      <p className="text-sm font-medium">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md shadow-md transition-all"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
