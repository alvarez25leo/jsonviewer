/** @type {import("prettier").Config} */
export default {
	singleQuote: false,
	jsxSingleQuote: false,
	trailingComma: "es5",
	tabWidth: 4,
	printWidth: 150,
	semi: false,
	quoteProps: "consistent",
	useTabs: true,
	endOfLine: "lf",
	arrowParens: "always",
	plugins: ["prettier-plugin-tailwindcss"],
	overrides: [
		{
			files: ["*.json", "*.md", "*.toml", "*.yml"],
			options: {
				useTabs: false,
			},
		},
	],
}
