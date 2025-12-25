"use client";

/**
 * TablePagination - Client Component
 *
 * Renders pagination controls for navigating through table pages.
 * Supports both page-based and cursor-based pagination (Convex).
 * Updates URL parameters when page changes.
 *
 * Requirements: 2.1, 2.2, 2.3
 */

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../components/ui/button";
import type { TablePaginationProps } from "../shared/types";

/**
 * Client-side pagination component with support for both pagination modes
 *
 * @param props - TablePagination props (either page-based or cursor-based)
 */
export function TablePagination(props: TablePaginationProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Render page-based pagination
	if (props.mode === "page") {
		const { page, pageSize, totalCount } = props;
		const totalPages = Math.ceil(totalCount / pageSize);

		const goToPage = (newPage: number) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set("page", String(newPage));
			// Remove cursor if it exists (switching from cursor to page mode)
			params.delete("cursor");
			router.push(`?${params.toString()}`, { scroll: false });
		};

		const goToPrevious = () => {
			if (page > 1) {
				goToPage(page - 1);
			}
		};

		const goToNext = () => {
			if (page < totalPages) {
				goToPage(page + 1);
			}
		};

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

	// Render cursor-based pagination (Convex)
	const { hasMore, nextCursor, currentCursor } = props;
	const isFirstPage = !currentCursor;

	const goToFirst = () => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("cursor");
		// Remove page if it exists (switching from page to cursor mode)
		params.delete("page");
		router.push(`?${params.toString()}`, { scroll: false });
	};

	const goToNext = () => {
		if (hasMore && nextCursor) {
			const params = new URLSearchParams(searchParams.toString());
			params.set("cursor", nextCursor);
			// Remove page if it exists (switching from page to cursor mode)
			params.delete("page");
			router.push(`?${params.toString()}`, { scroll: false });
		}
	};

	return (
		<div className="flex items-center justify-between px-2 py-4">
			<output className="text-muted-foreground text-sm" aria-live="polite">
				{isFirstPage ? "First page" : "Viewing results"}
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
					onClick={goToNext}
					disabled={!hasMore}
					aria-label="Go to next page"
					className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					Next
				</Button>
			</div>
		</div>
	);
}
