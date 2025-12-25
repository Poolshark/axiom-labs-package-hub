/**
 * Convex utilities for pagination
 * Use these helpers in your Convex backend queries
 */

export interface PaginationOptions {
	numItems: number;
	cursor: string | null;
}

export interface PaginationResult<T> {
	page: T[];
	isDone: boolean;
	continueCursor: string | null;
}

/**
 * Manually paginate an array of results using offset-based pagination.
 * This is useful when you need to paginate results from `.collect()` or search queries.
 *
 * @param allResults - The complete array of results to paginate
 * @param paginationOpts - Pagination options with numItems and cursor (offset as string)
 * @returns PaginationResult with page, isDone, and continueCursor
 *
 * @example
 * ```typescript
 * import { paginateResults } from "@axiom-labs/convex-table/convex";
 *
 * export const list = query({
 *   args: {
 *     paginationOpts: v.object({
 *       numItems: v.number(),
 *       cursor: v.union(v.string(), v.null()),
 *     }),
 *   },
 *   handler: async (ctx, args) => {
 *     const allResults = await ctx.db.query("users").collect();
 *     return paginateResults(allResults, args.paginationOpts);
 *   },
 * });
 * ```
 */
export function paginateResults<T>(
	allResults: T[],
	paginationOpts: PaginationOptions,
): PaginationResult<T> {
	const offset = paginationOpts.cursor
		? Number.parseInt(paginationOpts.cursor, 10)
		: 0;

	const page = allResults.slice(offset, offset + paginationOpts.numItems);
	const isDone = offset + paginationOpts.numItems >= allResults.length;
	const continueCursor = isDone
		? null
		: (offset + paginationOpts.numItems).toString();

	return { page, isDone, continueCursor };
}

/**
 * Calculate the offset for page-based pagination.
 * Use this in your Next.js page to convert page number to cursor offset.
 *
 * @param page - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Offset as a string to use as cursor
 *
 * @example
 * ```typescript
 * import { getPageOffset } from "@axiom-labs/convex-table/convex";
 *
 * const page = Number(params.page) || 1;
 * const pageSize = 10;
 *
 * const users = await fetchQuery(api.users.list, {
 *   paginationOpts: {
 *     numItems: pageSize,
 *     cursor: getPageOffset(page, pageSize),
 *   },
 * });
 * ```
 */
export function getPageOffset(page: number, pageSize: number): string {
	return ((page - 1) * pageSize).toString();
}
