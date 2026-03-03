"use client";

import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ProductSearch() {
    const updateQuery = useUpdateQuery();
    const searchParams = useSearchParams();
    const currentSearch = searchParams.get("search") || "";
    const [value, setValue] = useState(currentSearch);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            if (value !== currentSearch) {
                updateQuery({ search: value || undefined, page: "1" }, true);
            }
        }, 400);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="relative">
            <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search products..."
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 py-2 pl-9 pr-3 text-sm w-56 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors"
            />
            {value && (
                <button
                    onClick={() => setValue("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
