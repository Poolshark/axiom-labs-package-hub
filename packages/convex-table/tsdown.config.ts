import { defineConfig } from "tsdown";

export default defineConfig({
	entry: {
		index: "./src/index.ts",
		react: "./src/react.ts",
		next: "./src/next.ts",
	},
	format: ["esm", "cjs"],
	dts: true,
	exports: true,
	clean: true,
});
