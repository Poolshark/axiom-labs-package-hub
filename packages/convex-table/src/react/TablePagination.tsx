"use client";

import { Button } from "../components/ui/button";

export interface TablePaginationProps {
	/** Whether there are more results available */
	hasMore: boolean;
	/** The cursor for the next page (from Convex continueCursor) */
	nextCursor: string | null;
	/** Current cursor (null for first page) */
	currentCursor?: string | null;
	/** Current page number (1-indexed) */
	currentPage: number;
	/** Highest page number reached so far */
	maxPageReached: number;
	/** Callback when navigating to first page */
	onFirstPage: () => void;
	/** Callback when navigating to previous page */
	onPreviousPage: () => void;
	/** Callback when navigating to next page */
	onNextPage: () => void;
}

export function TablePagination({
	hasMore,
	nextCursor: _nextCursor,
	currentPage,
	maxPageReached,
	onFirstPage,
	onPreviousPage,
	onNextPage,
}: TablePaginationProps) {
	const canGoPrevious = currentPage > 1;
	const canGoNext = hasMore || currentPage < maxPageReached;
	const canGoFirst = currentPage > 1;

	return (
		<div className="flex items-center justify-between px-2 py-4">
			<div className="text-sm text-muted-foreground">
				Page {currentPage} of {maxPageReached}
				{hasMore && "+"}
			</div>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={onFirstPage}
					disabled={!canGoFirst}
					aria-label="Go to first page"
				>
					First
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={onPreviousPage}
					disabled={!canGoPrevious}
					aria-label="Go to previous page"
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={onNextPage}
					disabled={!canGoNext}
					aria-label="Go to next page"
				>
					Next
				</Button>
			</div>
		</div>
	);
}
