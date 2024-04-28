import ModalComponent from "../moda.component"
import { modalProps } from "@/types"
import SyntaxHighlighter from "react-syntax-highlighter"
import atomOneDark from "@/theme/editor.json"
import useJson from "@/store/useJson"
import { useCallback, useEffect, useMemo, useState } from "react"
import { run } from "json_typegen_wasm"
import CopyComponent from "@/components/copy/copy.component"

enum Language {
	TypeScript = "typescript",
	TypeScript_Combined = "typescript/typealias",
	JSON_SCHEMA = "json_schema",
	Kotlin = "kotlin",
	Rust = "rust",
}

const typeOptions = [
	{
		label: "TypeScript",
		value: Language.TypeScript,
		lang: "typescript",
	},
	{
		label: "TypeScript (combined)",
		value: Language.TypeScript_Combined,
		lang: "typescript",
	},
	{
		label: "JSON Schema",
		value: Language.JSON_SCHEMA,
		lang: "json",
	},
	{
		label: "Kotlin",
		value: Language.Kotlin,
		lang: "kotlin",
	},
	{
		label: "Rust",
		value: Language.Rust,
		lang: "rust",
	},
]

export const TypeModal = ({ opened, onClose }: modalProps) => {
	const getJson = useJson((state) => state.getJson)
	const [type, setType] = useState("")
	const [selectedType] = useState<Language>(Language.TypeScript)
	const [loading, setLoading] = useState(false)

	const editorLanguage = useMemo(() => {
		return typeOptions[typeOptions.findIndex((o) => o.value === selectedType)]?.lang
	}, [selectedType])

	const transformer = useCallback(
		async ({ value }: { value: any }) => {
			return run(
				"Root",
				value,
				JSON.stringify({
					output_mode: selectedType,
				})
			)
		},
		[selectedType]
	)

	useEffect(() => {
		if (opened) {
			try {
				setLoading(true)
				transformer({ value: getJson() }).then(setType)
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}
	}, [getJson, opened, selectedType, transformer])

	return (
		<ModalComponent
			openModal={opened}
			title="Generate Types"
			style={{
				minHeight: "80vh",
			}}
			closeModal={() => onClose()}
		>
			{loading ? (
				<div>
					<div className="flex items-center justify-center">
						<div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-[#1e2229]"></div>
					</div>
					<div className="mt-2 text-center text-[#1e2229]">Generating types...</div>
				</div>
			) : null}
			<div className="mt-2 rounded-md bg-[#1e2229] p-1 relative">
				<SyntaxHighlighter
					className="code-editor-preview-type custom-scrollbar rounded-md"
					language={editorLanguage}
					style={atomOneDark as any}
				>
					{type}
				</SyntaxHighlighter>
                <div className="absolute right-3 top-3">
					<CopyComponent value={type} />
				</div>
			</div>
		</ModalComponent>
	)
}
