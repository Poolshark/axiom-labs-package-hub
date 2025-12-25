"use client";

/**
 * useTableState - Custom Hook for Table State Management
 *
 * Provides a centralized way to manage table state (pagination, sorting, search)
 * through URL parameters. Extracts common logic from TableHeader, TablePagination,
 * and SearchInput components.
 *
 * Requirements: 5.5, 6.1, 6.2, 6.3
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Table state interface
 */
export interface TableState {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder: "asc" | "desc";
  search?: string;
}

/**
 * Update functions returned by the hook
 */
export interface TableStateActions {
  /** Update the current page */
  setPage: (page: number) => void;
  /** Update the page size */
  setPageSize: (pageSize: number) => void;
  /** Update sort column and direction */
  setSort: (sortBy: string | undefined, sortOrder: "asc" | "desc") => void;
  /** Toggle sort for a column (handles asc -> desc -> unsorted cycle) */
  toggleSort: (columnKey: string) => void;
  /** Update search query (automatically resets to page 1) */
  setSearch: (search: string) => void;
  /** Clear all filters and sorting */
  reset: () => void;
}

/**
 * Return type of useTableState hook
 */
export interface UseTableStateReturn {
  /** Current table state */
  state: TableState;
  /** Functions to update table state */
  actions: TableStateActions;
}

/**
 * Custom hook for managing table state through URL parameters
 *
 * This hook centralizes URL state management for pagination, sorting, and search.
 * It reads the current state from URL search parameters and provides helper
 * functions to update that state.
 *
 * Features:
 * - Reads and parses URL parameters with validation and defaults
 * - Provides type-safe update functions
 * - Automatically resets page to 1 when search changes
 * - Handles sort toggle logic (unsorted -> asc -> desc -> unsorted)
 *
 * @returns Object containing current state and update functions
 *
 * @example
 * ```tsx
 * function MyTable() {
 *   const { state, actions } = useTableState();
 *
 *   return (
 *     <div>
 *       <button onClick={() => actions.setPage(state.page + 1)}>
 *         Next Page
 *       </button>
 *       <button onClick={() => actions.toggleSort('name')}>
 *         Sort by Name
 *       </button>
 *       <input
 *         value={state.search || ''}
 *         onChange={(e) => actions.setSearch(e.target.value)}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useTableState(): UseTableStateReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse current state from URL parameters with validation and defaults
  const state: TableState = {
    page: Math.max(1, Number(searchParams.get("page")) || 1),
    pageSize: Math.max(1, Number(searchParams.get("pageSize")) || 10),
    sortBy: searchParams.get("sortBy") || undefined,
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    search: searchParams.get("search") || undefined,
  };

  /**
   * Helper function to update URL parameters
   */
  const updateParams = useCallback(
    (updates: Partial<TableState>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Apply updates
      if (updates.page !== undefined) {
        params.set("page", String(updates.page));
      }
      if (updates.pageSize !== undefined) {
        params.set("pageSize", String(updates.pageSize));
      }
      if (updates.sortBy !== undefined) {
        params.set("sortBy", updates.sortBy);
      } else if (updates.sortBy === undefined && "sortBy" in updates) {
        // Explicitly clear sortBy if set to undefined
        params.delete("sortBy");
      }
      if (updates.sortOrder !== undefined) {
        params.set("sortOrder", updates.sortOrder);
      } else if (updates.sortOrder === undefined && "sortOrder" in updates) {
        // Explicitly clear sortOrder if set to undefined
        params.delete("sortOrder");
      }
      if (updates.search !== undefined && updates.search !== "") {
        params.set("search", updates.search);
      } else if (
        updates.search === "" ||
        (updates.search === undefined && "search" in updates)
      ) {
        // Clear search if empty or explicitly undefined
        params.delete("search");
      }

      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  /**
   * Update the current page
   * Requirement 6.1: Update URL when pagination changes
   */
  const setPage = useCallback(
    (page: number) => {
      updateParams({ page: Math.max(1, page) });
    },
    [updateParams],
  );

  /**
   * Update the page size
   * Requirement 6.1: Update URL when pagination changes
   */
  const setPageSize = useCallback(
    (pageSize: number) => {
      updateParams({ pageSize: Math.max(1, pageSize), page: 1 });
    },
    [updateParams],
  );

  /**
   * Update sort column and direction
   * Requirement 6.2: Update URL when sorting changes
   */
  const setSort = useCallback(
    (sortBy: string | undefined, sortOrder: "asc" | "desc") => {
      if (sortBy === undefined) {
        updateParams({ sortBy: undefined, sortOrder: undefined });
      } else {
        updateParams({ sortBy, sortOrder });
      }
    },
    [updateParams],
  );

  /**
   * Toggle sort for a column
   * Implements the sort cycle: unsorted -> asc -> desc -> unsorted
   * Requirement 6.2: Update URL when sorting changes
   */
  const toggleSort = useCallback(
    (columnKey: string) => {
      if (state.sortBy === columnKey) {
        // Column is currently sorted
        if (state.sortOrder === "asc") {
          // Switch to descending
          updateParams({ sortBy: columnKey, sortOrder: "desc" });
        } else {
          // Clear sorting (was desc, now unsorted)
          updateParams({ sortBy: undefined, sortOrder: undefined });
        }
      } else {
        // New column, start with ascending
        updateParams({ sortBy: columnKey, sortOrder: "asc" });
      }
    },
    [state.sortBy, state.sortOrder, updateParams],
  );

  /**
   * Update search query
   * Automatically resets page to 1 when search changes
   * Requirement 6.3: Update URL when search changes
   * Requirement 4.2: Reset page to 1 when search changes
   */
  const setSearch = useCallback(
    (search: string) => {
      updateParams({ search, page: 1 });
    },
    [updateParams],
  );

  /**
   * Clear all filters and sorting, reset to defaults
   */
  const reset = useCallback(() => {
    router.push("?page=1");
  }, [router]);

  const actions: TableStateActions = {
    setPage,
    setPageSize,
    setSort,
    toggleSort,
    setSearch,
    reset,
  };

  return { state, actions };
}
