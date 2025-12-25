import { defineConfig } from "tsdown";

export default defineConfig({
	entry: {
		index: "./src/index.ts",
		react: "./src/react.ts",
		next: "./src/next.ts",
		convex: "./src/convex/index.ts",
	},
	format: ["esm", "cjs"],
	dts: true,
	exports: true,
	clean: true,
	// Note: tsdown doesn't support conditional banners per entry
	// The "use client" directive is added in the source files
});
