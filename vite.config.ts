import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	const isProduction = command === "build";
	const isPreview = mode === "preview";

	// Vercel không cần base path, sử dụng "/" cho tất cả môi trường
	const base = "/";

	return {
		base,
		plugins: [react()],
		server: {
			cors: true,
			port: 3000,
		},
		preview: {
			port: 3000,
			cors: true,
		},
		resolve: {
			alias: [
				{
					find: "@",
					replacement: path.resolve(__dirname, "src"),
				},
			],
		},
		build: {
			outDir: "dist",
			assetsDir: "assets",
		},
	};
});
