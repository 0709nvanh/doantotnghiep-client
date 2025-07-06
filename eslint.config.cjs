import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		extends: ["js/recommended"],
	},
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
	},
	tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
]);
