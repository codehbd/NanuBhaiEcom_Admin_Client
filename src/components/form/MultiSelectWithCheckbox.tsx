"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options: Option[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  label?: string;
};

export default function MultiSelectWithCheckbox({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  label,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggleOption = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <div className="relative w-full">
      {label && (
        <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </p>
      )}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-3 py-2.5 text-sm focus:outline-none"
      >
        <span className="truncate text-gray-800 dark:text-gray-100">
          {value.length > 0
            ? options
                .filter((opt) => value.includes(opt.value))
                .map((opt) => opt.label)
                .join(", ")
            : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {open && (
        <div className="absolute mt-1 z-10 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => toggleOption(opt.value)}
              className="flex items-center px-3 py-2 cursor-pointer  text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <input
                type="checkbox"
                checked={value.includes(opt.value)}
                onChange={() => toggleOption(opt.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-800 dark:text-gray-100 ">
                {opt.label}
              </span>
              {value.includes(opt.value) && (
                <Check className="ml-auto w-4 h-4 text-green-500" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
