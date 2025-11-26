import { useState, useEffect, useCallback, useRef } from "react"
import useModal from "@/store/useModal"
import useJson from "@/store/useJson"
import useFile from "@/store/useFile"
import useHistory from "@/store/useHistory"
import { toast } from "sonner"

interface Command {
	id: string
	label: string
	shortcut?: string
	category: string
	action: () => void
	icon?: string
}

export const CommandPalette = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [search, setSearch] = useState("")
	const [selectedIndex, setSelectedIndex] = useState(0)
	const inputRef = useRef<HTMLInputElement>(null)
	const listRef = useRef<HTMLDivElement>(null)

	// Stores
	const {
		setExport,
		setTransform,
		setHistory,
		setMockGenerator,
		setApiImport,
		setJsonpath,
		setSchemaValidator,
		setDiff,
		setShortcuts,
		setTemplates,
		setSaveTemplate,
	} = useModal()
	const { setJson } = useJson()
	const { getContents } = useFile()
	const { undo, redo, canUndo, canRedo } = useHistory()

	// Define commands
	const commands: Command[] = [
		// Templates
		{
			id: "templates",
			label: "Browse Templates...",
			shortcut: "Ctrl+Shift+T",
			category: "Templates",
			action: () => setTemplates(true),
			icon: "📚",
		},
		{
			id: "save-template",
			label: "Save as Template...",
			shortcut: "Ctrl+Shift+S",
			category: "Templates",
			action: () => setSaveTemplate(true),
			icon: "💾",
		},

		// File operations
		{
			id: "format",
			label: "Format JSON",
			shortcut: "Ctrl+S",
			category: "File",
			action: () => {
				try {
					const json = JSON.parse(getContents())
					setJson(JSON.stringify(json, null, 2))
					toast.success("JSON formatted!")
				} catch {
					toast.error("Invalid JSON")
				}
			},
			icon: "📝",
		},
		{
			id: "copy",
			label: "Copy JSON to Clipboard",
			category: "File",
			action: () => {
				navigator.clipboard.writeText(getContents())
				toast.success("Copied to clipboard!")
			},
			icon: "📋",
		},
		{
			id: "minify",
			label: "Minify JSON",
			category: "File",
			action: () => {
				try {
					const json = JSON.parse(getContents())
					setJson(JSON.stringify(json))
					toast.success("JSON minified!")
				} catch {
					toast.error("Invalid JSON")
				}
			},
			icon: "🗜️",
		},

		// Export
		{
			id: "export",
			label: "Export JSON...",
			shortcut: "Ctrl+E",
			category: "Export",
			action: () => setExport(true),
			icon: "📤",
		},
		{
			id: "export-yaml",
			label: "Export as YAML",
			category: "Export",
			action: () => setExport(true),
			icon: "📄",
		},
		{
			id: "export-xml",
			label: "Export as XML",
			category: "Export",
			action: () => setExport(true),
			icon: "📄",
		},

		// Transform
		{
			id: "transform",
			label: "Transform JSON...",
			shortcut: "Ctrl+T",
			category: "Transform",
			action: () => setTransform(true),
			icon: "🔄",
		},
		{
			id: "flatten",
			label: "Flatten JSON",
			category: "Transform",
			action: () => setTransform(true),
			icon: "📊",
		},
		{
			id: "sort-keys",
			label: "Sort Keys",
			category: "Transform",
			action: () => setTransform(true),
			icon: "🔤",
		},

		// Generate
		{
			id: "mock-generator",
			label: "Generate Mock Data...",
			shortcut: "Ctrl+G",
			category: "Generate",
			action: () => setMockGenerator(true),
			icon: "🎲",
		},

		// Import
		{
			id: "api-import",
			label: "Import from API...",
			shortcut: "Ctrl+I",
			category: "Import",
			action: () => setApiImport(true),
			icon: "🌐",
		},

		// Query & Validate
		{
			id: "jsonpath",
			label: "JSONPath Query...",
			shortcut: "Ctrl+J",
			category: "Query",
			action: () => setJsonpath(true),
			icon: "🔍",
		},
		{
			id: "schema-validator",
			label: "Validate JSON Schema...",
			shortcut: "Ctrl+Shift+V",
			category: "Validate",
			action: () => setSchemaValidator(true),
			icon: "✅",
		},

		// Compare
		{
			id: "diff",
			label: "Compare JSONs (Diff)...",
			shortcut: "Ctrl+Shift+D",
			category: "Compare",
			action: () => setDiff(true),
			icon: "⚖️",
		},

		// History
		{
			id: "history",
			label: "Show History...",
			shortcut: "Ctrl+Shift+H",
			category: "History",
			action: () => setHistory(true),
			icon: "📜",
		},
		{
			id: "undo",
			label: "Undo",
			shortcut: "Ctrl+Z",
			category: "History",
			action: () => {
				if (canUndo()) {
					const state = undo()
					if (state) setJson(state.content)
				}
			},
			icon: "↶",
		},
		{
			id: "redo",
			label: "Redo",
			shortcut: "Ctrl+Shift+Z",
			category: "History",
			action: () => {
				if (canRedo()) {
					const state = redo()
					if (state) setJson(state.content)
				}
			},
			icon: "↷",
		},

		// Help
		{
			id: "shortcuts",
			label: "Keyboard Shortcuts",
			shortcut: "?",
			category: "Help",
			action: () => setShortcuts(true),
			icon: "⌨️",
		},
	]

	// Filter commands based on search
	const filteredCommands = commands.filter(
		(cmd) =>
			cmd.label.toLowerCase().includes(search.toLowerCase()) ||
			cmd.category.toLowerCase().includes(search.toLowerCase())
	)

	// Group commands by category
	const groupedCommands = filteredCommands.reduce(
		(acc, cmd) => {
			if (!acc[cmd.category]) {
				acc[cmd.category] = []
			}
			acc[cmd.category].push(cmd)
			return acc
		},
		{} as Record<string, Command[]>
	)

	// Handle keyboard navigation
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			// Open command palette
			if (e.ctrlKey && e.key.toLowerCase() === "k") {
				e.preventDefault()
				setIsOpen((prev) => !prev)
				return
			}

			if (!isOpen) return

			switch (e.key) {
				case "Escape":
					setIsOpen(false)
					break
				case "ArrowDown":
					e.preventDefault()
					setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1))
					break
				case "ArrowUp":
					e.preventDefault()
					setSelectedIndex((prev) => Math.max(prev - 1, 0))
					break
				case "Enter":
					e.preventDefault()
					if (filteredCommands[selectedIndex]) {
						filteredCommands[selectedIndex].action()
						setIsOpen(false)
					}
					break
			}
		},
		[isOpen, filteredCommands, selectedIndex]
	)

	// Add keyboard listener
	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [handleKeyDown])

	// Focus input when opened
	useEffect(() => {
		if (isOpen) {
			setSearch("")
			setSelectedIndex(0)
			setTimeout(() => inputRef.current?.focus(), 50)
		}
	}, [isOpen])

	// Scroll selected item into view
	useEffect(() => {
		if (listRef.current) {
			const selectedEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`)
			selectedEl?.scrollIntoView({ block: "nearest" })
		}
	}, [selectedIndex])

	if (!isOpen) return null

	let globalIndex = -1

	return (
		<div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				onClick={() => setIsOpen(false)}
			/>

			{/* Modal */}
			<div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-gray-700 bg-[#1a1d24] shadow-2xl">
				{/* Search Input */}
				<div className="flex items-center border-b border-gray-700 px-4">
					<span className="text-gray-500">🔍</span>
					<input
						ref={inputRef}
						type="text"
						value={search}
						onChange={(e) => {
							setSearch(e.target.value)
							setSelectedIndex(0)
						}}
						className="w-full bg-transparent px-3 py-4 text-white outline-none placeholder:text-gray-500"
						placeholder="Type a command or search..."
					/>
					<kbd className="rounded border border-gray-600 bg-gray-800 px-2 py-1 text-xs text-gray-400">
						ESC
					</kbd>
				</div>

				{/* Commands List */}
				<div ref={listRef} className="custom-scrollbar max-h-[50vh] overflow-auto p-2">
					{Object.entries(groupedCommands).map(([category, cmds]) => (
						<div key={category} className="mb-2">
							<div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
								{category}
							</div>
							{cmds.map((cmd) => {
								globalIndex++
								const isSelected = globalIndex === selectedIndex
								return (
									<button
										key={cmd.id}
										data-index={globalIndex}
										onClick={() => {
											cmd.action()
											setIsOpen(false)
										}}
										className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors ${
											isSelected
												? "bg-blue-600 text-white"
												: "text-gray-300 hover:bg-gray-800"
										}`}
									>
										<div className="flex items-center gap-3">
											<span className="text-lg">{cmd.icon}</span>
											<span className="font-medium">{cmd.label}</span>
										</div>
										{cmd.shortcut && (
											<kbd
												className={`rounded border px-2 py-0.5 text-xs ${
													isSelected
														? "border-blue-400 bg-blue-700 text-blue-100"
														: "border-gray-600 bg-gray-800 text-gray-400"
												}`}
											>
												{cmd.shortcut}
											</kbd>
										)}
									</button>
								)
							})}
						</div>
					))}

					{filteredCommands.length === 0 && (
						<div className="py-8 text-center text-gray-500">No commands found</div>
					)}
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between border-t border-gray-700 px-4 py-2 text-xs text-gray-500">
					<span>
						<kbd className="rounded border border-gray-600 bg-gray-800 px-1">↑↓</kbd> navigate
					</span>
					<span>
						<kbd className="rounded border border-gray-600 bg-gray-800 px-1">Enter</kbd> select
					</span>
					<span>
						<kbd className="rounded border border-gray-600 bg-gray-800 px-1">Ctrl+K</kbd> toggle
					</span>
				</div>
			</div>
		</div>
	)
}
