import { useState, useCallback } from "react"
import ModalComponent from "../moda.component"
import { modalProps } from "@/types"
import { compareJson, formatDiffHtml, DiffSummary } from "@/lib/utils/jsonDiff"

export const DiffModal = ({ opened, onClose }: modalProps) => {
	const [leftJson, setLeftJson] = useState("")
	const [rightJson, setRightJson] = useState("")
	const [diffResult, setDiffResult] = useState<DiffSummary | null>(null)
	const [error, setError] = useState("")

	const handleCompare = useCallback(() => {
		try {
			const left = JSON.parse(leftJson)
			const right = JSON.parse(rightJson)
			const result = compareJson(left, right)
			setDiffResult(result)
			setError("")
		} catch (err) {
			setError(`Parse error: ${err instanceof Error ? err.message : String(err)}`)
			setDiffResult(null)
		}
	}, [leftJson, rightJson])

	const handleSwap = () => {
		const temp = leftJson
		setLeftJson(rightJson)
		setRightJson(temp)
	}

	const handleClear = () => {
		setLeftJson("")
		setRightJson("")
		setDiffResult(null)
		setError("")
	}

	return (
		<ModalComponent
			openModal={opened}
			title="JSON Diff Comparison"
			closeModal={onClose}
			style={{ minWidth: "900px", minHeight: "80vh" }}
		>
			<div className="flex flex-col gap-4">
				{/* JSON Inputs */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">Original JSON</label>
						<textarea
							value={leftJson}
							onChange={(e) => setLeftJson(e.target.value)}
							className="custom-scrollbar h-48 w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 font-mono text-sm text-white"
							placeholder='{"key": "original value"}'
						/>
					</div>
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">Modified JSON</label>
						<textarea
							value={rightJson}
							onChange={(e) => setRightJson(e.target.value)}
							className="custom-scrollbar h-48 w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 font-mono text-sm text-white"
							placeholder='{"key": "modified value"}'
						/>
					</div>
				</div>

				{/* Actions */}
				<div className="flex gap-2">
					<button
						onClick={handleCompare}
						disabled={!leftJson || !rightJson}
						className={`flex-1 rounded-md px-4 py-2 font-medium transition-colors ${
							leftJson && rightJson
								? "bg-blue-600 text-white hover:bg-blue-700"
								: "cursor-not-allowed bg-gray-700 text-gray-500"
						}`}
					>
						Compare
					</button>
					<button
						onClick={handleSwap}
						className="rounded-md bg-gray-600 px-4 py-2 font-medium text-white hover:bg-gray-700"
					>
						⇄ Swap
					</button>
					<button
						onClick={handleClear}
						className="rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
					>
						Clear
					</button>
				</div>

				{/* Error */}
				{error && <div className="rounded-md bg-red-900/50 p-3 text-red-300">{error}</div>}

				{/* Diff Result */}
				{diffResult !== null && (
					<div>
						{/* Stats */}
						<div className="mb-3 flex gap-4">
							<span className="flex items-center gap-1 text-sm">
								<span className="h-3 w-3 rounded bg-green-600"></span>
								<span className="text-green-300">Added: {diffResult.added}</span>
							</span>
							<span className="flex items-center gap-1 text-sm">
								<span className="h-3 w-3 rounded bg-red-600"></span>
								<span className="text-red-300">Removed: {diffResult.removed}</span>
							</span>
							<span className="flex items-center gap-1 text-sm">
								<span className="h-3 w-3 rounded bg-yellow-600"></span>
								<span className="text-yellow-300">Changed: {diffResult.changed}</span>
							</span>
						</div>

						{diffResult.total === 0 ? (
							<div className="rounded-md bg-green-900/30 border border-green-600 p-4 text-center text-green-300">
								✓ No differences found - JSONs are identical
							</div>
						) : (
							<div className="custom-scrollbar max-h-[300px] overflow-auto rounded-md bg-[#0d121c]">
								<div
									className="p-4 font-mono text-sm"
									dangerouslySetInnerHTML={{ __html: formatDiffHtml(diffResult.differences) }}
								/>
							</div>
						)}
					</div>
				)}

				{/* Legend */}
				<details className="rounded-md bg-gray-800/50">
					<summary className="cursor-pointer p-3 text-sm font-medium text-gray-300">
						Diff Legend
					</summary>
					<div className="p-3 text-sm">
						<div className="mb-2 flex items-center gap-2">
							<span className="w-4 text-center text-green-400">+</span>
							<span className="text-gray-300">New property/value added</span>
						</div>
						<div className="mb-2 flex items-center gap-2">
							<span className="w-4 text-center text-red-400">-</span>
							<span className="text-gray-300">Property/value removed</span>
						</div>
						<div className="mb-2 flex items-center gap-2">
							<span className="w-4 text-center text-yellow-400">~</span>
							<span className="text-gray-300">Value changed</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="w-4 text-center text-blue-400">⇆</span>
							<span className="text-gray-300">Array item modified</span>
						</div>
					</div>
				</details>
			</div>
		</ModalComponent>
	)
}
