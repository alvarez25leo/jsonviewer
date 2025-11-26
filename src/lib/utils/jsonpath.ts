import { JSONPath } from "jsonpath-plus"

export interface JSONPathResult {
	path: string
	value: unknown
	pointer: string
	parentProperty: string | number
}

/**
 * Ejecuta una query JSONPath y retorna los resultados
 */
export function queryJSONPath(json: object | unknown[], path: string): JSONPathResult[] {
	try {
		const results = JSONPath({
			path,
			json: json as object,
			resultType: "all",
		}) as unknown[]

		return results.map((result: unknown) => {
			const r = result as Record<string, unknown>
			return {
				path: r.path as string,
				value: r.value,
				pointer: r.pointer as string,
				parentProperty: r.parentProperty as string | number,
			}
		})
	} catch (error) {
		console.error("JSONPath error:", error)
		return []
	}
}

/**
 * Ejecuta una query JSONPath y retorna solo los valores
 */
export function queryJsonPath(json: object | unknown[], path: string): unknown[] {
	try {
		return JSONPath({
			path,
			json: json as object,
		}) as unknown[]
	} catch (error) {
		console.error("JSONPath error:", error)
		return []
	}
}

/**
 * Parsea JSONPath y retorna paths y valores
 */
export function parseJsonPath(json: object | unknown[], path: string): { paths: string[]; values: unknown[] } {
	try {
		const results = JSONPath({
			path,
			json: json as object,
			resultType: "all",
		}) as unknown[]

		const paths = results.map((r) => (r as Record<string, unknown>).path as string)
		const values = results.map((r) => (r as Record<string, unknown>).value)

		return { paths, values }
	} catch (error) {
		console.error("JSONPath error:", error)
		return { paths: [], values: [] }
	}
}

/**
 * Valida si una query JSONPath es válida
 */
export function validateJSONPath(path: string): boolean {
	try {
		// Test con un objeto vacío
		JSONPath({ path, json: {} })
		return true
	} catch {
		return false
	}
}

/**
 * Ejemplos de JSONPath para ayuda
 */
export const JSONPathExamples = [
	{ query: "$.store.book[*].author", description: "Todos los autores de libros" },
	{ query: "$..author", description: "Todos los autores (recursivo)" },
	{ query: "$.store.*", description: "Todos los elementos de store" },
	{ query: "$.store..price", description: "Todos los precios en store" },
	{ query: "$..book[2]", description: "Tercer libro" },
	{ query: "$..book[-1]", description: "Último libro" },
	{ query: "$..book[0,1]", description: "Primeros dos libros" },
	{ query: "$..book[:2]", description: "Libros del 0 al 2" },
	{ query: "$..book[?(@.isbn)]", description: "Libros con ISBN" },
	{ query: "$..book[?(@.price<10)]", description: "Libros con precio < 10" },
	{ query: "$..book[?(@.price>10)]", description: "Libros con precio > 10" },
	{ query: "$..*", description: "Todos los elementos (recursivo)" },
]
