import useModal from "@/store/useModal"
import { Modal, modalProps } from "@/types"
import * as Modals from "@/types/modal"

type ModalComponent = { key: Modal; component: React.FC<modalProps> }

const modalComponents: ModalComponent[] = [
	{ key: "node", component: Modals.NodeModal },
	{ key: "type", component: Modals.TypeModal },
]

const ModalControllerComponent = () => {
	const setVisible = useModal((state) => state.setVisible)
	const nodeOpened = useModal((state) => state.node)
	const typeOpened = useModal((state) => state.type)

	const statesMap: Record<string, boolean> = {
		node: nodeOpened,
		type: typeOpened,
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
