import MonacoEditor from "@monaco-editor/react"
import { decode } from "js-base64"
import { useMemo, useCallback } from "react"
import { editorOptions } from "@/config/config"
import { useLocalStorage } from "@/hooks/useLocalStorage.hooks"
import { useEditorActions } from "@/hooks/useEditorActions"
import { useMonacoSetup } from "@/hooks/useMonacoSetup"
import { languagesType, LanguageValue } from "@/types/editor.interface"

// ============================================================================
// Types
// ============================================================================

interface JsonEditorComponentProps {
	language: languagesType
	showSidebar?: boolean
}

// ============================================================================
// Component
// ============================================================================

/**
 * Componente de editor de código basado en Monaco Editor
 * Soporta múltiples lenguajes con sintaxis highlighting y emmet
 */
const JsonEditorComponent: React.FC<JsonEditorComponentProps> = ({ language, showSidebar = true }) => {
	// Estado persistido
	const [codeValues, setCodeValues] = useLocalStorage<LanguageValue[]>("codeEditorValues", [])

	// Custom hooks
	const { editorRef, handleEditorChange } = useEditorActions({
		language,
		codeValues,
		setCodeValues,
	})

	const { handleEditorWillMount, handleEditorDidMount } = useMonacoSetup({
		onEditorMount: (editor) => {
			editorRef.current = editor
		},
	})

	// ========================================================================
	// Memoized values
	// ========================================================================

	/**
	 * Opciones del editor con minimap condicional
	 */
	const monacoOptions = useMemo(
		() => ({
			...editorOptions,
			minimap: showSidebar ? editorOptions.minimap : { enabled: false },
		}),
		[showSidebar]
	)

	/**
	 * Valor inicial del editor decodificado
	 */
	const defaultValue = useMemo(() => {
		const encoded = codeValues.find((c) => c.language === language)?.value || ""
		return decode(encoded) || ""
	}, [codeValues, language])

	// ========================================================================
	// Handlers
	// ========================================================================

	/**
	 * Handler para validación del editor
	 */
	const handleEditorValidation = useCallback((markers: unknown[]) => {
		if (Array.isArray(markers)) {
			markers.forEach((marker) => {
				if (marker && typeof marker === "object" && "message" in marker) {
					console.log("onValidate:", (marker as { message: string }).message)
				}
			})
		}
	}, [])

	// ========================================================================
	// Render
	// ========================================================================

	return (
		<MonacoEditor
			key={language}
			height="100vh"
			width="100%"
			path={language}
			defaultLanguage={language}
			defaultValue={defaultValue}
			theme="OneDarkPro"
			options={monacoOptions}
			onMount={handleEditorDidMount}
			beforeMount={handleEditorWillMount}
			onValidate={handleEditorValidation}
			onChange={handleEditorChange}
		/>
	)
}

export default JsonEditorComponent
