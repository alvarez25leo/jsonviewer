import ModalComponent from "../moda.component"
import { modalProps } from "@/types"

interface ShortcutGroup {
	title: string
	shortcuts: { keys: string[]; description: string }[]
}

const shortcutGroups: ShortcutGroup[] = [
	{
		title: "General",
		shortcuts: [
			{ keys: ["Ctrl", "K"], description: "Open command palette" },
			{ keys: ["Ctrl", "S"], description: "Save / Format JSON" },
			{ keys: ["Ctrl", "O"], description: "Open file" },
			{ keys: ["Escape"], description: "Close modal / Cancel" },
		],
	},
	{
		title: "Templates",
		shortcuts: [
			{ keys: ["Ctrl", "Shift", "T"], description: "Browse templates" },
			{ keys: ["Ctrl", "Shift", "S"], description: "Save as template" },
		],
	},
	{
		title: "Editor",
		shortcuts: [
			{ keys: ["Ctrl", "Z"], description: "Undo" },
			{ keys: ["Ctrl", "Shift", "Z"], description: "Redo" },
			{ keys: ["Ctrl", "F"], description: "Find" },
			{ keys: ["Ctrl", "H"], description: "Find and replace" },
			{ keys: ["Ctrl", "D"], description: "Select next occurrence" },
			{ keys: ["Alt", "↑/↓"], description: "Move line up/down" },
			{ keys: ["Ctrl", "Shift", "K"], description: "Delete line" },
			{ keys: ["Ctrl", "/"], description: "Toggle comment" },
		],
	},
	{
		title: "View",
		shortcuts: [
			{ keys: ["Ctrl", "B"], description: "Toggle editor/graph panel" },
			{ keys: ["Ctrl", "+"], description: "Zoom in" },
			{ keys: ["Ctrl", "-"], description: "Zoom out" },
			{ keys: ["Ctrl", "0"], description: "Reset zoom" },
		],
	},
	{
		title: "Features",
		shortcuts: [
			{ keys: ["Ctrl", "E"], description: "Export JSON" },
			{ keys: ["Ctrl", "T"], description: "Transform JSON" },
			{ keys: ["Ctrl", "G"], description: "Generate mock data" },
			{ keys: ["Ctrl", "I"], description: "Import from API" },
			{ keys: ["Ctrl", "J"], description: "JSONPath query" },
			{ keys: ["Ctrl", "Shift", "V"], description: "Validate schema" },
			{ keys: ["Ctrl", "Shift", "D"], description: "Diff comparison" },
			{ keys: ["Ctrl", "Shift", "H"], description: "History" },
			{ keys: ["?"], description: "Show shortcuts (this modal)" },
		],
	},
	{
		title: "Graph View",
		shortcuts: [
			{ keys: ["Scroll"], description: "Zoom in/out" },
			{ keys: ["Drag"], description: "Pan view" },
			{ keys: ["Click node"], description: "Focus on node" },
			{ keys: ["Double-click"], description: "Expand/collapse node" },
		],
	},
]

export const ShortcutsModal = ({ opened, onClose }: modalProps) => {
	return (
		<ModalComponent
			openModal={opened}
			title="Keyboard Shortcuts"
			closeModal={onClose}
			style={{ minWidth: "600px", minHeight: "70vh" }}
		>
			<div className="flex flex-col gap-6">
				{shortcutGroups.map((group) => (
					<div key={group.title}>
						<h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
							{group.title}
						</h3>
						<div className="space-y-2">
							{group.shortcuts.map((shortcut, index) => (
								<div
									key={index}
									className="flex items-center justify-between rounded-md bg-gray-800/50 px-3 py-2"
								>
									<span className="text-sm text-gray-300">{shortcut.description}</span>
									<div className="flex gap-1">
										{shortcut.keys.map((key, keyIndex) => (
											<span key={keyIndex}>
												<kbd className="rounded-md border border-gray-600 bg-gray-700 px-2 py-1 text-xs font-medium text-gray-200">
													{key}
												</kbd>
												{keyIndex < shortcut.keys.length - 1 && (
													<span className="mx-1 text-gray-500">+</span>
												)}
											</span>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				))}

				{/* Tip */}
				<div className="rounded-md bg-blue-900/30 border border-blue-600 p-3 text-sm text-blue-300">
					💡 <strong>Pro tip:</strong> Press <kbd className="rounded border border-blue-500 bg-blue-900 px-1.5 py-0.5 text-xs">Ctrl+K</kbd> to open the command palette for quick access to all features.
				</div>
			</div>
		</ModalComponent>
	)
}
