import { useState, useCallback } from "react"
import { decode } from "js-base64"
import { useLocalStorage } from "@/hooks/useLocalStorage.hooks"
import { useCodeEditor } from "@/hooks/useCodeEditor"
import { useMitt } from "@/provider/mitt"
import { languagesType, tabType } from "@/types"
import { SUPPORTED_LANGUAGES, BUTTON_STYLES, PANEL_CONFIG } from "@/constants/editor"
import { CopyIcon, FormatIcon } from "@/components/icons"
import JsonEditorComponent from "../editor/json-editor.component"
import JsonGraphComponent from "../graph/json-graph.component"
import DiffEditorComponent from "../editor/diff-editor.component"
import TabJsonGraphComponent from "../tabs/tab-json-graph.component"
import ButtonPanelShowComponent from "../buttons/button-panel-show.component"

// ============================================================================
// Types
// ============================================================================

interface ActionButtonProps {
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
	icon?: React.ReactNode
	label: string
	className?: string
}

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Botón de acción reutilizable para la barra de herramientas
 */
const ActionButton: React.FC<ActionButtonProps> = ({ onClick, icon, label, className = "" }) => (
	<button
		className={`${BUTTON_STYLES.base} ${BUTTON_STYLES.withGap} ${BUTTON_STYLES.padding.sm} flex-1 ${className}`}
		onClick={onClick}
	>
		{icon && <div>{icon}</div>}
		<div className="flex items-center justify-center">{label}</div>
	</button>
)

/**
 * Selector de lenguaje para el editor
 */
interface LanguageSelectorProps {
	currentLanguage: languagesType
	onLanguageChange: (language: languagesType) => void
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onLanguageChange }) => (
	<div>
		<div className="mb-2 mt-1">
			<label className="mb-2 text-[0.8125rem] font-semibold leading-5 text-[#cccccc80]">Lenguajes</label>
		</div>
		<div className="mt-1 flex flex-wrap gap-1">
			{SUPPORTED_LANGUAGES.map((languageName) => (
				<button
					key={languageName}
					className={`${BUTTON_STYLES.base} ${BUTTON_STYLES.padding.md} ${
						currentLanguage === languageName ? BUTTON_STYLES.active : ""
					}`}
					onClick={() => onLanguageChange(languageName)}
				>
					{languageName}
				</button>
			))}
		</div>
	</div>
)

// ============================================================================
// Main Component
// ============================================================================

const ContainerEditorComponent: React.FC = () => {
	// Estado local y persistido
	const [tabCurrent, setTabCurrent] = useLocalStorage<tabType>("tabCurrent", "code")
	const [language, setLanguage] = useLocalStorage<languagesType>("languageEditor", "json")
	const [showPanel] = useLocalStorage<boolean>("showPanel", true)
	const [keyEditor, setKeyEditor] = useState<number>(0)

	// Hook personalizado para manejar el código
	const { codeValues, copyCode, clearCode, minifyCode, getDecodedValue } = useCodeEditor({
		language,
		tabCurrent,
	})

	const { emitter } = useMitt()

	// ========================================================================
	// Handlers
	// ========================================================================

	const handleCopyCode = useCallback(
		async (e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault()
			await copyCode()
		},
		[copyCode]
	)

	const handleClearEditor = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault()
			const wasCleared = clearCode()
			if (wasCleared) {
				setKeyEditor((prev) => prev + 1)
			}
		},
		[clearCode]
	)

	const handleFormatCode = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault()
			emitter.emit("formatCode", { language, tab: tabCurrent })
		},
		[emitter, language, tabCurrent]
	)

	const handleMinifyEditor = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault()
			const wasMinified = minifyCode()
			if (wasMinified) {
				setKeyEditor((prev) => prev + 1)
			}
		},
		[minifyCode]
	)

	const handleOpenSplitView = useCallback(() => {
		window.open(`${window.location.origin}/editor-graph`, "_blank")
	}, [])

	// ========================================================================
	// Computed values
	// ========================================================================

	const panelWidth = showPanel ? PANEL_CONFIG.width : PANEL_CONFIG.minWidth
	const editorWidth = showPanel ? `calc(100vw - ${PANEL_CONFIG.width}px)` : "100vw"
	const jsonCodeDecoded = getDecodedValue("json")

	// ========================================================================
	// Render
	// ========================================================================

	return (
		<>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: `1fr ${panelWidth}px`,
				}}
			>
				{/* Editor Area */}
				<div
					style={{
						height: "100vh",
						width: editorWidth,
						maxWidth: editorWidth,
						minWidth: editorWidth,
						position: "relative",
						overflow: "hidden",
					}}
				>
					{tabCurrent === "code" && (
						<JsonEditorComponent key={`${language}${keyEditor}`} language={language} />
					)}

					{tabCurrent === "graph" && language === "json" && <JsonGraphComponent json={jsonCodeDecoded} />}

					{tabCurrent === "compare" && (
						<DiffEditorComponent
							key={`${language}${keyEditor}`}
							codeValue={decode(codeValues.find((c) => c.language === language)?.value || "")}
							codeValueModified=""
							language={language}
						/>
					)}
				</div>

				{/* Sidebar Panel */}
				<div className="px-1 py-3">
					{/* Tabs */}
					<div className="mb-1">
						<TabJsonGraphComponent
							currentTab={tabCurrent}
							handleTabChange={setTabCurrent}
							language={language}
						/>
					</div>

					{/* Language Selector */}
					<LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />

					{/* Actions Header */}
					<div>
						<div className="mb-2 mt-2">
							<label className="mb-2 text-[0.8125rem] font-semibold leading-5 text-[#cccccc80]">
								Actions
							</label>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="mt-1 flex gap-x-2">
						<ActionButton onClick={handleOpenSplitView} label="Open Split View" className="flex-none" />
						<ActionButton onClick={handleCopyCode} icon={<CopyIcon />} label="Copy" />
						<ActionButton onClick={handleFormatCode} icon={<FormatIcon />} label="Format" />
						<ActionButton onClick={handleClearEditor} label="Clean" />
						<ActionButton onClick={handleMinifyEditor} label="Minify" />
					</div>
				</div>
			</div>

			<ButtonPanelShowComponent />
		</>
	)
}

export default ContainerEditorComponent
