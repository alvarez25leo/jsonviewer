import { useCallback, memo } from "react"
import { NodeProps, Node } from "reaflow"
import { ObjectNode } from "./ObjectNode"
import { TextNode } from "./TextNode"
import { NodeData } from "@/types"
import useGraph from "@/store/useGraph"
import useModal from "@/store/useModal"

export interface CustomNodeProps {
	node: NodeData
	x: number
	y: number
	hasCollapse?: boolean
}

const rootProps = {
	rx: 50,
	ry: 50,
}

const CustomNodeWrapper = (nodeProps: NodeProps<NodeData["data"]>) => {
	const data = nodeProps.properties.data
	const setSelectedNode = useGraph((state) => state.setSelectedNode)
	const setVisible = useModal((state) => state.setVisible)

	const handleNodeClick = useCallback(
		(_: React.MouseEvent<SVGGElement, MouseEvent>, data: NodeData) => {
			console.log("data =>", data)
			if (setSelectedNode) setSelectedNode(data)
			setVisible("node")(true)
		},
		[setSelectedNode, setVisible]
	)

	return (
		<Node {...nodeProps} {...(data?.isEmpty && rootProps)} onClick={handleNodeClick as any} animated={false} label={null as any}>
			{({ node, x, y }) => {
				if (Array.isArray(nodeProps.properties.text)) {
					if (data?.isEmpty) return null
					return <ObjectNode node={node as NodeData} x={x} y={y} />
				}

				return <TextNode node={node as NodeData} hasCollapse={!!data?.childrenCount} x={x} y={y} />
			}}
		</Node>
	)
}

export const CustomNode = memo(CustomNodeWrapper)
