import Ajv, { ErrorObject } from "ajv"

const ajv = new Ajv({ allErrors: true, verbose: true })

export interface ValidationResult {
	valid: boolean
	errors: ValidationError[]
}

export interface ValidationError {
	path: string
	message: string
	keyword: string
	params?: Record<string, unknown>
}

/**
 * Valida un JSON contra un JSON Schema
 */
export function validateJsonSchema(json: unknown, schema: object): ValidationResult {
	try {
		const validate = ajv.compile(schema)
		const valid = validate(json)

		if (valid) {
			return { valid: true, errors: [] }
		}

		const errors: ValidationError[] = (validate.errors || []).map((error: ErrorObject) => ({
			path: error.instancePath || "/",
			message: error.message || "Unknown error",
			keyword: error.keyword,
			params: error.params as Record<string, unknown>,
		}))

		return { valid: false, errors }
	} catch (error) {
		return {
			valid: false,
			errors: [
				{
					path: "/",
					message: `Schema validation error: ${error}`,
					keyword: "error",
					params: {},
				},
			],
		}
	}
}

/**
 * Genera un JSON Schema básico desde un JSON
 */
export function generateJsonSchema(json: unknown, title = "Generated Schema"): object {
	const inferType = (value: unknown): object => {
		if (value === null) {
			return { type: "null" }
		}

		if (Array.isArray(value)) {
			if (value.length === 0) {
				return { type: "array", items: {} }
			}
			// Usar el primer item como referencia
			return {
				type: "array",
				items: inferType(value[0]),
			}
		}

		if (typeof value === "object") {
			const properties: Record<string, object> = {}
			const required: string[] = []

			for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
				properties[key] = inferType(val)
				if (val !== null && val !== undefined) {
					required.push(key)
				}
			}

			return {
				type: "object",
				properties,
				required: required.length > 0 ? required : undefined,
			}
		}

		if (typeof value === "string") {
			const schema: Record<string, unknown> = { type: "string" }

			// Detectar formatos
			if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
				schema.format = "email"
			} else if (/^https?:\/\//.test(value)) {
				schema.format = "uri"
			} else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
				schema.format = "date-time"
			} else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
				schema.format = "date"
			} else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
				schema.format = "uuid"
			}

			return schema
		}

		if (typeof value === "number") {
			return Number.isInteger(value) ? { type: "integer" } : { type: "number" }
		}

		if (typeof value === "boolean") {
			return { type: "boolean" }
		}

		return {}
	}

	return {
		$schema: "http://json-schema.org/draft-07/schema#",
		title,
		...inferType(json),
	}
}

/**
 * Alias for generateJsonSchema
 */
export function generateSchemaFromJson(json: unknown, title = "Generated Schema"): object {
	return generateJsonSchema(json, title)
}

/**
 * Esquemas predefinidos comunes
 */
export const commonSchemas = {
	user: {
		$schema: "http://json-schema.org/draft-07/schema#",
		title: "User",
		type: "object",
		required: ["id", "email"],
		properties: {
			id: { type: "string", format: "uuid" },
			email: { type: "string", format: "email" },
			name: { type: "string", minLength: 1 },
			age: { type: "integer", minimum: 0, maximum: 150 },
			isActive: { type: "boolean" },
			createdAt: { type: "string", format: "date-time" },
		},
	},
	product: {
		$schema: "http://json-schema.org/draft-07/schema#",
		title: "Product",
		type: "object",
		required: ["id", "name", "price"],
		properties: {
			id: { type: "string" },
			name: { type: "string", minLength: 1 },
			description: { type: "string" },
			price: { type: "number", minimum: 0 },
			currency: { type: "string", enum: ["USD", "EUR", "GBP"] },
			inStock: { type: "boolean" },
			tags: { type: "array", items: { type: "string" } },
		},
	},
	apiResponse: {
		$schema: "http://json-schema.org/draft-07/schema#",
		title: "API Response",
		type: "object",
		required: ["success"],
		properties: {
			success: { type: "boolean" },
			data: {},
			error: {
				type: "object",
				properties: {
					code: { type: "string" },
					message: { type: "string" },
				},
			},
			meta: {
				type: "object",
				properties: {
					page: { type: "integer" },
					total: { type: "integer" },
					limit: { type: "integer" },
				},
			},
		},
	},
}
