import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	const isProduction = command === "build";
	const isPreview = mode === "preview";

	// Sử dụng base URL khác nhau cho từng môi trường
	const base = isProduction || isPreview ? "/doantotnghiep-client/" : "/";

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
	};
});
