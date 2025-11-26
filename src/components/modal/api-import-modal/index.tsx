import { useState, useCallback } from "react"
import ModalComponent from "../moda.component"
import { modalProps } from "@/types"
import useJson from "@/store/useJson"
import { toast } from "sonner"

interface FetchOptions {
	method: "GET" | "POST" | "PUT" | "DELETE"
	headers: Record<string, string>
	body?: string
}

export const ApiImportModal = ({ opened, onClose }: modalProps) => {
	const setJson = useJson((state) => state.setJson)
	const [url, setUrl] = useState("")
	const [method, setMethod] = useState<FetchOptions["method"]>("GET")
	const [headers, setHeaders] = useState<{ key: string; value: string }[]>([
		{ key: "Content-Type", value: "application/json" },
	])
	const [body, setBody] = useState("")
	const [loading, setLoading] = useState(false)
	const [preview, setPreview] = useState("")
	const [error, setError] = useState("")

	const addHeader = () => {
		setHeaders([...headers, { key: "", value: "" }])
	}

	const removeHeader = (index: number) => {
		setHeaders(headers.filter((_, i) => i !== index))
	}

	const updateHeader = (index: number, key: string, value: string) => {
		const updated = [...headers]
		updated[index] = { key, value }
		setHeaders(updated)
	}

	const handleFetch = useCallback(async () => {
		if (!url) {
			setError("Please enter a URL")
			return
		}

		setLoading(true)
		setError("")
		setPreview("")

		try {
			const fetchHeaders: Record<string, string> = {}
			headers.forEach(({ key, value }) => {
				if (key.trim()) {
					fetchHeaders[key.trim()] = value
				}
			})

			const options: RequestInit = {
				method,
				headers: fetchHeaders,
			}

			if (method !== "GET" && body) {
				options.body = body
			}

			const response = await fetch(url, options)

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`)
			}

			const data = await response.json()
			const jsonStr = JSON.stringify(data, null, 2)
			setPreview(jsonStr)
		} catch (err) {
			setError(`Error: ${err instanceof Error ? err.message : String(err)}`)
		} finally {
			setLoading(false)
		}
	}, [url, method, headers, body])

	const handleApply = () => {
		if (!preview) {
			handleFetch()
			return
		}

		setJson(preview)
		toast.success("API response imported!")
		onClose()
	}

	return (
		<ModalComponent
			openModal={opened}
			title="Import from API"
			closeModal={onClose}
			style={{ minWidth: "600px", minHeight: "70vh" }}
		>
			<div className="flex flex-col gap-4">
				{/* URL */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-300">URL</label>
					<input
						type="url"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white"
						placeholder="https://api.example.com/data"
					/>
				</div>

				{/* Method */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-300">Method</label>
					<select
						value={method}
						onChange={(e) => setMethod(e.target.value as FetchOptions["method"])}
						className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white"
					>
						<option value="GET">GET</option>
						<option value="POST">POST</option>
						<option value="PUT">PUT</option>
						<option value="DELETE">DELETE</option>
					</select>
				</div>

				{/* Headers */}
				<div>
					<div className="mb-2 flex items-center justify-between">
						<label className="text-sm font-medium text-gray-300">Headers</label>
						<button
							onClick={addHeader}
							className="rounded-md bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
						>
							+ Add Header
						</button>
					</div>
					<div className="space-y-2">
						{headers.map((header, index) => (
							<div key={index} className="flex gap-2">
								<input
									type="text"
									value={header.key}
									onChange={(e) => updateHeader(index, e.target.value, header.value)}
									className="flex-1 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-sm text-white"
									placeholder="Header name"
								/>
								<input
									type="text"
									value={header.value}
									onChange={(e) => updateHeader(index, header.key, e.target.value)}
									className="flex-1 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-sm text-white"
									placeholder="Header value"
								/>
								<button
									onClick={() => removeHeader(index)}
									className="rounded bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-700"
								>
									✕
								</button>
							</div>
						))}
					</div>
				</div>

				{/* Body (for POST/PUT) */}
				{(method === "POST" || method === "PUT") && (
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">Request Body</label>
						<textarea
							value={body}
							onChange={(e) => setBody(e.target.value)}
							className="h-24 w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 font-mono text-sm text-white"
							placeholder='{"key": "value"}'
						/>
					</div>
				)}

				{/* Buttons */}
				<div className="flex gap-2">
					<button
						onClick={handleFetch}
						disabled={loading}
						className={`flex-1 rounded-md px-4 py-2 font-medium transition-colors ${
							loading ? "bg-gray-600 text-gray-400" : "bg-blue-600 text-white hover:bg-blue-700"
						}`}
					>
						{loading ? "Fetching..." : "Fetch"}
					</button>
					<button
						onClick={handleApply}
						disabled={!preview}
						className={`flex-1 rounded-md px-4 py-2 font-medium transition-colors ${
							preview ? "bg-green-600 text-white hover:bg-green-700" : "cursor-not-allowed bg-gray-700 text-gray-500"
						}`}
					>
						Apply to Editor
					</button>
				</div>

				{/* Error */}
				{error && <div className="rounded-md bg-red-900/50 p-3 text-red-300">{error}</div>}

				{/* Preview */}
				{preview && (
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">Response Preview</label>
						<pre className="custom-scrollbar max-h-[200px] overflow-auto rounded-md bg-[#0d121c] p-4 font-mono text-xs text-gray-300">
							{preview}
						</pre>
					</div>
				)}
			</div>
		</ModalComponent>
	)
}
