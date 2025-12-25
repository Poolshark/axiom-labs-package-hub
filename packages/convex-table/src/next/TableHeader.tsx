"use client";

/**
 * TableHeader - Client Component
 *
 * Renders table column headers with sorting controls.
 * Updates URL parameters when sort state changes.
 *
 * Requirements: 3.1, 3.2, 3.3, 3.5
 */

import { useRouter, useSearchParams } from "next/navigation";
import type { TableHeaderProps } from "../shared/types";

/**
 * Client-side table header component with sorting controls
 *
 * Sort Logic:
 * - If column not currently sorted: set sortBy=column, sortOrder=asc
 * - If column sorted asc: set sortOrder=desc
 * - If column sorted desc: clear sortBy and sortOrder
 *
 * @param props - TableHeader props including columns and current sort state
 */
export function TableHeader({ columns, sortBy, sortOrder }: TableHeaderProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	/**
	 * Handle column header click for sorting
	 */
	const handleSort = (columnKey: string) => {
		// Build new state based on current sort state
		const params = new URLSearchParams(searchParams.toString());

		if (sortBy === columnKey) {
			// Column is currently sorted
			if (sortOrder === "asc") {
				// Switch to descending
				params.set("sortBy", columnKey);
				params.set("sortOrder", "desc");
			} else {
				// Clear sorting (was desc, now unsorted)
				params.delete("sortBy");
				params.delete("sortOrder");
			}
		} else {
			// New column, start with ascending
			params.set("sortBy", columnKey);
			params.set("sortOrder", "asc");
		}

		// Navigate with new params
		router.push(`?${params.toString()}`);
	};

	/**
	 * Get sort indicator for a column
	 */
	const getSortIndicator = (columnKey: string) => {
		if (sortBy !== columnKey) {
			return null;
		}
		return sortOrder === "asc" ? " ↑" : " ↓";
	};

	return (
		<thead className="[&_tr]:border-b">
			<tr className="border-b transition-colors hover:bg-muted/50">
				{columns.map((column) => {
					const isSortable = column.sortable ?? false;
					const indicator = getSortIndicator(column.key);

					return (
						<th
							key={column.key}
							className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
							aria-sort={
								isSortable && sortBy === column.key
									? sortOrder === "asc"
										? "ascending"
										: "descending"
									: "none"
							}
						>
							{isSortable ? (
								<button
									type="button"
									onClick={() => handleSort(column.key)}
									className="flex items-center gap-1 rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									aria-label={
										sortBy === column.key
											? `Sort by ${column.label} ${sortOrder === "asc" ? "descending" : "ascending"}`
											: `Sort by ${column.label}`
									}
								>
									{column.label}
									{indicator && (
										<span className="text-xs" aria-hidden="true">
											{indicator}
										</span>
									)}
								</button>
							) : (
								column.label
							)}
						</th>
					);
				})}
			</tr>
		</thead>
	);
}
