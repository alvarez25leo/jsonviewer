/**
 * Aplana un objeto JSON anidado a un objeto plano con keys en notación punto
 */
export function flattenJson(obj: unknown, delimiter = "."): Record<string, unknown> {
	const result: Record<string, unknown> = {}

	const flatten = (current: unknown, path: string) => {
		if (current === null || current === undefined) {
			result[path] = current
			return
		}

		if (typeof current !== "object") {
			result[path] = current
			return
		}

		if (Array.isArray(current)) {
			if (current.length === 0) {
				result[path] = []
			} else {
				current.forEach((item, index) => {
					flatten(item, path ? `${path}[${index}]` : `[${index}]`)
				})
			}
			return
		}

		const entries = Object.entries(current as Record<string, unknown>)
		if (entries.length === 0) {
			result[path] = {}
		} else {
			entries.forEach(([key, value]) => {
				flatten(value, path ? `${path}${delimiter}${key}` : key)
			})
		}
	}

	flatten(obj, "")
	return result
}

/**
 * Desaplana un objeto plano con keys en notación punto a un objeto anidado
 */
export function unflattenJson(obj: Record<string, unknown>, delimiter = "."): unknown {
	const result: Record<string, unknown> = {}

	for (const [key, value] of Object.entries(obj)) {
		const escapedDelimiter = delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
		const keys = key.split(new RegExp(`${escapedDelimiter}|\\[|\\]`)).filter(Boolean)
		let current: Record<string, unknown> = result

		for (let i = 0; i < keys.length - 1; i++) {
			const k = keys[i]
			const nextKey = keys[i + 1]
			const isNextArray = /^\d+$/.test(nextKey)

			if (!(k in current)) {
				current[k] = isNextArray ? [] : {}
			}

			current = current[k] as Record<string, unknown>
		}

		const lastKey = keys[keys.length - 1]
		current[lastKey] = value
	}

	return result
}

/**
 * Ordena las keys de un objeto JSON alfabéticamente (recursivo)
 */
export function sortJsonKeys(obj: unknown, ascending = true): unknown {
	if (obj === null || obj === undefined) return obj
	if (typeof obj !== "object") return obj

	if (Array.isArray(obj)) {
		return obj.map((item) => sortJsonKeys(item, ascending))
	}

	const entries = Object.entries(obj as Record<string, unknown>)
	const sorted = entries.sort(([a], [b]) => {
		return ascending ? a.localeCompare(b) : b.localeCompare(a)
	})

	const result: Record<string, unknown> = {}
	for (const [key, value] of sorted) {
		result[key] = sortJsonKeys(value, ascending)
	}

	return result
}

/**
 * Filtra keys de un objeto JSON por patrón regex
 */
export function filterJsonKeys(obj: unknown, pattern: string, include = true): unknown {
	const regex = new RegExp(pattern, "i")

	const filter = (current: unknown): unknown => {
		if (current === null || current === undefined) return current
		if (typeof current !== "object") return current

		if (Array.isArray(current)) {
			return current.map(filter)
		}

		const result: Record<string, unknown> = {}
		for (const [key, value] of Object.entries(current as Record<string, unknown>)) {
			const matches = regex.test(key)
			if (include ? matches : !matches) {
				result[key] = filter(value)
			} else if (typeof value === "object" && value !== null) {
				// Seguir buscando en objetos anidados
				const filtered = filter(value)
				if (filtered !== null && typeof filtered === "object" && Object.keys(filtered as object).length > 0) {
					result[key] = filtered
				}
			}
		}

		return result
	}

	return filter(obj)
}

/**
 * Elimina keys específicas de un objeto JSON (recursivo)
 */
export function removeJsonKeys(obj: unknown, keysToRemove: string[]): unknown {
	const keysSet = new Set(keysToRemove)

	const remove = (current: unknown): unknown => {
		if (current === null || current === undefined) return current
		if (typeof current !== "object") return current

		if (Array.isArray(current)) {
			return current.map(remove)
		}

		const result: Record<string, unknown> = {}
		for (const [key, value] of Object.entries(current as Record<string, unknown>)) {
			if (!keysSet.has(key)) {
				result[key] = remove(value)
			}
		}

		return result
	}

	return remove(obj)
}

