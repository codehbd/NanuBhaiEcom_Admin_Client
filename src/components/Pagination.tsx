"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const COOKIE_KEY = "rows_per_page";

interface PaginationProps {
  total: number;
  limit: number;
  basePath?: string;
  paramKey?: string;
  limitParamKey?: string;
  className?: string;
  showRowsPerPage?: boolean;
  rowsPerPageOptions?: number[];
}

export default function Pagination({
  total,
  limit,
  basePath,
  paramKey = "page",
  limitParamKey = "limit",
  className = "",
  showRowsPerPage = true,
  rowsPerPageOptions = [5, 10, 20, 50],
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPathname = usePathname();
  const pathname = basePath || currentPathname;

  const currentPage = Number(searchParams.get(paramKey)) || 1;
  const pageCount = Math.ceil(total / limit);
  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  const navigate = (params: URLSearchParams) => {
    router.push(`${pathname}?${params.toString()}`);
  };

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramKey, String(page));
    navigate(params);
  };

  const setLimit = (newLimit: number) => {
    // Save preference in cookie (accessible by server on next request)
    document.cookie = `${COOKIE_KEY}=${newLimit};path=/;max-age=${60 * 60 * 24 * 365}`;
    const params = new URLSearchParams(searchParams.toString());
    params.set(limitParamKey, String(newLimit));
    params.set(paramKey, "1");
    navigate(params);
  };

  // Smart page number generation
  const getPageNumbers = (): (number | "...")[] => {
    if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(pageCount - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < pageCount - 2) pages.push("...");
    pages.push(pageCount);
    return pages;
  };

  if (total === 0) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-end sm:items-center justify-end gap-4 py-3 ${className}`}>
      {/* Rows per page */}
      {showRowsPerPage && (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="whitespace-nowrap">Rows per page</span>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 py-1 pl-2 pr-7 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none cursor-pointer"
          >
            {rowsPerPageOptions.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      )}

      {/* Divider */}
      <div className="hidden sm:block h-4 w-px bg-gray-700/20 dark:bg-gray-500/20" />

      {/* Summary */}
      <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {startItem}–{endItem} of {total}
      </span>

      {/* Divider */}
      <div className="hidden sm:block h-4 w-px bg-gray-700/20 dark:bg-gray-500/20" />

      {/* Navigation */}
      <div className="flex items-center gap-0.5">
        {/* First */}
        <button
          onClick={() => setPage(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        {/* Previous */}
        <button
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={`dots-${idx}`} className="w-8 text-center text-xs text-gray-400 dark:text-gray-600 select-none">
              •••
            </span>
          ) : (
            <button
              key={page}
              onClick={() => setPage(page)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${currentPage === page
                ? "bg-brand-500 text-white shadow-sm shadow-brand-500/25"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage >= pageCount}
          className="p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Last */}
        <button
          onClick={() => setPage(pageCount)}
          disabled={currentPage >= pageCount}
          className="p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
