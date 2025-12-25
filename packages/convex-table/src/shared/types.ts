/**
 * Core types for the server-side data table component
 */

/**
 * Column definition with proper type inference for render function
 * @template T - The type of row data
 * @template K - The specific key of the column
 */
export type TypedColumnDef<T, K extends keyof T & string> = {
	/** Unique identifier for the column, must match a key in the row data */
	key: K;
	/** Display label shown in the table header */
	label: string;
	/** Whether this column can be sorted (default: false) */
	sortable?: boolean;
	/** Whether this column is included in search filtering (default: false) */
	searchable?: boolean;
	/** Custom render function for cell content with properly typed value */
	render?: (value: T[K], row: T) => React.ReactNode;
};

/**
 * Column definition for table display and behavior
 * @template T - The type of row data
 */
export type ColumnDef<T> = {
	[K in keyof T & string]: TypedColumnDef<T, K>;
}[keyof T & string];

/**
 * Props for the main DataTable component
 * @template T - The type of row data
 */
export type DataTableProps<T> = {
	/** Column definitions for the table */
	columns: ColumnDef<T>[];
	/** Array of row data to display */
	data: T[];
	/** Search query string (used for empty state message) */
	search?: string;
};

/**
 * Result structure returned by Convex table queries
 * @template T - The type of row data
 */
export type TableQueryResult<T> = {
	/** Array of data records for the current page */
	data: T[];
	/** Total count of records matching the query (across all pages) */
	totalCount: number;
};

/**
 * URL search parameters for table state
 */
export type TableSearchParams = {
	/** Current page number (1-indexed) */
	page?: string;
	/** Number of items per page */
	pageSize?: string;
	/** Column key to sort by */
	sortBy?: string;
	/** Sort direction */
	sortOrder?: "asc" | "desc";
	/** Search query string */
	search?: string;
	/** Cursor for cursor-based pagination (Convex) */
	cursor?: string;
};

/**
 * Parsed and validated table state
 */
export type TableState = {
	/** Current page number (1-indexed, minimum 1) */
	page: number;
	/** Number of items per page (minimum 1) */
	pageSize: number;
	/** Column key to sort by */
	sortBy?: string;
	/** Sort direction (defaults to "asc") */
	sortOrder: "asc" | "desc";
	/** Search query string */
	search?: string;
	/** Cursor for cursor-based pagination */
	cursor?: string;
};

/**
 * Column metadata for client components (without render functions)
 */
export type ColumnMetadata = {
	/** Unique identifier for the column */
	key: string;
	/** Display label shown in the table header */
	label: string;
	/** Whether this column can be sorted (default: false) */
	sortable?: boolean;
};

/**
 * Props for TableHeader component
 */
export type TableHeaderProps = {
	/** Column metadata (without render functions for serialization) */
	columns: ColumnMetadata[];
	/** Current sort column */
	sortBy?: string;
	/** Current sort direction */
	sortOrder?: "asc" | "desc";
};

/**
 * Props for page-based pagination (traditional pagination with page numbers)
 */
export type PageBasedPaginationProps = {
	/** Pagination mode */
	mode: "page";
	/** Current page number (1-indexed) */
	page: number;
	/** Number of items per page */
	pageSize: number;
	/** Total count of records */
	totalCount: number;
};

/**
 * Props for cursor-based pagination (Convex-style pagination)
 */
export type CursorBasedPaginationProps = {
	/** Pagination mode */
	mode: "cursor";
	/** Whether there are more results available */
	hasMore: boolean;
	/** The cursor for the next page (from Convex continueCursor) */
	nextCursor: string | null;
	/** Current cursor (null for first page) */
	currentCursor?: string | null;
};

/**
 * Props for TablePagination component
 * Supports both page-based and cursor-based pagination
 */
export type TablePaginationProps =
	| PageBasedPaginationProps
	| CursorBasedPaginationProps;

/**
 * Props for SearchInput component
 */
export type SearchInputProps = {
	/** Initial search value from URL */
	initialValue?: string;
	/** Placeholder text for the search input */
	placeholder?: string;
};
