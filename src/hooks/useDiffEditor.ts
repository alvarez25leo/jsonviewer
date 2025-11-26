import { useCallback, useEffect, useRef, useState } from "react"
import { editor as Editor } from "monaco-editor"
import { useMitt } from "@/provider/mitt"

interface UseDiffEditorOptions {
	initialOriginal: string
	initialModified: string
}

interface UseDiffEditorReturn {
	editorRef: React.MutableRefObject<Editor.IStandaloneDiffEditor | null>
	keyEditor: number
	codeValueCurrent: string
	codeValueModifiedCurrent: string
	setCodeValueCurrent: React.Dispatch<React.SetStateAction<string>>
	setCodeValueModifiedCurrent: React.Dispatch<React.SetStateAction<string>>
	handleEditorDidMount: (editor: Editor.IStandaloneDiffEditor) => void
	formatCode: () => void
	updateOptions: (editor: Editor.IStandaloneDiffEditor) => void
}

/**
 * Custom hook para manejar el Diff Editor
 * Gestiona el estado y acciones del editor de comparación
 */
export function useDiffEditor({ initialOriginal, initialModified }: UseDiffEditorOptions): UseDiffEditorReturn {
	const editorRef = useRef<Editor.IStandaloneDiffEditor | null>(null)
	const { emitter } = useMitt()
	const [keyEditor, setKeyEditor] = useState<number>(0)
	const [codeValueCurrent, setCodeValueCurrent] = useState<string>(initialOriginal)
	const [codeValueModifiedCurrent, setCodeValueModifiedCurrent] = useState<string>(initialModified)

	// Opciones del editor diff
	const editorOptionsDiff = {
		inDiffEditor: true,
		readOnly: false,
	}

	// Actualizar opciones del editor
	const updateOptions = useCallback(
		(editor: Editor.IStandaloneDiffEditor) => {
			if (editor) {
				editor.getOriginalEditor().updateOptions(editorOptionsDiff)
				editor.getModifiedEditor().updateOptions(editorOptionsDiff)
			}
		},
		[editorOptionsDiff]
	)

	// Manejar montaje del editor
	const handleEditorDidMount = useCallback(
		(editor: Editor.IStandaloneDiffEditor) => {
			editorRef.current = editor
			updateOptions(editor)
		},
		[updateOptions]
	)

	// Formatear código en ambos editores
	const formatCode = useCallback(() => {
		const editor = editorRef.current
		if (editor) {
			editor.getOriginalEditor()?.trigger("formatCode", "editor.action.formatDocument", {})
			editor.getModifiedEditor()?.trigger("formatCode", "editor.action.formatDocument", {})
			updateOptions(editor)
		}
	}, [updateOptions])

	// Suscribirse a eventos del emitter
	useEffect(() => {
		const handleFormatEvent = () => {
			formatCode()
		}

		const handleClearEvent = () => {
			setCodeValueCurrent("")
			setCodeValueModifiedCurrent("")
			setKeyEditor((prev) => prev + 1)
		}

		const handleMinifyEvent = () => {
			setKeyEditor((prev) => prev + 1)
			const editor = editorRef.current
			if (editor) {
				updateOptions(editor)
			}
		}

		emitter.on("formatCode", handleFormatEvent)
		emitter.on("clearCode", handleClearEvent)
		emitter.on("minifyCode", handleMinifyEvent)

		return () => {
			emitter.off("formatCode", handleFormatEvent)
			emitter.off("clearCode", handleClearEvent)
			emitter.off("minifyCode", handleMinifyEvent)
		}
	}, [emitter, formatCode, updateOptions])

	// Actualizar opciones después del montaje
	useEffect(() => {
		const timeout = setTimeout(() => {
			const editor = editorRef.current
			if (editor) {
				updateOptions(editor)
			}
		}, 100)

		return () => {
			clearTimeout(timeout)
		}
	}, [updateOptions])

	return {
		editorRef,
		keyEditor,
		codeValueCurrent,
		codeValueModifiedCurrent,
		setCodeValueCurrent,
		setCodeValueModifiedCurrent,
		handleEditorDidMount,
		formatCode,
		updateOptions,
	}
}
