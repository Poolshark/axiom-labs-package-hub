"use client";

/**
 * TablePagination - Client Component
 *
 * Renders pagination controls for Convex cursor-based pagination.
 * Updates URL parameters when page changes.
 *
 * Requirements: 2.1, 2.2, 2.3
 */

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../components/ui/button";
import type { TablePaginationProps } from "../shared/types";

/**
 * Client-side pagination component for Convex cursor-based pagination
 *
 * @param props - TablePagination props
 */
export function TablePagination(props: TablePaginationProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const { hasMore, currentPage, maxPageReached } = props;
	const isFirstPage = currentPage === 1;

	const goToPage = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", String(newPage));
		router.push(`?${params.toString()}`, { scroll: false });
	};

	const goToFirst = () => {
		goToPage(1);
	};

	const goToPrevious = () => {
		if (currentPage > 1) {
			goToPage(currentPage - 1);
		}
	};

	const goToNext = () => {
		// Only allow going to next page if:
		// 1. We have more data (hasMore), OR
		// 2. We haven't reached the max page yet (can navigate to already-visited pages)
		if (hasMore || currentPage < maxPageReached) {
			goToPage(currentPage + 1);
		}
	};

	const canGoNext = hasMore || currentPage < maxPageReached;

	return (
		<div className="flex items-center justify-between px-2 py-4">
			<output className="text-muted-foreground text-sm" aria-live="polite">
				Page {currentPage} of {maxPageReached}
				{hasMore ? "+" : ""}
			</output>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={goToFirst}
					disabled={isFirstPage}
					aria-label="Go to first page"
					className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					First
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={goToPrevious}
					disabled={isFirstPage}
					aria-label="Go to previous page"
					className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={goToNext}
					disabled={!canGoNext}
					aria-label="Go to next page"
					className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					Next
				</Button>
			</div>
		</div>
	);
}
