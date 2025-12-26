"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  total: number;
  limit: number;
  basePath?: string; // default: current pathname or "/"
  paramKey?: string; // default: "page"
  className?: string;
}

export default function Pagination({
  total,
  limit,
  basePath,
  paramKey = "page",
  className = "",
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // default to current path if basePath not provided
  const pathname = basePath || window.location.pathname;

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramKey, String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentPage = Number(searchParams.get(paramKey)) || 1;

  return (
    <div
      className={`w-full px-3 md:px-[55px] flex justify-center md:justify-end items-center my-8 ${className}`}
    >
      <ReactPaginate
        breakLabel="..."
        previousLabel="Prev"
        nextLabel="Next"
        pageCount={Math.ceil(total / limit)}
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
        forcePage={currentPage - 1} // sync with current URL
        onPageChange={(e) => setPage(e.selected + 1)}
        className="text-black dark:text-gray-200 flex items-center gap-2 text-sm cursor-pointer"
        previousClassName="text-black dark:text-gray-200 text-sm"
        nextClassName="text-black dark:text-gray-200 text-sm"
        pageLinkClassName="px-2 border border-black dark:border-gray-200 rounded-md text-sm"
        activeClassName="bg-black text-white dark:bg-gray-200 dark:text-black rounded-md"
        renderOnZeroPageCount={null}
      />
    </div>
  );
}
