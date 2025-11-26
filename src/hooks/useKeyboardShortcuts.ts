import { useEffect, useCallback } from "react"

export interface KeyboardShortcut {
	key: string
	ctrl?: boolean
	shift?: boolean
	alt?: boolean
	meta?: boolean
	action: () => void
	description: string
	category: string
}

interface UseKeyboardShortcutsOptions {
	enabled?: boolean
}

interface ShortcutHandlers {
	onExport?: () => void
	onTransform?: () => void
	onMockGenerator?: () => void
	onApiImport?: () => void
	onJsonPath?: () => void
	onSchemaValidator?: () => void
	onDiff?: () => void
	onHistory?: () => void
	onShortcuts?: () => void
	onUndo?: () => void
	onRedo?: () => void
}

/**
 * Hook para manejar atajos de teclado globales con handlers predefinidos
 */
export function useKeyboardShortcuts(handlers: ShortcutHandlers, options: UseKeyboardShortcutsOptions = {}) {
	const { enabled = true } = options

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (!enabled) return

			// Ignorar si el focus está en un input/textarea (excepto para ciertos atajos)
			const target = event.target as HTMLElement
			const isEditable =
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.isContentEditable

			// Atajos que funcionan incluso en el editor
			const isCtrl = event.ctrlKey || event.metaKey
			const isShift = event.shiftKey
			const key = event.key.toLowerCase()

			// Ctrl+E - Export
			if (isCtrl && !isShift && key === "e" && handlers.onExport) {
				event.preventDefault()
				handlers.onExport()
				return
			}

			// Ctrl+T - Transform
			if (isCtrl && !isShift && key === "t" && handlers.onTransform) {
				event.preventDefault()
				handlers.onTransform()
				return
			}

			// Ctrl+G - Mock Generator
			if (isCtrl && !isShift && key === "g" && handlers.onMockGenerator) {
				event.preventDefault()
				handlers.onMockGenerator()
				return
			}

			// Ctrl+I - API Import
			if (isCtrl && !isShift && key === "i" && handlers.onApiImport) {
				event.preventDefault()
				handlers.onApiImport()
				return
			}

			// Ctrl+J - JSONPath
			if (isCtrl && !isShift && key === "j" && handlers.onJsonPath) {
				event.preventDefault()
				handlers.onJsonPath()
				return
			}

			// Ctrl+Shift+V - Schema Validator
			if (isCtrl && isShift && key === "v" && handlers.onSchemaValidator) {
				event.preventDefault()
				handlers.onSchemaValidator()
				return
			}

			// Ctrl+Shift+D - Diff
			if (isCtrl && isShift && key === "d" && handlers.onDiff) {
				event.preventDefault()
				handlers.onDiff()
				return
			}

			// Ctrl+Shift+H - History
			if (isCtrl && isShift && key === "h" && handlers.onHistory) {
				event.preventDefault()
				handlers.onHistory()
				return
			}

			// ? - Shortcuts (only when not editing)
			if (!isEditable && key === "?" && handlers.onShortcuts) {
				event.preventDefault()
				handlers.onShortcuts()
				return
			}

			// Ctrl+Z - Undo (handled by editor, but can override)
			if (isCtrl && !isShift && key === "z" && handlers.onUndo) {
				// Let Monaco handle its own undo
				// event.preventDefault()
				// handlers.onUndo()
				return
			}

			// Ctrl+Shift+Z - Redo
			if (isCtrl && isShift && key === "z" && handlers.onRedo) {
				// Let Monaco handle its own redo
				// event.preventDefault()
				// handlers.onRedo()
				return
			}
		},
		[handlers, enabled]
	)

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown)
		return () => {
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [handleKeyDown])
}

/**
 * Formatea un atajo de teclado para mostrar
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
	const parts: string[] = []

	if (shortcut.ctrl) parts.push("Ctrl")
	if (shortcut.shift) parts.push("Shift")
	if (shortcut.alt) parts.push("Alt")
	if (shortcut.meta) parts.push("⌘")

	parts.push(shortcut.key.toUpperCase())

	return parts.join(" + ")
}

/**
 * Agrupa atajos por categoría
 */
export function groupShortcutsByCategory(shortcuts: KeyboardShortcut[]): Record<string, KeyboardShortcut[]> {
	return shortcuts.reduce(
		(acc, shortcut) => {
			if (!acc[shortcut.category]) {
				acc[shortcut.category] = []
			}
			acc[shortcut.category].push(shortcut)
			return acc
		},
		{} as Record<string, KeyboardShortcut[]>
	)
}
