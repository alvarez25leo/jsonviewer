import { useCallback, useEffect, useRef } from "react"
import { encode } from "js-base64"
import { editor as Editor } from "monaco-editor"
import { useMitt } from "@/provider/mitt"
import { languagesType, LanguageValue } from "@/types"
import useFile from "@/store/useFile"

interface UseEditorActionsOptions {
	language: languagesType
	codeValues: LanguageValue[]
	setCodeValues: React.Dispatch<React.SetStateAction<LanguageValue[]>>
}

interface UseEditorActionsReturn {
	editorRef: React.MutableRefObject<Editor.IStandaloneCodeEditor | null>
	handleEditorChange: (value: string | undefined) => void
	formatCode: () => void
}

/**
 * Custom hook para manejar las acciones del Monaco Editor
 * Gestiona cambios, formateo y sincronización con el store
 */
export function useEditorActions({
	language,
	codeValues,
	setCodeValues,
}: UseEditorActionsOptions): UseEditorActionsReturn {
	const editorRef = useRef<Editor.IStandaloneCodeEditor | null>(null)
	const { emitter } = useMitt()
	const setContents = useFile((state) => state.setContents)

	// Formatear código
	const formatCode = useCallback(() => {
		const editor = editorRef.current
		if (!editor) return

		editor.trigger("format", "editor.action.formatDocument", {})

		const model = editor.getModel()
		if (model) {
			const value = model.getValue()
			const valueBase64 = encode(value)
			setCodeValues((prev) => prev.map((c) => (c.language === language ? { language, value: valueBase64 } : c)))
		}
	}, [language, setCodeValues])

	// Manejar cambios en el editor
	const handleEditorChange = useCallback(
		(value: string | undefined) => {
			const editor = editorRef.current
			if (!editor) return

			const currentValue = value || editor.getValue()

			// Sincronizar con el store de archivo si es JSON
			if (language === "json") {
				setContents({ contents: currentValue, skipUpdate: true })
			}

			const valueBase64 = encode(currentValue)
			const exists = codeValues.find((c) => c.language === language)

			if (exists) {
				const updatedValues = codeValues.map((c) => (c.language === language ? { ...c, value: valueBase64 } : c))
				setCodeValues(updatedValues)
			} else {
				setCodeValues((prev) => [...prev, { language, value: valueBase64 }])
			}
		},
		[codeValues, language, setCodeValues, setContents]
	)

	// Suscribirse a eventos del emitter
	useEffect(() => {
		const handleFormatEvent = () => {
			formatCode()
		}

		emitter.on("formatCode", handleFormatEvent)

		return () => {
			emitter.off("formatCode", handleFormatEvent)
		}
	}, [emitter, formatCode])

	return {
		editorRef,
		handleEditorChange,
		formatCode,
	}
}
