import { useState, useCallback } from "react"
import ModalComponent from "../moda.component"
import { modalProps } from "@/types"
import useFile from "@/store/useFile"
import { queryJsonPath, parseJsonPath } from "@/lib/utils/jsonpath"
import CopyComponent from "@/components/copy/copy.component"
import { toast } from "sonner"

const exampleQueries = [
	{ label: "All properties", query: "$..*" },
	{ label: "Root level keys", query: "$.*" },
	{ label: "All items in array", query: "$[*]" },
	{ label: "First item", query: "$[0]" },
	{ label: "Last item", query: "$[-1:]" },
	{ label: "Specific property", query: "$.propertyName" },
	{ label: "Nested property", query: "$.parent.child" },
	{ label: "Filter by value", query: "$[?(@.price < 10)]" },
	{ label: "Filter with regex", query: "$[?(@.name =~ /^A/)]" },
	{ label: "Multiple conditions", query: "$[?(@.price < 10 && @.category == 'books')]" },
]

export const JSONPathModal = ({ opened, onClose }: modalProps) => {
	const getContents = useFile((state) => state.getContents)
	const [query, setQuery] = useState("$..*")
	const [result, setResult] = useState("")
	const [pathInfo, setPathInfo] = useState<{ paths: string[]; values: unknown[] } | null>(null)
	const [error, setError] = useState("")

	const handleQuery = useCallback(() => {
		try {
			const jsonStr = getContents()
			const json = JSON.parse(jsonStr)

			const queryResult = queryJsonPath(json, query)
			const parsedInfo = parseJsonPath(json, query)

			setResult(JSON.stringify(queryResult, null, 2))
			setPathInfo(parsedInfo)
			setError("")
		} catch (err) {
			setError(`Error: ${err instanceof Error ? err.message : String(err)}`)
			setResult("")
			setPathInfo(null)
		}
	}, [getContents, query])

	const handleExampleClick = (exampleQuery: string) => {
		setQuery(exampleQuery)
	}

	const handleCopyPaths = () => {
		if (pathInfo?.paths) {
			navigator.clipboard.writeText(pathInfo.paths.join("\n"))
			toast.success("Paths copied!")
		}
	}

	return (
		<ModalComponent
			openModal={opened}
			title="JSONPath Query"
			closeModal={onClose}
			style={{ minWidth: "700px", minHeight: "80vh" }}
		>
			<div className="flex flex-col gap-4">
				{/* Query Input */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-300">JSONPath Query</label>
					<div className="flex gap-2">
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleQuery()}
							className="flex-1 rounded-md border border-gray-600 bg-gray-800 px-3 py-2 font-mono text-white"
							placeholder="$.store.book[*].author"
						/>
						<button
							onClick={handleQuery}
							className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
						>
							Execute
						</button>
					</div>
				</div>

				{/* Example Queries */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-300">Examples</label>
					<div className="flex flex-wrap gap-2">
						{exampleQueries.map((example) => (
							<button
								key={example.query}
								onClick={() => handleExampleClick(example.query)}
								className="rounded-md bg-gray-700 px-2 py-1 text-xs text-gray-300 hover:bg-gray-600"
								title={example.query}
							>
								{example.label}
							</button>
						))}
					</div>
				</div>

				{/* Error */}
				{error && <div className="rounded-md bg-red-900/50 p-3 text-red-300">{error}</div>}

				{/* Results */}
				{result && (
					<div className="grid grid-cols-2 gap-4">
						{/* Values */}
						<div>
							<div className="mb-2 flex items-center justify-between">
								<label className="text-sm font-medium text-gray-300">
									Results ({pathInfo?.values.length || 0} matches)
								</label>
								<CopyComponent value={result} />
							</div>
							<pre className="custom-scrollbar max-h-[300px] overflow-auto rounded-md bg-[#0d121c] p-4 font-mono text-xs text-gray-300">
								{result}
							</pre>
						</div>

						{/* Paths */}
						<div>
							<div className="mb-2 flex items-center justify-between">
								<label className="text-sm font-medium text-gray-300">Matched Paths</label>
								<button
									onClick={handleCopyPaths}
									className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-300 hover:bg-gray-600"
								>
									Copy Paths
								</button>
							</div>
							<div className="custom-scrollbar max-h-[300px] overflow-auto rounded-md bg-[#0d121c] p-4">
								{pathInfo?.paths.map((path, index) => (
									<div
										key={index}
										className="mb-1 rounded bg-gray-800 px-2 py-1 font-mono text-xs text-blue-300"
									>
										{path}
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{/* JSONPath Reference */}
				<details className="rounded-md bg-gray-800/50">
					<summary className="cursor-pointer p-3 text-sm font-medium text-gray-300">
						JSONPath Quick Reference
					</summary>
					<div className="grid grid-cols-2 gap-2 p-3 text-xs">
						<code className="text-blue-300">$</code>
						<span className="text-gray-400">Root object</span>
						<code className="text-blue-300">@</code>
						<span className="text-gray-400">Current object</span>
						<code className="text-blue-300">.property</code>
						<span className="text-gray-400">Child property</span>
						<code className="text-blue-300">..property</code>
						<span className="text-gray-400">Recursive descent</span>
						<code className="text-blue-300">[n]</code>
						<span className="text-gray-400">Array index</span>
						<code className="text-blue-300">[*]</code>
						<span className="text-gray-400">All array elements</span>
						<code className="text-blue-300">[start:end]</code>
						<span className="text-gray-400">Array slice</span>
						<code className="text-blue-300">[?(@.prop)]</code>
						<span className="text-gray-400">Filter expression</span>
					</div>
				</details>
			</div>
		</ModalComponent>
	)
}
