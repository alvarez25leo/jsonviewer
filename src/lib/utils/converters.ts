import * as yaml from "js-yaml"

/**
 * Convierte JSON a YAML
 */
export function jsonToYaml(json: unknown): string {
	try {
		return yaml.dump(json, {
			indent: 2,
			lineWidth: -1,
			noRefs: true,
			sortKeys: false,
		})
	} catch (error) {
		throw new Error(`Error converting to YAML: ${error}`)
	}
}

/**
 * Convierte YAML a JSON
 */
export function yamlToJson(yamlString: string): unknown {
	try {
		return yaml.load(yamlString)
	} catch (error) {
		throw new Error(`Error parsing YAML: ${error}`)
	}
}

/**
 * Convierte JSON a XML
 */
export function jsonToXml(json: unknown, rootName = "root"): string {
	const convert = (obj: unknown, indent = ""): string => {
		if (obj === null || obj === undefined) {
			return `${indent}<null/>`
		}

		if (typeof obj !== "object") {
			return String(obj)
		}

		if (Array.isArray(obj)) {
			return obj.map((item, i) => `${indent}<item index="${i}">\n${convert(item, indent + "  ")}\n${indent}</item>`).join("\n")
		}

		const entries = Object.entries(obj as Record<string, unknown>)
		return entries
			.map(([key, value]) => {
				const safeName = key.replace(/[^a-zA-Z0-9_-]/g, "_")
				if (typeof value === "object" && value !== null) {
					return `${indent}<${safeName}>\n${convert(value, indent + "  ")}\n${indent}</${safeName}>`
				}
				return `${indent}<${safeName}>${escapeXml(String(value ?? ""))}</${safeName}>`
			})
			.join("\n")
	}

	const escapeXml = (str: string): string => {
		return str
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&apos;")
	}

	return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n${convert(json, "  ")}\n</${rootName}>`
}

/**
 * Convierte JSON a CSV (solo para arrays de objetos)
 */
export function jsonToCsv(json: unknown): string {
	if (!Array.isArray(json)) {
		throw new Error("JSON must be an array to convert to CSV")
	}

	if (json.length === 0) {
		return ""
	}

	// Obtener todas las keys únicas
	const allKeys = new Set<string>()
	json.forEach((item) => {
		if (typeof item === "object" && item !== null) {
			Object.keys(item).forEach((key) => allKeys.add(key))
		}
	})

	const headers = Array.from(allKeys)
	const escapeCsvValue = (value: unknown): string => {
		if (value === null || value === undefined) return ""
		const str = typeof value === "object" ? JSON.stringify(value) : String(value)
		if (str.includes(",") || str.includes('"') || str.includes("\n")) {
			return `"${str.replace(/"/g, '""')}"`
		}
		return str
	}

	const headerRow = headers.map(escapeCsvValue).join(",")
	const dataRows = json.map((item) => {
		const row = headers.map((header) => {
			const value = typeof item === "object" && item !== null ? (item as Record<string, unknown>)[header] : ""
			return escapeCsvValue(value)
		})
		return row.join(",")
	})

	return [headerRow, ...dataRows].join("\n")
}

/**
 * Convierte JSON a SQL CREATE TABLE
 */
export function jsonToSql(json: unknown, tableName = "my_table"): string {
	const inferSqlType = (value: unknown): string => {
		if (value === null || value === undefined) return "TEXT"
		if (typeof value === "number") {
			return Number.isInteger(value) ? "INTEGER" : "DECIMAL(10,2)"
		}
		if (typeof value === "boolean") return "BOOLEAN"
		if (typeof value === "string") {
			// Detectar fechas
			if (/^\d{4}-\d{2}-\d{2}/.test(value)) return "DATETIME"
			if (value.length > 255) return "TEXT"
			return "VARCHAR(255)"
		}
		if (Array.isArray(value)) return "JSON"
		if (typeof value === "object") return "JSON"
		return "TEXT"
	}

	let sampleObj: Record<string, unknown> = {}

	if (Array.isArray(json) && json.length > 0) {
		// Unir todos los campos de todos los objetos
		json.forEach((item) => {
			if (typeof item === "object" && item !== null) {
				sampleObj = { ...sampleObj, ...item }
			}
		})
	} else if (typeof json === "object" && json !== null) {
		sampleObj = json as Record<string, unknown>
	}

	const columns = Object.entries(sampleObj).map(([key, value]) => {
		const safeName = key.replace(/[^a-zA-Z0-9_]/g, "_")
		const sqlType = inferSqlType(value)
		return `  ${safeName} ${sqlType}`
	})

	return `CREATE TABLE ${tableName} (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n${columns.join(",\n")}\n);`
}

/**
 * Genera schema Zod desde JSON
 */
export function jsonToZodSchema(json: unknown, name = "Schema"): string {
	const generateZodType = (value: unknown, indent = ""): string => {
		if (value === null) return "z.null()"
		if (value === undefined) return "z.undefined()"

		if (typeof value === "string") return "z.string()"
		if (typeof value === "number") {
			return Number.isInteger(value) ? "z.number().int()" : "z.number()"
		}
		if (typeof value === "boolean") return "z.boolean()"

		if (Array.isArray(value)) {
			if (value.length === 0) return "z.array(z.unknown())"
			const itemType = generateZodType(value[0], indent)
			return `z.array(${itemType})`
		}

		if (typeof value === "object") {
			const entries = Object.entries(value as Record<string, unknown>)
			if (entries.length === 0) return "z.object({})"

			const props = entries
				.map(([key, val]) => {
					const safeName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`
					return `${indent}  ${safeName}: ${generateZodType(val, indent + "  ")}`
				})
				.join(",\n")

			return `z.object({\n${props}\n${indent}})`
		}

		return "z.unknown()"
	}

	const schemaBody = generateZodType(json)
	return `import { z } from "zod";\n\nexport const ${name} = ${schemaBody};\n\nexport type ${name}Type = z.infer<typeof ${name}>;`
}
