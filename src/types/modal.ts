export interface modalProps {
	opened: boolean
	onClose: () => void
}

export { NodeModal } from "../components/modal/node-modal"

type Modal = "clear" | "cloud" | "download" | "import" | "account" | "node" | "share" | "jwt" | "schema" | "cancelPremium" | "review" | "jq" | "type"

export type { Modal }
