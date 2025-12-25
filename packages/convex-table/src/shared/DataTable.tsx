/**
 * DataTable - Server Component
 *
 * Renders a semantic HTML table with data from Convex queries.
 * Supports custom column rendering and empty states.
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

import type { DataTableProps } from "./types";

/**
 * Server-side table component that displays tabular data
 *
 * @template T - The type of row data
 * @param props - DataTable props including columns, data, and state
 */
export function DataTable<T extends Record<string, unknown>>({
	columns,
	data,
	sortBy,
	sortOrder,
	search,
}: DataTableProps<T>) {
	// Display empty state when no data
	if (data.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<p className="text-muted-foreground text-sm">
					{search ? "No results found for your search." : "No data available."}
				</p>
			</div>
		);
	}

	return (
		<div className="w-full">
			{/* Screen reader announcement for table updates */}
			<output className="sr-only" aria-live="polite" aria-atomic="true">
				{data.length > 0
					? `Showing ${data.length} ${data.length === 1 ? "result" : "results"}${search ? ` for "${search}"` : ""}`
					: search
						? `No results found for "${search}"`
						: "No data available"}
			</output>
			<div className="rounded-md border">
				<table className="w-full caption-bottom text-sm">
					<thead className="[&_tr]:border-b">
						<tr className="border-b transition-colors hover:bg-muted/50">
							{columns.map((column) => (
								<th
									key={column.key}
									className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
								>
									{column.label}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="[&_tr:last-child]:border-0">
						{data.map((row) => {
							// Generate a unique key from the row data
							// Prefer _id if available (Convex convention), otherwise use stringified row
							const rowKey =
								"_id" in row ? String(row._id) : JSON.stringify(row);

							return (
								<tr
									key={rowKey}
									className="border-b transition-colors hover:bg-muted/50"
								>
									{columns.map((column) => {
										const value = row[column.key];

										return (
											<td key={column.key} className="p-4 align-middle">
												{column.render
													? column.render(value, row)
													: String(value ?? "")}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
