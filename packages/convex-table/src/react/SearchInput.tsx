"use client";

import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export interface SearchInputProps {
	/** Current search value */
	value: string;
	/** Callback when search value changes (debounced) */
	onChange: (value: string) => void;
	/** Debounce delay in milliseconds (default: 500) */
	debounceMs?: number;
	/** Placeholder text */
	placeholder?: string;
}

export function SearchInput({
	value,
	onChange,
	debounceMs = 500,
	placeholder = "Search...",
}: SearchInputProps) {
	const [localValue, setLocalValue] = useState(value);

	// Sync local value with prop value
	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	// Debounced onChange
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (localValue !== value) {
				onChange(localValue);
			}
		}, debounceMs);

		return () => clearTimeout(timeoutId);
	}, [localValue, value, onChange, debounceMs]);

	const handleClear = () => {
		setLocalValue("");
		onChange("");
	};

	return (
		<div className="flex items-center gap-2">
			<Input
				type="text"
				placeholder={placeholder}
				value={localValue}
				onChange={(e) => setLocalValue(e.target.value)}
				className="max-w-sm"
				aria-label="Search table"
			/>
			{localValue && (
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={handleClear}
					aria-label="Clear search"
				>
					Clear
				</Button>
			)}
		</div>
	);
}
