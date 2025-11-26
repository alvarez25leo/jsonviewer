export interface modalProps {
	opened: boolean
	onClose: () => void
}

export { NodeModal } from "../components/modal/node-modal"
export { TypeModal } from "../components/modal/type-modal"
export { ExportModal } from "../components/modal/export-modal"
export { TransformModal } from "../components/modal/transform-modal"
export { HistoryModal } from "../components/modal/history-modal"
export { MockGeneratorModal } from "../components/modal/mock-generator-modal"
export { ApiImportModal } from "../components/modal/api-import-modal"
export { JSONPathModal } from "../components/modal/jsonpath-modal"
export { SchemaValidatorModal } from "../components/modal/schema-validator-modal"
export { DiffModal } from "../components/modal/diff-modal"
export { ShortcutsModal } from "../components/modal/shortcuts-modal"
export { TemplatesModal } from "../components/modal/templates-modal"
export { SaveTemplateModal } from "../components/modal/save-template-modal"

type Modal =
	| "clear"
	| "cloud"
	| "download"
	| "import"
	| "account"
	| "node"
	| "share"
	| "jwt"
	| "schema"
	| "cancelPremium"
	| "review"
	| "jq"
	| "type"
	| "export"
	| "transform"
	| "history"
	| "mockGenerator"
	| "apiImport"
	| "jsonpath"
	| "schemaValidator"
	| "diff"
	| "shortcuts"
	| "templates"
	| "saveTemplate"

export type { Modal }
