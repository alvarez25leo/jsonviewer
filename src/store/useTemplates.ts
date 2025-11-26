import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Template, generateTemplateId } from "@/lib/utils/templates"

interface TemplatesState {
	customTemplates: Template[]
}

interface TemplatesActions {
	addTemplate: (template: Omit<Template, "id" | "isCustom" | "createdAt">) => Template
	removeTemplate: (id: string) => void
	updateTemplate: (id: string, updates: Partial<Template>) => void
	getCustomTemplates: () => Template[]
	clearAllCustom: () => void
}

const initialState: TemplatesState = {
	customTemplates: [],
}

const useTemplates = create<TemplatesState & TemplatesActions>()(
	persist(
		(set, get) => ({
			...initialState,

			addTemplate: (templateData) => {
				const newTemplate: Template = {
					...templateData,
					id: generateTemplateId(),
					isCustom: true,
					createdAt: new Date().toISOString(),
				}

				set((state) => ({
					customTemplates: [newTemplate, ...state.customTemplates],
				}))

				return newTemplate
			},

			removeTemplate: (id) => {
				set((state) => ({
					customTemplates: state.customTemplates.filter((t) => t.id !== id),
				}))
			},

			updateTemplate: (id, updates) => {
				set((state) => ({
					customTemplates: state.customTemplates.map((t) => (t.id === id ? { ...t, ...updates } : t)),
				}))
			},

			getCustomTemplates: () => get().customTemplates,

			clearAllCustom: () => {
				set({ customTemplates: [] })
			},
		}),
		{
			name: "jsonviewer-templates",
			version: 1,
		}
	)
)

export default useTemplates
