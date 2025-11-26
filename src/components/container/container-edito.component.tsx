import { useState, useCallback, useEffect } from "react"
import { decode } from "js-base64"
import { useLocalStorage } from "@/hooks/useLocalStorage.hooks"
import { useCodeEditor } from "@/hooks/useCodeEditor"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { useMitt } from "@/provider/mitt"
import { languagesType, tabType } from "@/types"
import { SUPPORTED_LANGUAGES, BUTTON_STYLES, PANEL_CONFIG } from "@/constants/editor"
import { CopyIcon, FormatIcon } from "@/components/icons"
import { FeaturesSidebar } from "@/components/features-sidebar"
import useModal from "@/store/useModal"
import useHistory from "@/store/useHistory"
import useJson from "@/store/useJson"
import JsonEditorComponent from "../editor/json-editor.component"
import JsonGraphComponent from "../graph/json-graph.component"
import DiffEditorComponent from "../editor/diff-editor.component"
import TabJsonGraphComponent from "../tabs/tab-json-graph.component"
import ButtonPanelShowComponent from "../buttons/button-panel-show.component"
import ModalControllerComponent from "./modal-controller.component"

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
	const [showFeatures, setShowFeatures] = useState<boolean>(true)

	// Hook personalizado para manejar el código
	const { codeValues, copyCode, clearCode, minifyCode, getDecodedValue } = useCodeEditor({
		language,
		tabCurrent,
	})

	const { emitter } = useMitt()

	// Modal store
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
	} = useModal()

	// History store
	const { undo, redo, canUndo, canRedo, addToHistory } = useHistory()
	const { getJson, setJson } = useJson()

	// ========================================================================
	// Keyboard Shortcuts
	// ========================================================================

	useKeyboardShortcuts({
		onExport: () => setExport(true),
		onTransform: () => setTransform(true),
		onMockGenerator: () => setMockGenerator(true),
		onApiImport: () => setApiImport(true),
		onJsonPath: () => setJsonpath(true),
		onSchemaValidator: () => setSchemaValidator(true),
		onDiff: () => setDiff(true),
		onHistory: () => setHistory(true),
		onShortcuts: () => setShortcuts(true),
		onUndo: () => {
			if (canUndo()) {
				const state = undo()
				if (state) {
					setJson(state.content)
					setKeyEditor((prev) => prev + 1)
				}
			}
		},
		onRedo: () => {
			if (canRedo()) {
				const state = redo()
				if (state) {
					setJson(state.content)
					setKeyEditor((prev) => prev + 1)
				}
			}
		},
	})

	// ========================================================================
	// Track history on JSON changes
	// ========================================================================

	useEffect(() => {
		const handleJsonChange = () => {
			try {
				const currentJson = getJson()
				if (currentJson && currentJson.trim()) {
					addToHistory(currentJson, "Edit")
				}
			} catch {
				// Ignore invalid JSON
			}
		}

		// Debounce history tracking
		const timeoutId = setTimeout(handleJsonChange, 1000)
		return () => clearTimeout(timeoutId)
	}, [keyEditor])

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
				<div className="custom-scrollbar flex flex-col overflow-y-auto px-1 py-3" style={{ maxHeight: "100vh" }}>
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

					{/* Features Section */}
					<div className="mt-4">
						<div
							className="mb-2 flex cursor-pointer items-center justify-between"
							onClick={() => setShowFeatures(!showFeatures)}
						>
							<label className="cursor-pointer text-[0.8125rem] font-semibold leading-5 text-[#cccccc80]">
								Features
							</label>
							<span className="text-xs text-gray-500">{showFeatures ? "▼" : "▶"}</span>
						</div>
						{showFeatures && <FeaturesSidebar />}
					</div>
				</div>
			</div>

			<ButtonPanelShowComponent />
			<ModalControllerComponent />
		</>
	)
}

export default ContainerEditorComponent
