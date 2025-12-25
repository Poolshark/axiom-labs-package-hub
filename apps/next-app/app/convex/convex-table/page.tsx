import { type ColumnDef, DataTable } from "@axiom-labs/convex-table";
import { SearchInput, TablePagination } from "@axiom-labs/convex-table/next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

interface User extends Record<string, unknown> {
	_id: string;
	name: string;
	email: string;
	role: string;
}

export default async function ConvexTable({
	searchParams,
}: {
	searchParams: Promise<{
		page?: string;
		cursors?: string;
		pageSize?: string;
		search?: string;
	}>;
}) {
	const params = await searchParams;
	const pageSize = Number(params.pageSize) || 10;
	const search = params.search || "";
	const requestedPage = Number(params.page) || 1;

	// Parse cursor history from URL (comma-separated, "null" represents null cursor)
	const cursorsParam = params.cursors || "null";
	const cursorHistory = cursorsParam
		.split(",")
		.map((c) => (c === "null" ? null : c));

	// Clamp the current page to valid bounds (1 to cursorHistory.length)
	// This prevents navigating to pages that don't exist
	const currentPage = Math.max(
		1,
		Math.min(requestedPage, cursorHistory.length),
	);

	// Get cursor for current page (pages are 1-indexed, array is 0-indexed)
	const cursor = cursorHistory[currentPage - 1] || null;

	// Fetch data from Convex using the cursor for current page
	const users = await fetchQuery(api.users.list, {
		paginationOpts: {
			numItems: pageSize,
			cursor: cursor,
		},
		search: search || undefined,
	});

	// Build updated cursor history for URL
	// Only add new cursor if we're navigating forward AND there's actually a next page
	const updatedCursorHistory = [...cursorHistory];

	// If we have a next cursor and we're on the last known page, add it to history
	if (
		users.continueCursor &&
		currentPage === cursorHistory.length &&
		!users.isDone
	) {
		updatedCursorHistory.push(users.continueCursor);
	}

	// The max page is the length of cursor history (not including pages beyond available data)
	const maxPageReached = updatedCursorHistory.length;

	const columns: ColumnDef<User>[] = [
		{ key: "name", label: "Name", sortable: true, searchable: true },
		{ key: "email", label: "Email", sortable: true, searchable: true },
		{ key: "role", label: "Role", sortable: true },
	];

	return (
		<div className="flex flex-col gap-2 p-8">
			<SearchInput placeholder="Search users..." />

			<DataTable<User> columns={columns} data={users.page} search={search} />

			<TablePagination
				hasMore={!users.isDone}
				nextCursor={users.continueCursor}
				currentCursor={cursor}
				currentPage={currentPage}
				maxPageReached={maxPageReached}
			/>

			{/* Hidden form to update cursor history in URL */}
			<form action="" method="get" style={{ display: "none" }}>
				<input
					type="hidden"
					name="cursors"
					value={updatedCursorHistory.map((c) => c || "null").join(",")}
				/>
			</form>

			<script
				// biome-ignore lint/security/noDangerouslySetInnerHtml: Safe static script for URL update
				dangerouslySetInnerHTML={{
					__html: `
            (function() {
              const url = new URL(window.location.href);
              const cursors = "${updatedCursorHistory.map((c) => c || "null").join(",")}";
              if (url.searchParams.get('cursors') !== cursors) {
                url.searchParams.set('cursors', cursors);
                window.history.replaceState({}, '', url.toString());
              }
            })();
          `,
				}}
			/>
		</div>
	);
}
