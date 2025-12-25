"use client";

import { Button } from "../components/ui/button";

export interface TablePaginationProps {
	/** Current page (1-indexed) */
	page: number;
	/** Items per page */
	pageSize: number;
	/** Total number of items */
	totalCount: number;
	/** Callback when page changes */
	onPageChange: (page: number) => void;
	/** Callback when page size changes */
	onPageSizeChange?: (pageSize: number) => void;
}

export function TablePagination({
	page,
	pageSize,
	totalCount,
	onPageChange,
	// onPageSizeChange is optional and reserved for future use
	onPageSizeChange: _onPageSizeChange,
}: TablePaginationProps) {
	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
	const canGoPrevious = page > 1;
	const canGoNext = page < totalPages;

	const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
	const endItem = Math.min(page * pageSize, totalCount);

	return (
		<div className="flex items-center justify-between px-2 py-4">
			<div className="text-sm text-muted-foreground">
				Showing {startItem} to {endItem} of {totalCount} results
			</div>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(page - 1)}
					disabled={!canGoPrevious}
					aria-label="Go to previous page"
				>
					Previous
				</Button>
				<div className="text-sm">
					Page {page} of {totalPages}
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(page + 1)}
					disabled={!canGoNext}
					aria-label="Go to next page"
				>
					Next
				</Button>
			</div>
		</div>
	);
}
