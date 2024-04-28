import useGraph from "@/store/useGraph"
import { useCallback, useEffect } from "react"
import { useLongPress } from "use-long-press"
import debounce from "lodash.debounce"
import { Space } from "react-zoomable-ui"
import GraphCanvasComponent from "./canvas/graph-canvas.component"
import useFile from "@/store/useFile"
import useConfig from "@/store/useConfig"

interface GraphViewProps {
	json: string
}

const GraphViewComponent = ({ json }: GraphViewProps) => {
	const setViewPort = useGraph((state) => state.setViewPort)
	const viewPort = useGraph((state) => state.viewPort)
	const gesturesEnabled = useConfig((state) => state.gesturesEnabled)
	const setContents = useFile((state) => state.setContents)

	const callback = useCallback(() => {
		const canvas = document.querySelector(".draw-graph") as HTMLDivElement | null
		canvas?.classList.add("dragging")
	}, [])

	const bindLongPress = useLongPress(callback, {
		threshold: 150,
		onFinish: () => {
			const canvas = document.querySelector(".draw-graph") as HTMLDivElement | null
			canvas?.classList.remove("dragging")
		},
	})

	const blurOnClick = useCallback(() => {
		if ("activeElement" in document) (document.activeElement as HTMLElement)?.blur()
	}, [])

	const debouncedOnZoomChangeHandler = debounce(() => {
		setViewPort(viewPort!)
	}, 300)

	useEffect(() => {
        if(json === "") return
		setContents({ contents: json, skipUpdate: true })
	}, [json])

	return (
		<div className="json-graph-container relative h-screen w-full overflow-hidden">
			<div className="bg-container-editor-graph relative h-screen w-full  overflow-hidden">
				<div
					className="absolute h-screen w-full overflow-hidden"
					onContextMenu={(e) => e.preventDefault()}
					onClick={blurOnClick}
					key={String(gesturesEnabled)}
					{...bindLongPress()}
				>
					<Space
						onUpdated={() => debouncedOnZoomChangeHandler()}
						onCreate={setViewPort}
						onContextMenu={(e) => e.preventDefault()}
						treatTwoFingerTrackPadGesturesLikeTouch={gesturesEnabled}
						pollForElementResizing
						className="graph-space h-screen w-full overflow-hidden"
					>
						<GraphCanvasComponent />
					</Space>
				</div>
			</div>
		</div>
	)
}

export default GraphViewComponent
