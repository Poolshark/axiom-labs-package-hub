/**
 * Utility functions for parsing and validating table URL parameters
 */

import type { TableSearchParams, TableState } from "./types";

/**
 * Parse and validate URL search parameters into table state
 *
 * Applies validation and defaults:
 * - Invalid page numbers default to 1
 * - Invalid page sizes default to 10
 * - Invalid sort orders default to "asc"
 * - Page numbers less than 1 default to 1
 * - Page sizes less than 1 default to 10
 *
 * @param searchParams - URL search parameters from Next.js
 * @returns Validated table state with defaults applied
 */
export function parseTableParams(searchParams: TableSearchParams): TableState {
	// Parse and validate page number
	const pageNum = Number(searchParams.page);
	const page = Number.isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;

	// Parse and validate page size
	const pageSizeNum = Number(searchParams.pageSize);
	const pageSize =
		Number.isNaN(pageSizeNum) || pageSizeNum < 1 ? 10 : pageSizeNum;

	// Validate sort order
	const sortOrder =
		searchParams.sortOrder === "asc" || searchParams.sortOrder === "desc"
			? searchParams.sortOrder
			: "asc";

	// Extract optional parameters
	const sortBy = searchParams.sortBy || undefined;
	const search = searchParams.search || undefined;

	return {
		page,
		pageSize,
		sortBy,
		sortOrder,
		search,
	};
}

/**
 * Build URL search parameters from table state
 *
 * @param state - Current table state
 * @returns URLSearchParams object for navigation
 */
export function buildTableParams(state: Partial<TableState>): URLSearchParams {
	const params = new URLSearchParams();

	if (state.page !== undefined && state.page !== 1) {
		params.set("page", state.page.toString());
	}

	if (state.pageSize !== undefined && state.pageSize !== 10) {
		params.set("pageSize", state.pageSize.toString());
	}

	if (state.sortBy) {
		params.set("sortBy", state.sortBy);
	}

	if (state.sortOrder && state.sortOrder !== "asc") {
		params.set("sortOrder", state.sortOrder);
	}

	if (state.search) {
		params.set("search", state.search);
	}

	return params;
}

/**
 * Calculate total number of pages based on total count and page size
 *
 * @param totalCount - Total number of records
 * @param pageSize - Number of items per page
 * @returns Total number of pages (minimum 1)
 */
export function calculateTotalPages(
	totalCount: number,
	pageSize: number,
): number {
	if (totalCount <= 0 || pageSize <= 0) {
		return 1;
	}
	return Math.ceil(totalCount / pageSize);
}

/**
 * Check if a page number is valid for the given total count and page size
 *
 * @param page - Page number to validate (1-indexed)
 * @param totalCount - Total number of records
 * @param pageSize - Number of items per page
 * @returns true if page is valid, false otherwise
 */
export function isValidPage(
	page: number,
	totalCount: number,
	pageSize: number,
): boolean {
	if (page < 1) {
		return false;
	}
	const totalPages = calculateTotalPages(totalCount, pageSize);
	return page <= totalPages;
}

/**
 * Validate that a string is a valid key of type T
 * This is a type guard that narrows the type from string to keyof T
 *
 * @template T - The type to validate against
 * @param key - The string to validate
 * @param validKeys - Array of valid keys from type T
 * @returns Type guard indicating if key is valid
 */
export function isValidKey<T>(
	key: string | undefined,
	validKeys: ReadonlyArray<keyof T & string>,
): key is keyof T & string {
	return key !== undefined && validKeys.includes(key as keyof T & string);
}

/**
 * Validate and cast a sortBy parameter to a type-safe key
 * Returns undefined if the key is not valid
 *
 * @template T - The type to validate against
 * @param sortBy - The sortBy parameter from URL
 * @param validKeys - Array of valid sortable keys from type T
 * @returns Type-safe key or undefined
 */
export function validateSortBy<T>(
	sortBy: string | undefined,
	validKeys: ReadonlyArray<keyof T & string>,
): (keyof T & string) | undefined {
	return isValidKey<T>(sortBy, validKeys) ? sortBy : undefined;
}
