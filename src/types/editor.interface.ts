export interface LanguageValue {
	language: languagesType
	value: string
}

export type languagesType = "json" | "javascript" | "typescript" | "html" | "css" | "scss" | "sql" | "yaml" | "xml"

export type tabType = "code" | "graph" | "compare"
