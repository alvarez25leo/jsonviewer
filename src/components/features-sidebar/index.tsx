import useModal from "@/store/useModal"
import useLanguage from "@/hooks/useLanguage"
import LanguageSelector from "@/components/language-selector"

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
	const { t } = useLanguage()
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
			{/* Language Selector */}
			<div className="mb-4 px-3">
				<div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
					{t("common.language")}
				</div>
				<LanguageSelector variant="dropdown" className="w-full" />
			</div>

			<FeatureGroup title={t("sidebar.templates")}>
				<FeatureButton icon="📚" label={t("sidebar.browseTemplates")} onClick={() => setTemplates(true)} shortcut="Ctrl+Shift+T" />
				<FeatureButton icon="💾" label={t("sidebar.saveAsTemplate")} onClick={() => setSaveTemplate(true)} shortcut="Ctrl+Shift+S" />
			</FeatureGroup>

			<FeatureGroup title={t("common.export")}>
				<FeatureButton icon="📤" label={t("sidebar.export")} onClick={() => setExport(true)} shortcut="Ctrl+E" />
			</FeatureGroup>

			<FeatureGroup title={t("sidebar.transform")}>
				<FeatureButton icon="🔄" label={t("sidebar.transform")} onClick={() => setTransform(true)} shortcut="Ctrl+T" />
			</FeatureGroup>

			<FeatureGroup title={t("sidebar.mock")}>
				<FeatureButton icon="🎲" label={t("sidebar.mock")} onClick={() => setMockGenerator(true)} shortcut="Ctrl+G" />
				<FeatureButton icon="🌐" label={t("sidebar.api")} onClick={() => setApiImport(true)} shortcut="Ctrl+I" />
			</FeatureGroup>

			<FeatureGroup title={t("sidebar.jsonPath")}>
				<FeatureButton icon="🔍" label={t("sidebar.jsonPath")} onClick={() => setJsonpath(true)} shortcut="Ctrl+J" />
				<FeatureButton icon="✅" label={t("sidebar.schema")} onClick={() => setSchemaValidator(true)} shortcut="Ctrl+Shift+V" />
			</FeatureGroup>

			<FeatureGroup title={t("sidebar.diff")}>
				<FeatureButton icon="⚖️" label={t("sidebar.diff")} onClick={() => setDiff(true)} shortcut="Ctrl+Shift+D" />
			</FeatureGroup>

			<FeatureGroup title={t("sidebar.history")}>
				<FeatureButton icon="📜" label={t("sidebar.history")} onClick={() => setHistory(true)} shortcut="Ctrl+Shift+H" />
			</FeatureGroup>

			<FeatureGroup title={t("modals.shortcuts.title")}>
				<FeatureButton icon="⌨️" label={t("modals.shortcuts.title")} onClick={() => setShortcuts(true)} shortcut="?" />
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
