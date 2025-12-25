"use client";

/**
 * TablePagination - Client Component
 *
 * Renders pagination controls for navigating through table pages.
 * Updates URL parameters when page changes.
 *
 * Requirements: 2.1, 2.2, 2.3
 */

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../components/ui/button";
import type { TablePaginationProps } from "../shared/types";

/**
 * Client-side pagination component with page navigation controls
 *
 * @param props - TablePagination props including page, pageSize, and totalCount
 */
export function TablePagination({
	page,
	pageSize,
	totalCount,
}: TablePaginationProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Calculate total pages
	const totalPages = Math.ceil(totalCount / pageSize);

	/**
	 * Navigate to a specific page
	 */
	const goToPage = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", String(newPage));
		router.push(`?${params.toString()}`, { scroll: false });
	};

	/**
	 * Navigate to previous page
	 */
	const goToPrevious = () => {
		if (page > 1) {
			goToPage(page - 1);
		}
	};

	/**
	 * Navigate to next page
	 */
	const goToNext = () => {
		if (page < totalPages) {
			goToPage(page + 1);
		}
	};

	// Determine disabled states
	const isPreviousDisabled = page <= 1;
	const isNextDisabled = page >= totalPages;

	return (
		<div className="flex items-center justify-between px-2 py-4">
			<output className="text-muted-foreground text-sm" aria-live="polite">
				Page {page} of {totalPages}
			</output>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={goToPrevious}
					disabled={isPreviousDisabled}
					aria-label="Go to previous page"
					className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={goToNext}
					disabled={isNextDisabled}
					aria-label="Go to next page"
					className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					Next
				</Button>
			</div>
		</div>
	);
}
