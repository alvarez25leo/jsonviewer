import useToggleHide from "@/hooks/useToggleHide"
import useGraph from "@/store/useGraph"
import { useCallback, useState } from "react"
import { ElkRoot, Canvas } from "reaflow"
import { CustomEdge } from "../custom-edge"
import { CustomNode } from "../custom-node"

const layoutOptions = {
	"elk.layered.compaction.postCompaction.strategy": "EDGE_LENGTH",
	"elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
}

const GraphCanvasComponent = () => {
	const { validateHiddenNodes } = useToggleHide()
	const setLoading = useGraph((state) => state.setLoading)
	const centerView = useGraph((state) => state.centerView)
	const direction = useGraph((state) => state.direction)
	const nodes = useGraph((state) => state.nodes)
	const edges = useGraph((state) => state.edges)
	const [paneWidth, setPaneWidth] = useState(2000)
	const [paneHeight, setPaneHeight] = useState(2000)

	const onLayoutChange = useCallback(
		(layout: ElkRoot) => {
			if (layout.width && layout.height) {
				const areaSize = layout.width * layout.height
				const changeRatio = Math.abs((areaSize * 100) / (paneWidth * paneHeight) - 100)

				setPaneWidth(layout.width + 50)
				setPaneHeight((layout.height as number) + 50)

				setTimeout(() => {
					validateHiddenNodes()
					window.requestAnimationFrame(() => {
						if (changeRatio > 70) centerView()
						setLoading(false)
					})
				})
			}
		},
		[paneHeight, paneWidth, centerView, setLoading, validateHiddenNodes]
	)

	return (
		<Canvas
			className="draw-graph"
			onLayoutChange={onLayoutChange}
			node={(p) => <CustomNode {...p} />}
			edge={(p) => <CustomEdge className="edge" {...p} />}
			nodes={nodes}
			edges={edges}
			maxHeight={paneHeight}
			maxWidth={paneWidth}
			height={paneHeight}
			width={paneWidth}
			direction={direction}
			layoutOptions={layoutOptions}
			key={direction}
			pannable={false}
			zoomable={false}
			animated={false}
			readonly={true}
			dragEdge={null}
			dragNode={null}
			fit={true}
		/>
	)
}

export default GraphCanvasComponent
