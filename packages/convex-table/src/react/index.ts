"use client";

// React-specific components

// Re-export shared types
export type {
	ColumnDef,
	ColumnMetadata,
	DataTableProps,
	TableQueryResult,
	TypedColumnDef,
} from "../shared/types";
export type { SearchInputProps } from "./SearchInput";
export { SearchInput } from "./SearchInput";
export type { TableHeaderProps } from "./TableHeader";
export { TableHeader } from "./TableHeader";
export type { TablePaginationProps } from "./TablePagination";
export { TablePagination } from "./TablePagination";
export type {
	TableState,
	TableStateActions,
	UseTableStateReturn,
} from "./useTableState";
export { useTableState } from "./useTableState";
