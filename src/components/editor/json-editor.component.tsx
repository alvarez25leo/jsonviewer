import MonacoEditor, { OnMount, BeforeMount } from "@monaco-editor/react"
import { editorOptions } from "@/config/config"
import { encode, decode } from "js-base64"
import { useEffect, useRef } from "react"
import themeOneDarkPro from "@/theme/OneDarkPro.json"
// import themeOneDarkPro from "@/theme/OneDarkProV1.json";
import { editor as Editor } from "monaco-editor"
import { emmetHTML, emmetCSS, emmetJSX } from "emmet-monaco-es"
import { useLocalStorage } from "@/hooks/useLocalStorage.hooks"
import { languagesType, LanguageValue } from "@/types/editor.interface"
import { useMitt } from "@/provider/mitt"
import { registerAutoCompleteHTMLTag } from "./extensions/autocomplete-html-tag"
import useFile from "@/store/useFile"

interface JsonEditorComponentProps {
	language: languagesType
	showSidebar?: boolean
}

const JsonEditorComponent = ({ language, showSidebar = true }: JsonEditorComponentProps) => {
	const [codeValues, setCodeValues] = useLocalStorage<LanguageValue[]>("codeEditorValues", [])
	const editorRef = useRef<Editor.IStandaloneCodeEditor | null>(null)
	const { emitter } = useMitt()

    const monacoOptions = {
        ...editorOptions,
        minimap: showSidebar ? editorOptions.minimap : { enabled: false },
    };

	const handleEditorDidMount: OnMount = (editor) => {
		editorRef.current = editor
	}

	const setContents = useFile((state) => state.setContents)

	const handleEditorWillMount: BeforeMount = (monaco) => {
		monaco.editor.defineTheme("OneDarkPro", themeOneDarkPro as Editor.IStandaloneThemeData)
		monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
			validate: true,
			schemas: [
				{
					uri: "http://myserver/foo-schema.json",
					fileMatch: ["*"],
					schema: {
						type: "object",
						properties: {
							p1: {
								enum: ["v1", "v2"],
							},
							p2: {
								$ref: "http://myserver/bar-schema.json",
							},
						},
					},
				},
				{
					uri: "http://myserver/bar-schema.json",
					fileMatch: ["*"],
					schema: {
						type: "object",
						properties: {
							q1: {
								enum: ["x1", "x2"],
							},
						},
					},
				},
			],
		})
		console.log("themeOneDarkPro", themeOneDarkPro)
		emmetHTML(monaco)
		emmetCSS(monaco)
		emmetJSX(monaco)
		registerAutoCompleteHTMLTag(monaco)
		monaco.editor.setTheme("OneDarkPro")
	}

	const handleFormatCode = () => {
		if (editorRef.current) {
			editorRef.current?.trigger("format", "editor.action.formatDocument", {})
			const model = editorRef.current.getModel()
			if (model) {
				const value = model.getValue()
				const valueBase64 = encode(value)
				setCodeValues((prev) => prev.map((c) => (c.language === language ? { language, value: valueBase64 } : c)))
			}
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleEditorValidation = (markers: any[]) => {
		markers.forEach((marker) => console.log("onValidate:", marker.message))
	}

	const handleEditorChange = (value: string | undefined) => {
		const editor = editorRef.current
		if (!editor) return
		const currentValue = value || editor.getValue()

		if (language === "json") {
			setContents({ contents: currentValue, skipUpdate: true })
		}

		const valueBase64 = encode(currentValue)
		const exists = codeValues.find((c) => c.language === language)
		if (exists) {
			const index = codeValues.findIndex((c) => c.language === language)
			codeValues[index].value = valueBase64
			setCodeValues(codeValues)
			return
		}

		setCodeValues((prev) => [...prev, { language: language as languagesType, value: valueBase64 }])
	}

	useEffect(() => {
		const editor = editorRef.current
		if (!editor) return

		const handleEditorChange = () => {
			const currentValue = editor.getValue()
			const valueBase64 = encode(currentValue)
			const exists = codeValues.find((c) => c.language === language)
			if (exists) {
				const index = codeValues.findIndex((c) => c.language === language)
				codeValues[index].value = valueBase64
				setCodeValues(codeValues)
				return
			}
			setCodeValues((prev) => [...prev, { language: language as languagesType, value: valueBase64 }])
		}

		editor.onDidChangeModelContent(handleEditorChange)

		return () => {
			if (editorRef.current) {
				editorRef.current.onDidChangeModelContent(handleEditorChange)
			}
		}
	}, [])

	useEffect(() => {
		emitter.on("formatCode", (event) => {
			console.log("formatCode", event)
			handleFormatCode()
		})

		return () => {
			emitter.off("formatCode", handleFormatCode)
		}
	}, [])

	return (
		<MonacoEditor
			key={language}
			height="100vh"
			width="100%"
			path={language}
			defaultLanguage={language}
			defaultValue={decode(codeValues.find((c) => c.language === language)?.value || "") || ""}
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
