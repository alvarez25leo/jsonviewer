import { create } from "zustand"
import { Modal } from "@/types"
import { gaEvent } from "@/lib/utils/gaEvent"

type ModalState = {
	[key in Modal]: boolean
}

interface ModalActions {
	setVisible: (modal: Modal) => (visible: boolean) => void
	setExport: (visible: boolean) => void
	setTransform: (visible: boolean) => void
	setHistory: (visible: boolean) => void
	setMockGenerator: (visible: boolean) => void
	setApiImport: (visible: boolean) => void
	setJsonpath: (visible: boolean) => void
	setSchemaValidator: (visible: boolean) => void
	setDiff: (visible: boolean) => void
	setShortcuts: (visible: boolean) => void
	setTemplates: (visible: boolean) => void
	setSaveTemplate: (visible: boolean) => void
}

const initialStates: ModalState = {
	clear: false,
	cloud: false,
	download: false,
	import: false,
	account: false,
	node: false,
	share: false,
	jwt: false,
	schema: false,
	cancelPremium: false,
	review: false,
	jq: false,
	type: false,
	export: false,
	transform: false,
	history: false,
	mockGenerator: false,
	apiImport: false,
	jsonpath: false,
	schemaValidator: false,
	diff: false,
	shortcuts: false,
	templates: false,
	saveTemplate: false,
}

const createModalSetter = (set: (partial: Partial<ModalState>) => void, modal: Modal) => (visible: boolean) => {
	if (visible) gaEvent("modal", `open ${modal}`)
	set({ [modal]: visible })
}

const useModal = create<ModalState & ModalActions>()((set) => ({
	...initialStates,
	setVisible: (modal) => (visible) => {
		if (visible) gaEvent("modal", `open ${modal}`)
		set({ [modal]: visible })
	},
	setExport: createModalSetter(set, "export"),
	setTransform: createModalSetter(set, "transform"),
	setHistory: createModalSetter(set, "history"),
	setMockGenerator: createModalSetter(set, "mockGenerator"),
	setApiImport: createModalSetter(set, "apiImport"),
	setJsonpath: createModalSetter(set, "jsonpath"),
	setSchemaValidator: createModalSetter(set, "schemaValidator"),
	setDiff: createModalSetter(set, "diff"),
	setShortcuts: createModalSetter(set, "shortcuts"),
	setTemplates: createModalSetter(set, "templates"),
	setSaveTemplate: createModalSetter(set, "saveTemplate"),
}))

export default useModal
