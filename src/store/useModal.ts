import { create } from "zustand"
import { Modal } from "@/types"
import { gaEvent } from "@/lib/utils/gaEvent"

type ModalState = {
	[key in Modal]: boolean
}

interface ModalActions {
	setVisible: (modal: Modal) => (visible: boolean) => void
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
}

const useModal = create<ModalState & ModalActions>()((set) => ({
	...initialStates,
	setVisible: (modal) => (visible) => {
		if (visible) gaEvent("modal", `open ${modal}`)
		set({ [modal]: visible })
	},
}))

export default useModal
