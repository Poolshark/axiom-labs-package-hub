/**
 * Next.js Entry Point
 *
 * Exports Next.js-specific components that integrate with Next.js App Router.
 * These components use useRouter and useSearchParams to sync table state with URL parameters.
 *
 * Requirements: 2.1, 4.5
 */

// Export types from shared
export type {
	ColumnDef,
	ColumnMetadata,
	DataTableProps,
	SearchInputProps,
	TableHeaderProps,
	TablePaginationProps,
	TableQueryResult,
	TableSearchParams,
	TableState,
	TypedColumnDef,
} from "../shared/types";
// Export Next.js components
export { SearchInput } from "./SearchInput";
export { TableHeader } from "./TableHeader";
export { TablePagination } from "./TablePagination";
export { useTableState } from "./useTableState";
