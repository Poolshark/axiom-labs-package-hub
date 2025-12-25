"use client";

/**
 * SearchInput - Client Component
 *
 * Renders a search input with debouncing for filtering table data.
 * Updates URL parameters when search query changes.
 * Resets page to 1 when search changes.
 *
 * Requirements: 4.1, 4.2, 4.3
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import type { SearchInputProps } from "../shared/types";

/**
 * Client-side search input component with debouncing
 *
 * Features:
 * - Debounces input changes by 500ms to reduce query frequency
 * - Updates URL parameters on search change
 * - Resets page to 1 when search query changes
 * - Provides clear button to reset search
 *
 * @param props - SearchInput props including initial value
 */
export function SearchInput({ initialValue = "" }: SearchInputProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchValue, setSearchValue] = useState(initialValue);

	/**
	 * Debounced effect to update URL parameters
	 * Waits 500ms after user stops typing before updating URL
	 */
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			const params = new URLSearchParams(searchParams.toString());

			if (searchValue) {
				// Set search parameter
				params.set("search", searchValue);
				// Reset to page 1 when search changes (Requirement 4.2)
				params.set("page", "1");
			} else {
				// Clear search parameter when empty
				params.delete("search");
			}

			router.push(`?${params.toString()}`);
		}, 500);

		// Cleanup timeout on unmount or when dependencies change
		return () => clearTimeout(timeoutId);
	}, [searchValue, router, searchParams]);

	/**
	 * Handle input change
	 */
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.currentTarget.value);
	};

	/**
	 * Clear search input and reset to empty state
	 */
	const handleClear = () => {
		setSearchValue("");
	};

	return (
		<div className="flex items-center gap-2">
			<Input
				type="text"
				placeholder="Search..."
				value={searchValue}
				onChange={handleChange}
				className="max-w-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				aria-label="Search table"
			/>
			{searchValue && (
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={handleClear}
					aria-label="Clear search"
					className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					Clear
				</Button>
			)}
		</div>
	);
}
