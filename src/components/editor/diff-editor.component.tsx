import { BeforeMount, DiffEditor as MonacoDiffEditor, DiffOnMount } from "@monaco-editor/react"
import { editorOptions } from "@/config/config"
import { editor as Editor } from "monaco-editor"
import themeOneDarkPro from "@/theme/OneDarkPro.json"
import { useEffect, useRef, useState } from "react"
import { useMitt } from "@/provider/mitt"

interface DiffEditorComponentProps {
	codeValue: string
	codeValueModified: string
	language: string
}

const DiffEditorComponent = ({ codeValue, codeValueModified, language }: DiffEditorComponentProps) => {
	const editorOptionsDiffEditor = {
		inDiffEditor: true,
		readOnly: false,
	}
	const { emitter } = useMitt()
	const editorRef = useRef<Editor.IStandaloneDiffEditor | null>(null)
	const [keyEditor, setKeyEditor] = useState<number>(0)
	const [codeValueCurrent, setCodeValueCurrent] = useState<string>(codeValue)
	const [codeValueModifiedCurrent, setCodeValueModifiedCurrent] = useState<string>(codeValueModified)

	const options: Editor.IEditorOptions & Editor.IGlobalEditorOptions = {
		...editorOptions,
		...editorOptionsDiffEditor,
	}

	const updateOptions = (editor: Editor.IStandaloneDiffEditor) => {
		if (editor) {
			editor.getOriginalEditor().updateOptions(options)
			editor.getModifiedEditor().updateOptions(options)
		}
	}

	const handleEditorDidMount: DiffOnMount = (editor) => {
		editorRef.current = editor
		updateOptions(editor)
	}

	const handleEditorWillMount: BeforeMount = (monaco) => {
		monaco.editor.defineTheme("OneDarkPro", themeOneDarkPro as Editor.IStandaloneThemeData)
	}

	const handleFormatCode = () => {
		const editor = editorRef.current
		if (editor) {
			editor.getOriginalEditor()?.trigger("formatCode", "editor.action.formatDocument", {})
			editor.getModifiedEditor()?.trigger("formatCode", "editor.action.formatDocument", {})
			updateOptions(editor)
		}
	}

	useEffect(() => {
		emitter.on("formatCode", () => {
			handleFormatCode()
		})

		emitter.on("clearCode", (event) => {
			console.log("clearCode", event)
			setCodeValueCurrent("")
			setCodeValueModifiedCurrent("")
			setKeyEditor((prev) => prev + 1)
		})
		emitter.on("minifyCode", (event) => {
			console.log("minifyCode", event)
			setKeyEditor((prev) => prev + 1)
			const editor = editorRef.current
			if (editor) {
				updateOptions(editor)
			}
		})

		return () => {
			emitter.off("formatCode", handleFormatCode)
			emitter.off("clearCode", handleFormatCode)
		}
	}, [])

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
	}, [])

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
			options={{
				...editorOptions,
				...editorOptionsDiffEditor,
			}}
			onMount={handleEditorDidMount}
			beforeMount={handleEditorWillMount}
		/>
	)
}

export default DiffEditorComponent
