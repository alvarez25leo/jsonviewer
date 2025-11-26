import { useState, useMemo } from "react"
import ModalComponent from "../moda.component"
import { modalProps } from "@/types"
import useJson from "@/store/useJson"
import useFile from "@/store/useFile"
import useTemplates from "@/store/useTemplates"
import useLanguage from "@/hooks/useLanguage"
import {
	Template,
	TemplateCategory,
	predefinedTemplates,
	categoryIcons,
	getTemplateCategories,
	searchTemplates,
} from "@/lib/utils/templates"
import { toast } from "sonner"

export const TemplatesModal = ({ opened, onClose }: modalProps) => {
	const { t } = useLanguage()
	const { setJson } = useJson()
	const { setContents } = useFile()
	const { customTemplates, removeTemplate } = useTemplates()

	const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "all">("all")
	const [searchQuery, setSearchQuery] = useState("")
	const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)

	// Get translated category labels
	const getCategoryLabel = (cat: TemplateCategory) => t(`modals.templates.categories.${cat}`)

	// Get all templates based on filters
	const filteredTemplates = useMemo(() => {
		const allTemplates = [...predefinedTemplates, ...customTemplates.map((t) => ({ ...t, isCustom: true }))]

		let result = allTemplates

		// Filter by category
		if (selectedCategory !== "all") {
			result = result.filter((t) => t.category === selectedCategory)
		}

		// Filter by search query
		if (searchQuery) {
			result = searchTemplates(searchQuery, customTemplates)
			if (selectedCategory !== "all") {
				result = result.filter((t) => t.category === selectedCategory)
			}
		}

		return result
	}, [selectedCategory, searchQuery, customTemplates])

	// Group templates by category for display
	const groupedTemplates = useMemo(() => {
		if (selectedCategory !== "all") {
			return { [selectedCategory]: filteredTemplates }
		}

		return filteredTemplates.reduce(
			(acc, template) => {
				const cat = template.isCustom ? "custom" : template.category
				if (!acc[cat]) acc[cat] = []
				acc[cat].push(template)
				return acc
			},
			{} as Record<string, Template[]>
		)
	}, [filteredTemplates, selectedCategory])

	const handleUseTemplate = (template: Template) => {
		const jsonStr = JSON.stringify(template.content, null, 2)
		setContents({ contents: jsonStr })
		setJson(jsonStr)
		toast.success(t("notifications.templateLoaded", { name: template.name }))
		onClose()
	}

	const handleDeleteTemplate = (template: Template) => {
		if (template.isCustom) {
			removeTemplate(template.id)
			toast.success(t("notifications.deleted"))
			if (previewTemplate?.id === template.id) {
				setPreviewTemplate(null)
			}
		}
	}

	const categories = getTemplateCategories()

	return (
		<ModalComponent
			openModal={opened}
			title={`📚 ${t("modals.templates.title")}`}
			closeModal={onClose}
			style={{ minWidth: "900px", height: "85vh", maxHeight: "85vh" }}
		>
			<div className="flex h-full flex-col gap-4 overflow-hidden">
				{/* Search and Filters */}
				<div className="flex gap-4">
					{/* Search */}
					<div className="flex-1">
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder={t("modals.templates.search")}
							className="w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder:text-gray-500"
						/>
					</div>

					{/* Category Filter */}
					<select
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value as TemplateCategory | "all")}
						className="rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-white"
					>
						<option value="all">{t("modals.templates.allCategories")}</option>
						{categories.map((cat) => (
							<option key={cat} value={cat}>
								{categoryIcons[cat]} {getCategoryLabel(cat)}
							</option>
						))}
					</select>
				</div>

				{/* Category Pills */}
				<div className="flex flex-wrap gap-2">
					<button
						onClick={() => setSelectedCategory("all")}
						className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
							selectedCategory === "all"
								? "bg-blue-600 text-white"
								: "bg-gray-700 text-gray-300 hover:bg-gray-600"
						}`}
					>
						{t("modals.templates.allCategories")}
					</button>
					{categories.map((cat) => (
						<button
							key={cat}
							onClick={() => setSelectedCategory(cat)}
							className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
								selectedCategory === cat
									? "bg-blue-600 text-white"
									: "bg-gray-700 text-gray-300 hover:bg-gray-600"
							}`}
						>
							{categoryIcons[cat]} {getCategoryLabel(cat)}
						</button>
					))}
				</div>

				{/* Main Content */}
				<div className="flex min-h-0 flex-1 gap-4 overflow-hidden">
					{/* Templates List */}
					<div className="custom-scrollbar flex-1 overflow-auto rounded-md bg-gray-800/50 p-4">
						{Object.entries(groupedTemplates).length === 0 ? (
							<div className="py-8 text-center text-gray-500">
								{searchQuery ? t("graph.noResults") : t("graph.noResults")}
							</div>
						) : (
							Object.entries(groupedTemplates).map(([category, templates]) => (
								<div key={category} className="mb-6">
									<h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
										{categoryIcons[category as TemplateCategory]}
										{getCategoryLabel(category as TemplateCategory)}
										<span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs">
											{templates.length}
										</span>
									</h3>
									<div className="grid grid-cols-2 gap-3">
										{templates.map((template) => (
											<div
												key={template.id}
												onClick={() => setPreviewTemplate(template)}
												className={`cursor-pointer rounded-lg border p-3 transition-all ${
													previewTemplate?.id === template.id
														? "border-blue-500 bg-blue-900/30"
														: "border-gray-700 bg-gray-800 hover:border-gray-600"
												}`}
											>
												<div className="mb-1 flex items-start justify-between">
													<h4 className="font-medium text-white">{template.name}</h4>
													{template.isCustom && (
														<span className="rounded bg-yellow-600/30 px-1.5 py-0.5 text-xs text-yellow-300">
															Custom
														</span>
													)}
												</div>
												<p className="mb-2 line-clamp-2 text-xs text-gray-400">
													{template.description}
												</p>
												<div className="flex flex-wrap gap-1">
													{template.tags.slice(0, 3).map((tag) => (
														<span
															key={tag}
															className="rounded bg-gray-700 px-1.5 py-0.5 text-xs text-gray-400"
														>
															{tag}
														</span>
													))}
													{template.tags.length > 3 && (
														<span className="text-xs text-gray-500">
															+{template.tags.length - 3}
														</span>
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							))
						)}
					</div>

					{/* Preview Panel */}
					<div className="flex w-80 flex-col rounded-md border border-gray-700 bg-gray-800/50">
						{previewTemplate ? (
							<>
								<div className="border-b border-gray-700 p-4">
									<h3 className="mb-1 text-lg font-semibold text-white">{previewTemplate.name}</h3>
									<p className="text-sm text-gray-400">{previewTemplate.description}</p>
									<div className="mt-2 flex flex-wrap gap-1">
										{previewTemplate.tags.map((tag) => (
											<span
												key={tag}
												className="rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-300"
											>
												#{tag}
											</span>
										))}
									</div>
								</div>

								<div className="custom-scrollbar flex-1 overflow-auto p-4">
									<pre className="text-xs text-gray-300">
										{JSON.stringify(previewTemplate.content, null, 2)}
									</pre>
								</div>

								<div className="border-t border-gray-700 p-4">
									<button
										onClick={() => handleUseTemplate(previewTemplate)}
										className="mb-2 w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
									>
										{t("modals.templates.useTemplate")}
									</button>
									{previewTemplate.isCustom && (
										<button
											onClick={() => handleDeleteTemplate(previewTemplate)}
											className="w-full rounded-md bg-red-600/30 px-4 py-2 text-sm text-red-300 hover:bg-red-600/50"
										>
											{t("modals.templates.deleteTemplate")}
										</button>
									)}
								</div>
							</>
						) : (
							<div className="flex flex-1 items-center justify-center p-4 text-center text-gray-500">
								<div>
									<div className="mb-2 text-4xl">📋</div>
									<p>{t("modals.templates.selectToPreview")}</p>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Stats Footer */}
				<div className="flex items-center justify-between border-t border-gray-700 pt-3 text-sm text-gray-500">
					<span>
						{t("modals.templates.predefined", { count: predefinedTemplates.length })} • {t("modals.templates.custom", { count: customTemplates.length })}
					</span>
					<span>{t("modals.templates.clickToPreview")}</span>
				</div>
			</div>
		</ModalComponent>
	)
}
