import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface HistoryEntry {
	id: string
	timestamp: number
	content: string
	label: string
}

interface HistoryState {
	entries: HistoryEntry[]
	maxEntries: number
	currentIndex: number
	// Aliases for components
	history: HistoryEntry[]
}

interface HistoryActions {
	addEntry: (content: string, label?: string) => void
	addToHistory: (content: string, label?: string) => void
	undo: () => HistoryEntry | null
	redo: () => HistoryEntry | null
	goToState: (index: number) => HistoryEntry | null
	clearHistory: () => void
	getEntry: (id: string) => HistoryEntry | undefined
	canUndo: () => boolean
	canRedo: () => boolean
	setLabel: (id: string, label: string) => void
	removeEntry: (id: string) => void
}

const MAX_ENTRIES = 50

const useHistory = create(
	persist<HistoryState & HistoryActions>(
		(set, get) => ({
			entries: [],
			maxEntries: MAX_ENTRIES,
			currentIndex: -1,

			// Getter computed para componentes
			get history() {
				return get().entries
			},

			addEntry: (content, label = "Edit") => {
				const { entries, currentIndex, maxEntries } = get()

				// Avoid duplicate entries with same content
				const lastEntry = entries[currentIndex]
				if (lastEntry && lastEntry.content === content) {
					return
				}

				// Si estamos en medio del historial, eliminar todo lo que viene después
				const newEntries = entries.slice(0, currentIndex + 1)

				const entry: HistoryEntry = {
					id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
					timestamp: Date.now(),
					content,
					label,
				}

				// Añadir nueva entrada
				newEntries.push(entry)

				// Limitar el número de entradas
				while (newEntries.length > maxEntries) {
					newEntries.shift()
				}

				set({
					entries: newEntries,
					currentIndex: newEntries.length - 1,
				})
			},

			// Alias for addEntry
			addToHistory: (content, label) => {
				get().addEntry(content, label)
			},

			undo: () => {
				const { entries, currentIndex } = get()
				if (currentIndex <= 0) return null

				const newIndex = currentIndex - 1
				set({ currentIndex: newIndex })
				return entries[newIndex] || null
			},

			redo: () => {
				const { entries, currentIndex } = get()
				if (currentIndex >= entries.length - 1) return null

				const newIndex = currentIndex + 1
				set({ currentIndex: newIndex })
				return entries[newIndex] || null
			},

			goToState: (index: number) => {
				const { entries } = get()
				if (index < 0 || index >= entries.length) return null

				set({ currentIndex: index })
				return entries[index] || null
			},

			canUndo: () => {
				return get().currentIndex > 0
			},

			canRedo: () => {
				const { entries, currentIndex } = get()
				return currentIndex < entries.length - 1
			},

			clearHistory: () => {
				set({ entries: [], currentIndex: -1 })
			},

			getEntry: (id) => {
				return get().entries.find((e) => e.id === id)
			},

			setLabel: (id, label) => {
				set({
					entries: get().entries.map((e) => (e.id === id ? { ...e, label } : e)),
				})
			},

			removeEntry: (id) => {
				const { entries, currentIndex } = get()
				const index = entries.findIndex((e) => e.id === id)
				if (index === -1) return

				const newEntries = entries.filter((e) => e.id !== id)
				let newIndex = currentIndex

				if (index <= currentIndex) {
					newIndex = Math.max(0, currentIndex - 1)
				}

				set({
					entries: newEntries,
					currentIndex: newEntries.length > 0 ? newIndex : -1,
				})
			},
		}),
		{
			name: "json-history",
		}
	)
)

export default useHistory
