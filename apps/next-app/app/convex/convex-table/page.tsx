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
		cursor?: string;
		pageSize?: string;
		search?: string;
	}>;
}) {
	const params = await searchParams;
	const pageSize = Number(params.pageSize) || 10;
	const search = params.search || "";
	const cursor = params.cursor || null;

	const users = await fetchQuery(api.users.list, {
		paginationOpts: {
			numItems: pageSize,
			cursor: cursor,
		},
		search: search || undefined,
	});

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
				mode="cursor"
				hasMore={!users.isDone}
				nextCursor={users.continueCursor}
				currentCursor={cursor}
			/>
		</div>
	);
}
