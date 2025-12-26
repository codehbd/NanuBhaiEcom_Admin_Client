"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Hook to update query parameters in the URL.
 */
export function useUpdateQuery() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Update query params in the URL.
   * @param params Object of key-value pairs to add/update. Pass undefined/null/"" to remove a param.
   * @param replace If true, replaces history entry instead of pushing a new one
   * @param basePath Optional base path (default = current path)
   */
  const updateQuery = useCallback(
    (
      params: Record<string, string | number | undefined | null>,
      replace = false,
      basePath?: string
    ) => {
      const isChangingPath = basePath && basePath !== window.location.pathname;

      // ✅ If changing path → start fresh query params
      // ✅ If staying on same path → clone existing query params
      const newParams = isChangingPath
        ? new URLSearchParams()
        : new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
      const queryString = newParams.toString();
      const path = basePath ?? window.location.pathname;
      const url = queryString ? `${path}?${queryString}` : path;

      if (replace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [router, searchParams]
  );

  return updateQuery;
}