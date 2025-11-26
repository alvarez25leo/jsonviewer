import { useState } from "react"
import ModalComponent from "../moda.component"
import { modalProps } from "@/types"
import useFile from "@/store/useFile"
import useTemplates from "@/store/useTemplates"
import { TemplateCategory, categoryLabels, categoryIcons, getTemplateCategories } from "@/lib/utils/templates"
import { toast } from "sonner"

export const SaveTemplateModal = ({ opened, onClose }: modalProps) => {
	const { getContents } = useFile()
	const { addTemplate } = useTemplates()

	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [category, setCategory] = useState<TemplateCategory>("custom")
	const [tagsInput, setTagsInput] = useState("")
	const [error, setError] = useState("")

	const categories = getTemplateCategories()

	const handleSave = () => {
		// Validation
		if (!name.trim()) {
			setError("Template name is required")
			return
		}

		try {
			const jsonStr = getContents()
			const content = JSON.parse(jsonStr)

			// Parse tags
			const tags = tagsInput
				.split(",")
				.map((t) => t.trim().toLowerCase())
				.filter((t) => t.length > 0)

			// Add template
			addTemplate({
				name: name.trim(),
				description: description.trim() || `Custom template: ${name}`,
				category,
				tags,
				content,
			})

			toast.success(`Template "${name}" saved!`)

			// Reset form
			setName("")
			setDescription("")
			setCategory("custom")
			setTagsInput("")
			setError("")

			onClose()
		} catch (err) {
			setError(`Invalid JSON: ${err instanceof Error ? err.message : String(err)}`)
		}
	}

	const handleClose = () => {
		setName("")
		setDescription("")
		setCategory("custom")
		setTagsInput("")
		setError("")
		onClose()
	}

	return (
		<ModalComponent
			openModal={opened}
			title="💾 Save as Template"
			closeModal={handleClose}
			style={{ minWidth: "500px" }}
		>
			<div className="flex flex-col gap-4">
				{/* Name */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-300">
						Template Name <span className="text-red-400">*</span>
					</label>
					<input
						type="text"
						value={name}
						onChange={(e) => {
							setName(e.target.value)
							setError("")
						}}
						placeholder="My Custom Template"
						className="w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder:text-gray-500"
					/>
				</div>

				{/* Description */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Describe what this template is for..."
						rows={2}
						className="w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder:text-gray-500"
					/>
				</div>

				{/* Category */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-300">Category</label>
					<select
						value={category}
						onChange={(e) => setCategory(e.target.value as TemplateCategory)}
						className="w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-white"
					>
						{categories.map((cat) => (
							<option key={cat} value={cat}>
								{categoryIcons[cat]} {categoryLabels[cat]}
							</option>
						))}
					</select>
				</div>

				{/* Tags */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-300">Tags</label>
					<input
						type="text"
						value={tagsInput}
						onChange={(e) => setTagsInput(e.target.value)}
						placeholder="api, response, user (comma separated)"
						className="w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder:text-gray-500"
					/>
					<p className="mt-1 text-xs text-gray-500">Separate tags with commas for better searchability</p>
				</div>

				{/* Preview tags */}
				{tagsInput && (
					<div className="flex flex-wrap gap-1">
						{tagsInput
							.split(",")
							.map((t) => t.trim())
							.filter((t) => t)
							.map((tag, index) => (
								<span key={index} className="rounded bg-blue-600/30 px-2 py-0.5 text-xs text-blue-300">
									#{tag.toLowerCase()}
								</span>
							))}
					</div>
				)}

				{/* Error */}
				{error && <div className="rounded-md bg-red-900/50 p-3 text-sm text-red-300">{error}</div>}

				{/* Actions */}
				<div className="flex gap-2 pt-2">
					<button
						onClick={handleClose}
						className="flex-1 rounded-md bg-gray-700 px-4 py-2 font-medium text-white hover:bg-gray-600"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
					>
						Save Template
					</button>
				</div>

				{/* Info */}
				<p className="text-center text-xs text-gray-500">
					Templates are saved locally in your browser and will persist between sessions
				</p>
			</div>
		</ModalComponent>
	)
}
