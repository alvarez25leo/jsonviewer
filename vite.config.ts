import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { resolve } from "path"
import wasm from "vite-plugin-wasm"

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		target: "esnext",
	},
	esbuild: {
		drop: process.env.NODE_ENV !== "development" ? ["console", "debugger"] : [],
	},
	optimizeDeps: {
		esbuildOptions: {
			define: {
				global: "globalThis",
			},
		},
	},
	resolve: {
		alias: {
			"~": resolve(__dirname, "node_modules"),
			"@": resolve(__dirname, "src"),
		},
	},
	plugins: [react(), wasm()],
})
