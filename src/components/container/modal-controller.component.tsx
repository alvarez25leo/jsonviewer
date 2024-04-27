import useModal from "@/store/useModal"
import { Modal, modalProps } from "@/types"
import * as Modals from "@/types/modal"

type ModalComponent = { key: Modal; component: React.FC<modalProps> }

const modalComponents: ModalComponent[] = [{ key: "node", component: Modals.NodeModal }]

const ModalControllerComponent = () => {
	const setVisible = useModal((state) => state.setVisible)
	const modalStates = useModal((state) => modalComponents.map((modal) => state[modal.key]))

	return (
		<>
			{modalComponents.map(({ key, component }, index) => {
				const ModalComponent = component
				const opened = modalStates[index]

				return <ModalComponent key={key} opened={opened} onClose={() => setVisible(key)(false)} />
			})}
		</>
	)
}

export default ModalControllerComponent
