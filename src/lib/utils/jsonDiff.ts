import { diff, Diff } from "deep-diff"

export interface DiffResult {
	kind: "N" | "D" | "E" | "A" // New, Deleted, Edited, Array
	path: string[]
	lhs?: unknown // Left-hand side (original)
	rhs?: unknown // Right-hand side (new)
	index?: number // For array changes
	item?: {
		kind: string
		lhs?: unknown
		rhs?: unknown
	}
}

export interface DiffSummary {
	added: number
	removed: number
	changed: number
	total: number
	differences: DiffResult[]
}

/**
 * Compara dos objetos JSON y retorna las diferencias
 */
export function compareJson(original: unknown, modified: unknown): DiffSummary {
	const differences = diff(original, modified) || []

	let added = 0
	let removed = 0
	let changed = 0

	const results: DiffResult[] = differences.map((d: Diff<unknown, unknown>) => {
		const result: DiffResult = {
			kind: d.kind,
			path: d.path || [],
			lhs: "lhs" in d ? d.lhs : undefined,
			rhs: "rhs" in d ? d.rhs : undefined,
		}

		if (d.kind === "A") {
			result.index = d.index
			result.item = d.item as DiffResult["item"]
		}

		// Contar tipos de cambios
		switch (d.kind) {
			case "N":
				added++
				break
			case "D":
				removed++
				break
			case "E":
				changed++
				break
			case "A":
				if (d.item?.kind === "N") added++
				else if (d.item?.kind === "D") removed++
				else changed++
				break
		}

		return result
	})

	return {
		added,
		removed,
		changed,
		total: differences.length,
		differences: results,
	}
}

/**
 * Formatea una diferencia para mostrar
 */
export function formatDiff(diff: DiffResult): string {
	const pathStr = diff.path.join(".")

	switch (diff.kind) {
		case "N":
			return `+ Added: ${pathStr} = ${JSON.stringify(diff.rhs)}`
		case "D":
			return `- Removed: ${pathStr} (was ${JSON.stringify(diff.lhs)})`
		case "E":
			return `~ Changed: ${pathStr}: ${JSON.stringify(diff.lhs)} → ${JSON.stringify(diff.rhs)}`
		case "A":
			return `⊕ Array[${diff.index}] at ${pathStr}: ${diff.item?.kind === "N" ? "added" : diff.item?.kind === "D" ? "removed" : "changed"}`
		default:
			return `Unknown change at ${pathStr}`
	}
}

/**
 * Formatea diferencias como HTML
 */
export function formatDiffHtml(results: DiffResult[]): string {
	if (results.length === 0) {
		return '<div class="text-green-400">✓ No differences found</div>'
	}

	const lines = results.map((diff) => {
		const pathStr = diff.path.join(".")

		switch (diff.kind) {
			case "N":
				return `<div class="text-green-400">+ <span class="text-gray-400">${pathStr}</span> = <span class="text-green-300">${escapeHtml(JSON.stringify(diff.rhs))}</span></div>`
			case "D":
				return `<div class="text-red-400">- <span class="text-gray-400">${pathStr}</span> = <span class="text-red-300">${escapeHtml(JSON.stringify(diff.lhs))}</span></div>`
			case "E":
				return `<div class="text-yellow-400">~ <span class="text-gray-400">${pathStr}</span>: <span class="text-red-300">${escapeHtml(JSON.stringify(diff.lhs))}</span> → <span class="text-green-300">${escapeHtml(JSON.stringify(diff.rhs))}</span></div>`
			case "A":
				const action = diff.item?.kind === "N" ? "added" : diff.item?.kind === "D" ? "removed" : "changed"
				return `<div class="text-blue-400">⇆ <span class="text-gray-400">${pathStr}[${diff.index}]</span>: ${action}</div>`
			default:
				return `<div class="text-gray-400">? ${pathStr}</div>`
		}
	})

	return lines.join("")
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;")
}

/**
 * Aplica diferencias a un objeto
 */
export function applyDiff(original: unknown, differences: DiffResult[]): unknown {
	// Crear copia profunda
	const result = JSON.parse(JSON.stringify(original))

	for (const diff of differences) {
		let current: Record<string, unknown> = result
		const path = [...diff.path]
		const lastKey = path.pop()

		// Navegar al objeto padre
		for (const key of path) {
			if (current[key] === undefined) {
				current[key] = {}
			}
			current = current[key] as Record<string, unknown>
		}

		if (lastKey !== undefined) {
			switch (diff.kind) {
				case "N":
				case "E":
					current[lastKey] = diff.rhs
					break
				case "D":
					delete current[lastKey]
					break
				case "A":
					if (Array.isArray(current[lastKey]) && diff.index !== undefined) {
						const arr = current[lastKey] as unknown[]
						if (diff.item?.kind === "N") {
							arr.splice(diff.index, 0, diff.item.rhs)
						} else if (diff.item?.kind === "D") {
							arr.splice(diff.index, 1)
						} else if (diff.item?.kind === "E") {
							arr[diff.index] = diff.item.rhs
						}
					}
					break
			}
		}
	}

	return result
}

/**
 * Genera un resumen legible de las diferencias
 */
export function getDiffSummaryText(summary: DiffSummary): string {
	if (summary.total === 0) {
		return "No differences found. The JSONs are identical."
	}

	const parts: string[] = []

	if (summary.added > 0) {
		parts.push(`${summary.added} addition${summary.added > 1 ? "s" : ""}`)
	}
	if (summary.removed > 0) {
		parts.push(`${summary.removed} removal${summary.removed > 1 ? "s" : ""}`)
	}
	if (summary.changed > 0) {
		parts.push(`${summary.changed} change${summary.changed > 1 ? "s" : ""}`)
	}

	return `Found ${summary.total} difference${summary.total > 1 ? "s" : ""}: ${parts.join(", ")}`
}