/**
 * Renombra keys en un objeto JSON (recursivo)
 */
export function renameJsonKeys(obj: unknown, keyMap: Record<string, string>): unknown {
	const rename = (current: unknown): unknown => {
		if (current === null || current === undefined) return current
		if (typeof current !== "object") return current

		if (Array.isArray(current)) {
			return current.map(rename)
		}

		const result: Record<string, unknown> = {}
		for (const [key, value] of Object.entries(current as Record<string, unknown>)) {
			const newKey = keyMap[key] || key
			result[newKey] = rename(value)
		}

		return result
	}

	return rename(obj)
}

/**
 * Combina múltiples objetos JSON en uno
 */
export function mergeJsonObjects(...objects: unknown[]): unknown {
	const merge = (target: unknown, source: unknown): unknown => {
		if (source === null || source === undefined) return target
		if (target === null || target === undefined) return source

		if (typeof target !== "object" || typeof source !== "object") {
			return source
		}

		if (Array.isArray(target) && Array.isArray(source)) {
			return [...target, ...source]
		}

		if (Array.isArray(target) || Array.isArray(source)) {
			return source
		}

		const result: Record<string, unknown> = { ...(target as Record<string, unknown>) }
		for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
			result[key] = merge(result[key], value)
		}

		return result
	}

	return objects.reduce((acc, obj) => merge(acc, obj), {})
}

/**
 * Alias para mergeJsonObjects con dos argumentos
 */
export function mergeJson(target: unknown, source: unknown): unknown {
	return mergeJsonObjects(target, source)
}

/**
 * Filtra un objeto JSON usando JSONPath (simplified)
 */
export function filterJson(json: unknown, path: string): unknown[] {
	// Simple implementation - for complex queries use jsonpath-plus
	try {
		// Handle basic paths like $.property or $..property
		if (path === "$..*" || path === "$.*") {
			const results: unknown[] = []
			const collect = (obj: unknown) => {
				if (obj === null || typeof obj !== "object") {
					results.push(obj)
					return
				}
				if (Array.isArray(obj)) {
					obj.forEach(collect)
				} else {
					Object.values(obj as Record<string, unknown>).forEach(collect)
				}
			}
			collect(json)
			return results
		}

		// For other paths, return the json as-is wrapped in array
		return [json]
	} catch {
		return []
	}
}

/**
 * Obtiene estadísticas del JSON
 */
export function getJsonStats(json: unknown): {
	totalKeys: number
	maxDepth: number
	arrayCount: number
	objectCount: number
	stringCount: number
	numberCount: number
	booleanCount: number
	nullCount: number
} {
	let totalKeys = 0
	let maxDepth = 0
	let arrayCount = 0
	let objectCount = 0
	let stringCount = 0
	let numberCount = 0
	let booleanCount = 0
	let nullCount = 0

	const analyze = (current: unknown, depth: number) => {
		maxDepth = Math.max(maxDepth, depth)

		if (current === null) {
			nullCount++
			return
		}

		if (current === undefined) return

		if (typeof current === "string") {
			stringCount++
			return
		}

		if (typeof current === "number") {
			numberCount++
			return
		}

		if (typeof current === "boolean") {
			booleanCount++
			return
		}

		if (Array.isArray(current)) {
			arrayCount++
			current.forEach((item) => analyze(item, depth + 1))
			return
		}

		if (typeof current === "object") {
			objectCount++
			const entries = Object.entries(current as Record<string, unknown>)
			totalKeys += entries.length
			entries.forEach(([, value]) => analyze(value, depth + 1))
		}
	}

	analyze(json, 0)

	return {
		totalKeys,
		maxDepth,
		arrayCount,
		objectCount,
		stringCount,
		numberCount,
		booleanCount,
		nullCount,
	}
}
