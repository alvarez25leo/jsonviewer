import { useCallback } from "react"
import { BeforeMount, OnMount } from "@monaco-editor/react"
import { editor as Editor } from "monaco-editor"
import { emmetHTML, emmetCSS, emmetJSX } from "emmet-monaco-es"
import themeOneDarkPro from "@/theme/OneDarkPro.json"
import { registerAutoCompleteHTMLTag } from "@/components/editor/extensions/autocomplete-html-tag"

interface UseMonacoSetupOptions {
	onEditorMount?: (editor: Editor.IStandaloneCodeEditor) => void
}

interface UseMonacoSetupReturn {
	handleEditorWillMount: BeforeMount
	handleEditorDidMount: OnMount
}

/**
 * Custom hook para configurar Monaco Editor
 * Maneja la inicialización del tema, emmet y extensiones
 */
export function useMonacoSetup({ onEditorMount }: UseMonacoSetupOptions = {}): UseMonacoSetupReturn {
	// Configurar Monaco antes de montar
	const handleEditorWillMount: BeforeMount = useCallback((monaco) => {
		// Definir tema personalizado
		monaco.editor.defineTheme("OneDarkPro", themeOneDarkPro as Editor.IStandaloneThemeData)

		// Configurar validación JSON con schemas
		monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
			validate: true,
			schemas: [
				{
					uri: "http://myserver/foo-schema.json",
					fileMatch: ["*"],
					schema: {
						type: "object",
						properties: {
							p1: { enum: ["v1", "v2"] },
							p2: { $ref: "http://myserver/bar-schema.json" },
						},
					},
				},
				{
					uri: "http://myserver/bar-schema.json",
					fileMatch: ["*"],
					schema: {
						type: "object",
						properties: {
							q1: { enum: ["x1", "x2"] },
						},
					},
				},
			],
		})

		// Activar extensiones de emmet
		emmetHTML(monaco)
		emmetCSS(monaco)
		emmetJSX(monaco)

		// Registrar autocompletado de tags HTML
		registerAutoCompleteHTMLTag(monaco)

		// Aplicar tema
		monaco.editor.setTheme("OneDarkPro")
	}, [])

	// Callback cuando el editor está montado
	const handleEditorDidMount: OnMount = useCallback(
		(editor) => {
			onEditorMount?.(editor)
		},
		[onEditorMount]
	)

	return {
		handleEditorWillMount,
		handleEditorDidMount,
	}
}
