import { useState, useCallback } from "react"
import ModalComponent from "../moda.component"
import { modalProps } from "@/types"
import useFile from "@/store/useFile"
import useJson from "@/store/useJson"
import { flattenJson, unflattenJson, sortJsonKeys, filterJson, mergeJsonObjects } from "@/lib/utils/transforms"
import { toast } from "sonner"

type TransformType = "flatten" | "unflatten" | "sort" | "filter" | "merge"

const transformOptions: { value: TransformType; label: string; description: string }[] = [
	{ value: "flatten", label: "Flatten", description: "Convert nested objects to flat keys (e.g., 'a.b.c')" },
	{ value: "unflatten", label: "Unflatten", description: "Convert flat keys back to nested objects" },
	{ value: "sort", label: "Sort Keys", description: "Sort object keys alphabetically" },
	{ value: "filter", label: "Filter", description: "Filter properties using a JSONPath expression" },
	{ value: "merge", label: "Merge", description: "Deep merge another JSON object" },
]

export const TransformModal = ({ opened, onClose }: modalProps) => {
	const getContents = useFile((state) => state.getContents)
	const setJson = useJson((state) => state.setJson)
	const [selectedTransform, setSelectedTransform] = useState<TransformType>("flatten")
	const [delimiter, setDelimiter] = useState(".")
	const [filterPath, setFilterPath] = useState("$..*")
	const [mergeJsonInput, setMergeJsonInput] = useState("{}")
	const [preview, setPreview] = useState("")
	const [error, setError] = useState("")

	const handlePreview = useCallback(() => {
		try {
			const jsonStr = getContents()
			const json = JSON.parse(jsonStr)
			let result: unknown

			switch (selectedTransform) {
				case "flatten":
					result = flattenJson(json, delimiter)
					break
				case "unflatten":
					result = unflattenJson(json, delimiter)
					break
				case "sort":
					result = sortJsonKeys(json)
					break
				case "filter":
					result = filterJson(json, filterPath)
					break
				case "merge": {
					const toMerge = JSON.parse(mergeJsonInput)
					result = mergeJsonObjects(json, toMerge)
					break
				}
			}

			setPreview(JSON.stringify(result, null, 2))
			setError("")
		} catch (err) {
			setError(`Error: ${err}`)
			setPreview("")
		}
	}, [getContents, selectedTransform, delimiter, filterPath, mergeJsonInput])

	const handleApply = () => {
		if (!preview) {
			handlePreview()
			return
		}

		try {
			JSON.parse(preview) // Validate
			setJson(preview)
			toast.success("Transformation applied!")
			onClose()
		} catch (err) {
			setError(`Invalid JSON: ${err}`)
		}
	}

	return (
		<ModalComponent
			openModal={opened}
			title="Transform JSON"
			closeModal={onClose}
			style={{ minWidth: "600px", minHeight: "70vh" }}
		>
			<div className="flex flex-col gap-4">
				{/* Transform Selection */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-300">Transformation Type</label>
					<select
						value={selectedTransform}
						onChange={(e) => {
							setSelectedTransform(e.target.value as TransformType)
							setPreview("")
						}}
						className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white"
					>
						{transformOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					<p className="mt-1 text-sm text-gray-400">
						{transformOptions.find((o) => o.value === selectedTransform)?.description}
					</p>
				</div>

				{/* Options for Flatten/Unflatten */}
				{(selectedTransform === "flatten" || selectedTransform === "unflatten") && (
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">Delimiter</label>
						<input
							type="text"
							value={delimiter}
							onChange={(e) => setDelimiter(e.target.value)}
							className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white"
							placeholder="."
						/>
					</div>
				)}

				{/* Options for Filter */}
				{selectedTransform === "filter" && (
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">JSONPath Expression</label>
						<input
							type="text"
							value={filterPath}
							onChange={(e) => setFilterPath(e.target.value)}
							className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white"
							placeholder="$.store.book[*].author"
						/>
						<p className="mt-1 text-xs text-gray-500">Examples: $.store.* | $..author | $.store.book[?(@.price&lt;10)]</p>
					</div>
				)}

				{/* Options for Merge */}
				{selectedTransform === "merge" && (
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">JSON to Merge</label>
						<textarea
							value={mergeJsonInput}
							onChange={(e) => setMergeJsonInput(e.target.value)}
							className="h-32 w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 font-mono text-sm text-white"
							placeholder='{"newKey": "newValue"}'
						/>
					</div>
				)}

				{/* Buttons */}
				<div className="flex gap-2">
					<button
						onClick={handlePreview}
						className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
					>
						Preview
					</button>
					<button
						onClick={handleApply}
						className="flex-1 rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
					>
						Apply
					</button>
				</div>

				{/* Error */}
				{error && <div className="rounded-md bg-red-900/50 p-3 text-red-300">{error}</div>}

				{/* Preview */}
				{preview && (
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">Preview</label>
						<pre className="custom-scrollbar max-h-[300px] overflow-auto rounded-md bg-[#0d121c] p-4 font-mono text-sm text-gray-300">
							{preview}
						</pre>
					</div>
				)}
			</div>
		</ModalComponent>
	)
}
