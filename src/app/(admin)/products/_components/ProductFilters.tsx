"use client";

import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { TCategory } from "@/types/category";
import { useSearchParams } from "next/navigation";

export default function ProductFilters({
    categories,
}: {
    categories: TCategory[];
}) {
    const updateQuery = useUpdateQuery();
    const searchParams = useSearchParams();

    const currentCategory = searchParams.get("category") || "";
    const currentStatus = searchParams.get("status") || "";
    const currentFeatured = searchParams.get("featured") || "";
    const currentShipping = searchParams.get("shipping") || "";

    const selectClass =
        "rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 py-2 pl-3 pr-8 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none cursor-pointer transition-colors";

    const handleChange = (key: string, value: string) => {
        updateQuery({ [key]: value || undefined, page: "1" }, true);
    };

    const hasActiveFilters = currentCategory || currentStatus || currentFeatured || currentShipping;

    const clearAll = () => {
        updateQuery(
            { category: undefined, status: undefined, featured: undefined, shipping: undefined, search: undefined, page: "1" },
            true
        );
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Category */}
            <select
                value={currentCategory}
                onChange={(e) => handleChange("category", e.target.value)}
                className={selectClass}
            >
                <option value="">All Categories</option>
                {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                        {c.name}
                    </option>
                ))}
            </select>

            {/* Status */}
            <select
                value={currentStatus}
                onChange={(e) => handleChange("status", e.target.value)}
                className={selectClass}
            >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
            </select>

            {/* Featured */}
            <select
                value={currentFeatured}
                onChange={(e) => handleChange("featured", e.target.value)}
                className={selectClass}
            >
                <option value="">All Products</option>
                <option value="true">Featured</option>
                <option value="false">Regular</option>
            </select>

            {/* Shipping */}
            <select
                value={currentShipping}
                onChange={(e) => handleChange("shipping", e.target.value)}
                className={selectClass}
            >
                <option value="">All Shipping</option>
                <option value="true">Free Shipping</option>
                <option value="false">Paid Shipping</option>
            </select>

            {/* Clear All */}
            {hasActiveFilters && (
                <button
                    onClick={clearAll}
                    className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2 py-2"
                >
                    ✕ Clear
                </button>
            )}
        </div>
    );
}
