import useModal from "@/store/useModal"
import { Modal, modalProps } from "@/types"
import * as Modals from "@/types/modal"

type ModalComponent = { key: Modal; component: React.FC<modalProps> }

const modalComponents: ModalComponent[] = [
	{ key: "node", component: Modals.NodeModal },
	{ key: "type", component: Modals.TypeModal },
	{ key: "export", component: Modals.ExportModal },
	{ key: "transform", component: Modals.TransformModal },
	{ key: "history", component: Modals.HistoryModal },
	{ key: "mockGenerator", component: Modals.MockGeneratorModal },
	{ key: "apiImport", component: Modals.ApiImportModal },
	{ key: "jsonpath", component: Modals.JSONPathModal },
	{ key: "schemaValidator", component: Modals.SchemaValidatorModal },
	{ key: "diff", component: Modals.DiffModal },
	{ key: "shortcuts", component: Modals.ShortcutsModal },
]

const ModalControllerComponent = () => {
	const setVisible = useModal((state) => state.setVisible)
	const nodeOpened = useModal((state) => state.node)
	const typeOpened = useModal((state) => state.type)
	const exportOpened = useModal((state) => state.export)
	const transformOpened = useModal((state) => state.transform)
	const historyOpened = useModal((state) => state.history)
	const mockGeneratorOpened = useModal((state) => state.mockGenerator)
	const apiImportOpened = useModal((state) => state.apiImport)
	const jsonpathOpened = useModal((state) => state.jsonpath)
	const schemaValidatorOpened = useModal((state) => state.schemaValidator)
	const diffOpened = useModal((state) => state.diff)
	const shortcutsOpened = useModal((state) => state.shortcuts)

	const statesMap: Record<string, boolean> = {
		node: nodeOpened,
		type: typeOpened,
		export: exportOpened,
		transform: transformOpened,
		history: historyOpened,
		mockGenerator: mockGeneratorOpened,
		apiImport: apiImportOpened,
		jsonpath: jsonpathOpened,
		schemaValidator: schemaValidatorOpened,
		diff: diffOpened,
		shortcuts: shortcutsOpened,
	}

	return (
		<>
			{modalComponents.map(({ key, component }) => {
				const ModalComponent = component
				const opened = statesMap[key]

				return <ModalComponent key={key} opened={opened} onClose={() => setVisible(key)(false)} />
			})}
		</>
	)
}

export default ModalControllerComponent
