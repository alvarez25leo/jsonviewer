import { BeforeMount, DiffEditor as MonacoDiffEditor } from "@monaco-editor/react"
import { editor as Editor } from "monaco-editor"
import { editorOptions } from "@/config/config"
import { useDiffEditor } from "@/hooks/useDiffEditor"
import themeOneDarkPro from "@/theme/OneDarkPro.json"

// ============================================================================
// Types
// ============================================================================

interface DiffEditorComponentProps {
	codeValue: string
	codeValueModified: string
	language: string
}

// ============================================================================
// Constants
// ============================================================================

const DIFF_EDITOR_OPTIONS = {
	inDiffEditor: true,
	readOnly: false,
}

// ============================================================================
// Component
// ============================================================================

/**
 * Componente de editor de diferencias basado en Monaco Editor
 * Permite comparar dos versiones de código lado a lado
 */
const DiffEditorComponent: React.FC<DiffEditorComponentProps> = ({
	codeValue,
	codeValueModified,
	language,
}) => {
	// Custom hook para manejar el diff editor
	const {
		keyEditor,
		codeValueCurrent,
		codeValueModifiedCurrent,
		handleEditorDidMount,
	} = useDiffEditor({
		initialOriginal: codeValue,
		initialModified: codeValueModified,
	})

	// ========================================================================
	// Handlers
	// ========================================================================

	/**
	 * Configurar Monaco antes de montar el editor
	 */
	const handleEditorWillMount: BeforeMount = (monaco) => {
		monaco.editor.defineTheme("OneDarkPro", themeOneDarkPro as Editor.IStandaloneThemeData)
	}

	// ========================================================================
	// Computed values
	// ========================================================================

	const combinedOptions = {
		...editorOptions,
		...DIFF_EDITOR_OPTIONS,
	}

	// ========================================================================
	// Render
	// ========================================================================

	return (
		<MonacoDiffEditor
			key={`${language}${keyEditor}`}
			height="100vh"
			width="100%"
			theme="OneDarkPro"
			original={codeValueCurrent || ""}
			modified={codeValueModifiedCurrent || ""}
			language={language}
			originalLanguage={language}
			options={combinedOptions}
			onMount={handleEditorDidMount}
			beforeMount={handleEditorWillMount}
		/>
	)
}

export default DiffEditorComponent
