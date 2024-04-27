import useGraph from "@/store/useGraph"
import ModalComponent from "../moda.component"
import { modalProps } from "@/types"
import SyntaxHighlighter from "react-syntax-highlighter"
import atomOneDark from "@/theme/editor.json"

const dataToString = (data: any) => {
	const text = Array.isArray(data) ? Object.fromEntries(data) : data
	const replacer = (_: string, v: string) => {
		if (typeof v === "string") return v.replaceAll('"', "")
		return v
	}

	return JSON.stringify(text, replacer, 2)
}

export const NodeModal = ({ opened, onClose }: modalProps) => {
	const nodeData = useGraph((state) => dataToString(state.selectedNode?.text))
	const path = useGraph((state) => state.selectedNode?.path || "")

	console.log("atomOneDark", JSON.stringify(atomOneDark, null, 2))
	return (
		<ModalComponent openModal={opened} title="Codigo" closeModal={() => onClose()}>
			<div className="mt-1 text-white opacity-45">JSON Content </div>
			<div className="mt-2 rounded-md bg-[#1e2229] p-1">
				<SyntaxHighlighter className="code-editor-preview custom-scrollbar rounded-md" language="json" style={atomOneDark as any}>
					{nodeData}
				</SyntaxHighlighter>
			</div>
			<div className="mt-2 text-white opacity-45">JSON Path</div>
			<div className="custom-scrollbar mt-2 overflow-auto rounded-md bg-[#1e2229] p-3 text-[#0ae98a] opacity-80">{path}</div>
		</ModalComponent>
	)
}
