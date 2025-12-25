import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query("users").collect();
	},
});

export const list = query({
	args: {
		paginationOpts: v.object({
			numItems: v.number(),
			cursor: v.union(v.string(), v.null()),
		}),
		search: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { search, paginationOpts } = args;

		// If search query provided, use search index
		if (search) {
			return await ctx.db
				.query("users")
				.withSearchIndex("search_all", (q) => q.search("search", search.trim()))
				.paginate(paginationOpts);
		}

		// Otherwise, return all users with pagination
		return await ctx.db.query("users").order("desc").paginate(paginationOpts);
	},
});
