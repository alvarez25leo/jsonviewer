import { useState, useCallback } from "react"
import ModalComponent from "../moda.component"
import { modalProps } from "@/types"
import useJson from "@/store/useJson"
import {
	generateMockData,
	GeneratorOptions,
	fakerCategories,
	fakerMethods,
} from "@/lib/utils/mockGenerator"
import { toast } from "sonner"

interface FieldConfig {
	id: string
	name: string
	type: string
	category: string
	method: string
}

export const MockGeneratorModal = ({ opened, onClose }: modalProps) => {
	const setJson = useJson((state) => state.setJson)
	const [count, setCount] = useState(10)
	const [fields, setFields] = useState<FieldConfig[]>([
		{ id: "1", name: "id", type: "number", category: "number", method: "int" },
		{ id: "2", name: "name", type: "string", category: "person", method: "fullName" },
		{ id: "3", name: "email", type: "string", category: "internet", method: "email" },
	])
	const [preview, setPreview] = useState("")

	const addField = () => {
		const newField: FieldConfig = {
			id: Date.now().toString(),
			name: `field${fields.length + 1}`,
			type: "string",
			category: "lorem",
			method: "word",
		}
		setFields([...fields, newField])
	}

	const removeField = (id: string) => {
		setFields(fields.filter((f) => f.id !== id))
	}

	const updateField = (id: string, updates: Partial<FieldConfig>) => {
		setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)))
	}

	const handleGenerate = useCallback(() => {
		try {
			const options: GeneratorOptions = {
				count,
				schema: fields.reduce(
					(acc, field) => {
						acc[field.name] = {
							category: field.category as keyof typeof fakerMethods,
							method: field.method,
						}
						return acc
					},
					{} as GeneratorOptions["schema"]
				),
			}

			const data = generateMockData(options)
			const jsonStr = JSON.stringify(data, null, 2)
			setPreview(jsonStr)
		} catch (err) {
			toast.error(`Error generating data: ${err}`)
		}
	}, [count, fields])

	const handleApply = () => {
		if (!preview) {
			handleGenerate()
			return
		}
		setJson(preview)
		toast.success("Mock data applied!")
		onClose()
	}

	return (
		<ModalComponent
			openModal={opened}
			title="Mock Data Generator"
			closeModal={onClose}
			style={{ minWidth: "700px", minHeight: "80vh" }}
		>
			<div className="flex flex-col gap-4">
				{/* Count */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-300">Number of Records</label>
					<input
						type="number"
						min={1}
						max={1000}
						value={count}
						onChange={(e) => setCount(parseInt(e.target.value) || 1)}
						className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white"
					/>
				</div>

				{/* Fields */}
				<div>
					<div className="mb-2 flex items-center justify-between">
						<label className="text-sm font-medium text-gray-300">Fields</label>
						<button
							onClick={addField}
							className="rounded-md bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
						>
							+ Add Field
						</button>
					</div>

					<div className="custom-scrollbar max-h-[250px] space-y-2 overflow-auto rounded-md bg-[#0d121c] p-3">
						{fields.map((field) => (
							<div key={field.id} className="flex items-center gap-2 rounded-md bg-gray-800 p-2">
								{/* Field Name */}
								<input
									type="text"
									value={field.name}
									onChange={(e) => updateField(field.id, { name: e.target.value })}
									className="w-32 rounded border border-gray-600 bg-gray-900 px-2 py-1 text-sm text-white"
									placeholder="Field name"
								/>

								{/* Category */}
								<select
									value={field.category}
									onChange={(e) => {
										const category = e.target.value
										const methods = fakerMethods[category as keyof typeof fakerMethods] || []
										updateField(field.id, { category, method: methods[0] || "word" })
									}}
									className="w-28 rounded border border-gray-600 bg-gray-900 px-2 py-1 text-sm text-white"
								>
									{fakerCategories.map((cat) => (
										<option key={cat} value={cat}>
											{cat}
										</option>
									))}
								</select>

								{/* Method */}
								<select
									value={field.method}
									onChange={(e) => updateField(field.id, { method: e.target.value })}
									className="flex-1 rounded border border-gray-600 bg-gray-900 px-2 py-1 text-sm text-white"
								>
									{(fakerMethods[field.category as keyof typeof fakerMethods] || []).map((method) => (
										<option key={method} value={method}>
											{method}
										</option>
									))}
								</select>

								{/* Remove */}
								<button
									onClick={() => removeField(field.id)}
									className="rounded bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-700"
								>
									✕
								</button>
							</div>
						))}
					</div>
				</div>

				{/* Buttons */}
				<div className="flex gap-2">
					<button
						onClick={handleGenerate}
						className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
					>
						Generate Preview
					</button>
					<button
						onClick={handleApply}
						className="flex-1 rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
					>
						Apply to Editor
					</button>
				</div>

				{/* Preview */}
				{preview && (
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-300">Preview</label>
						<pre className="custom-scrollbar max-h-[200px] overflow-auto rounded-md bg-[#0d121c] p-4 font-mono text-xs text-gray-300">
							{preview}
						</pre>
					</div>
				)}
			</div>
		</ModalComponent>
	)
}
