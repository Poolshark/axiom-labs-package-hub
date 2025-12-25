"use client";

import type { ColumnMetadata } from "../shared/types";

export interface TableHeaderProps {
	/** Column metadata */
	columns: ColumnMetadata[];
	/** Current sort column */
	sortBy?: string;
	/** Current sort direction */
	sortOrder?: "asc" | "desc";
	/** Callback when sort changes */
	onSort: (columnKey: string, sortOrder: "asc" | "desc" | undefined) => void;
}

export function TableHeader({
	columns,
	sortBy,
	sortOrder,
	onSort,
}: TableHeaderProps) {
	const handleSort = (columnKey: string) => {
		if (sortBy === columnKey) {
			// Toggle through: asc -> desc -> unsorted
			if (sortOrder === "asc") {
				onSort(columnKey, "desc");
			} else {
				onSort(columnKey, undefined);
			}
		} else {
			// New column, start with asc
			onSort(columnKey, "asc");
		}
	};

	const getSortIndicator = (columnKey: string) => {
		if (sortBy !== columnKey) return null;
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
