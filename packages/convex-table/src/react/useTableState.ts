"use client";

import { useCallback, useState } from "react";

export interface TableState {
	page: number;
	pageSize: number;
	sortBy?: string;
	sortOrder: "asc" | "desc";
	search?: string;
}

export interface TableStateActions {
	setPage: (page: number) => void;
	setPageSize: (pageSize: number) => void;
	setSort: (
		sortBy: string | undefined,
		sortOrder: "asc" | "desc" | undefined,
	) => void;
	toggleSort: (columnKey: string) => void;
	setSearch: (search: string) => void;
	reset: () => void;
}

export interface UseTableStateReturn {
	state: TableState;
	actions: TableStateActions;
}

const DEFAULT_STATE: TableState = {
	page: 1,
	pageSize: 10,
	sortOrder: "asc",
};

export function useTableState(
	initialState: Partial<TableState> = {},
): UseTableStateReturn {
	const [state, setState] = useState<TableState>({
		...DEFAULT_STATE,
		...initialState,
	});

	const setPage = useCallback((page: number) => {
		setState((prev) => ({ ...prev, page: Math.max(1, page) }));
	}, []);

	const setPageSize = useCallback((pageSize: number) => {
		setState((prev) => ({
			...prev,
			pageSize: Math.max(1, pageSize),
			page: 1,
		}));
	}, []);

	const setSort = useCallback(
		(sortBy: string | undefined, sortOrder: "asc" | "desc" | undefined) => {
			setState((prev) => ({
				...prev,
				sortBy,
				sortOrder: sortOrder || "asc",
			}));
		},
		[],
	);

	const toggleSort = useCallback((columnKey: string) => {
		setState((prev) => {
			if (prev.sortBy === columnKey) {
				if (prev.sortOrder === "asc") {
					return { ...prev, sortBy: columnKey, sortOrder: "desc" };
				} else {
					return { ...prev, sortBy: undefined, sortOrder: "asc" };
				}
			} else {
				return { ...prev, sortBy: columnKey, sortOrder: "asc" };
			}
		});
	}, []);

	const setSearch = useCallback((search: string) => {
		setState((prev) => ({
			...prev,
			search: search || undefined,
			page: 1,
		}));
	}, []);

	const reset = useCallback(() => {
		setState(DEFAULT_STATE);
	}, []);

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
