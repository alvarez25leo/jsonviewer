import { useState, useCallback } from "react"
import ModalComponent from "../moda.component"
import { modalProps } from "@/types"
import useJson from "@/store/useJson"
import { jsonToYaml, jsonToXml, jsonToCsv, jsonToSql, jsonToZodSchema } from "@/lib/utils/converters"
import CopyComponent from "@/components/copy/copy.component"
import SyntaxHighlighter from "react-syntax-highlighter"
import atomOneDark from "@/theme/editor.json"
import { toast } from "sonner"

type ExportFormat = "yaml" | "xml" | "csv" | "sql" | "zod"

const exportOptions: { value: ExportFormat; label: string; lang: string }[] = [
	{ value: "yaml", label: "YAML", lang: "yaml" },
	{ value: "xml", label: "XML", lang: "xml" },
	{ value: "csv", label: "CSV", lang: "plaintext" },
	{ value: "sql", label: "SQL Schema", lang: "sql" },
	{ value: "zod", label: "Zod Schema", lang: "typescript" },
]

export const ExportModal = ({ opened, onClose }: modalProps) => {
	const getJson = useJson((state) => state.getJson)
	const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("yaml")
	const [result, setResult] = useState("")
	const [error, setError] = useState("")
	const [tableName, setTableName] = useState("my_table")
	const [schemaName, setSchemaName] = useState("MySchema")

	const handleConvert = useCallback(() => {
		try {
			const jsonStr = getJson()
			const json = JSON.parse(jsonStr)
			let output = ""

			switch (selectedFormat) {
				case "yaml":
					output = jsonToYaml(json)
					break
				case "xml":
					output = jsonToXml(json)
					break
				case "csv":
					output = jsonToCsv(json)
					break
				case "sql":
					output = jsonToSql(json, tableName)
					break
				case "zod":
					output = jsonToZodSchema(json, schemaName)
					break
			}

			setResult(output)
			setError("")
		} catch (err) {
			setError(`Error: ${err}`)
			setResult("")
		}
	}, [getJson, selectedFormat, tableName, schemaName])

	const handleDownload = () => {
		if (!result) return

		const extensions: Record<ExportFormat, string> = {
			yaml: "yaml",
			xml: "xml",
			csv: "csv",
			sql: "sql",
			zod: "ts",
		}

		const blob = new Blob([result], { type: "text/plain" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = `export.${extensions[selectedFormat]}`
		a.click()
		URL.revokeObjectURL(url)
		toast.success("File downloaded!")
	}

	const currentLang = exportOptions.find((o) => o.value === selectedFormat)?.lang || "plaintext"

	return (
		<ModalComponent openModal={opened} title="Export JSON" closeModal={onClose} style={{ minWidth: "700px", minHeight: "80vh" }}>
			<div className="flex flex-col gap-4">
				{/* Format Selection */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-300">Export Format</label>
					<div className="flex flex-wrap gap-2">
						{exportOptions.map((option) => (
							<button
								key={option.value}
								onClick={() => setSelectedFormat(option.value)}
								className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
									selectedFormat === option.value
										? "bg-blue-600 text-white"
										: "bg-gray-700 text-gray-300 hover:bg-gray-600"
								}`}
							>
								{option.label}
							</button>
						))}
					</div>
				</div>

				{/* Options for SQL */}
				{selectedFormat === "sql" && (
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">Table Name</label>
						<input
							type="text"
							value={tableName}
							onChange={(e) => setTableName(e.target.value)}
							className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white"
							placeholder="my_table"
						/>
					</div>
				)}

				{/* Options for Zod */}
				{selectedFormat === "zod" && (
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">Schema Name</label>
						<input
							type="text"
							value={schemaName}
							onChange={(e) => setSchemaName(e.target.value)}
							className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white"
							placeholder="MySchema"
						/>
					</div>
				)}

				{/* Convert Button */}
				<button
					onClick={handleConvert}
					className="w-full rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
				>
					Convert
				</button>

				{/* Error */}
				{error && <div className="rounded-md bg-red-900/50 p-3 text-red-300">{error}</div>}

				{/* Result */}
				{result && (
					<div className="relative rounded-md bg-[#1e2229]">
						<div className="absolute right-2 top-2 z-10 flex gap-2">
							<CopyComponent value={result} />
							<button
								onClick={handleDownload}
								className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
							>
								Download
							</button>
						</div>
						<SyntaxHighlighter
							className="custom-scrollbar max-h-[400px] overflow-auto rounded-md !bg-[#0d121c]"
							language={currentLang}
							style={atomOneDark as unknown as Record<string, React.CSSProperties>}
						>
							{result}
						</SyntaxHighlighter>
					</div>
				)}
			</div>
		</ModalComponent>
	)
}
