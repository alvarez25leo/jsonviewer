import useModal from "@/store/useModal"

interface FeatureButtonProps {
	icon: string
	label: string
	onClick: () => void
	shortcut?: string
}

const FeatureButton: React.FC<FeatureButtonProps> = ({ icon, label, onClick, shortcut }) => (
	<button
		onClick={onClick}
		className="group flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-300 transition-colors hover:bg-gray-700/50"
		title={shortcut ? `${label} (${shortcut})` : label}
	>
		<span className="text-base">{icon}</span>
		<span className="flex-1 truncate">{label}</span>
		{shortcut && (
			<kbd className="hidden rounded border border-gray-600 bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-500 group-hover:inline">
				{shortcut}
			</kbd>
		)}
	</button>
)

interface FeatureGroupProps {
	title: string
	children: React.ReactNode
}

const FeatureGroup: React.FC<FeatureGroupProps> = ({ title, children }) => (
	<div className="mb-3">
		<div className="mb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">{title}</div>
		{children}
	</div>
)

export const FeaturesSidebar: React.FC = () => {
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

	return (
		<div className="flex flex-col">
			<FeatureGroup title="Templates">
				<FeatureButton icon="📚" label="Browse Templates" onClick={() => setTemplates(true)} shortcut="Ctrl+Shift+T" />
				<FeatureButton icon="💾" label="Save as Template" onClick={() => setSaveTemplate(true)} shortcut="Ctrl+Shift+S" />
			</FeatureGroup>

			<FeatureGroup title="Export">
				<FeatureButton icon="📤" label="Export JSON" onClick={() => setExport(true)} shortcut="Ctrl+E" />
			</FeatureGroup>

			<FeatureGroup title="Transform">
				<FeatureButton icon="🔄" label="Transform" onClick={() => setTransform(true)} shortcut="Ctrl+T" />
			</FeatureGroup>

			<FeatureGroup title="Generate">
				<FeatureButton icon="🎲" label="Mock Data" onClick={() => setMockGenerator(true)} shortcut="Ctrl+G" />
				<FeatureButton icon="🌐" label="Import API" onClick={() => setApiImport(true)} shortcut="Ctrl+I" />
			</FeatureGroup>

			<FeatureGroup title="Query & Validate">
				<FeatureButton icon="🔍" label="JSONPath" onClick={() => setJsonpath(true)} shortcut="Ctrl+J" />
				<FeatureButton icon="✅" label="Validate Schema" onClick={() => setSchemaValidator(true)} shortcut="Ctrl+Shift+V" />
			</FeatureGroup>

			<FeatureGroup title="Compare">
				<FeatureButton icon="⚖️" label="Diff JSONs" onClick={() => setDiff(true)} shortcut="Ctrl+Shift+D" />
			</FeatureGroup>

			<FeatureGroup title="History">
				<FeatureButton icon="📜" label="History" onClick={() => setHistory(true)} shortcut="Ctrl+Shift+H" />
			</FeatureGroup>

			<FeatureGroup title="Help">
				<FeatureButton icon="⌨️" label="Shortcuts" onClick={() => setShortcuts(true)} shortcut="?" />
			</FeatureGroup>

			{/* Command Palette Hint */}
			<div className="mt-4 rounded-md bg-blue-900/20 p-2 text-center">
				<p className="text-xs text-blue-300">
					Press <kbd className="rounded border border-blue-600 bg-blue-900 px-1 text-[10px]">Ctrl+K</kbd> for
					command palette
				</p>
			</div>
		</div>
	)
}
