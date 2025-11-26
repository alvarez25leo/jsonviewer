import { useEffect } from "react"
import { Space } from "react-zoomable-ui"
import { useGraphInteraction } from "@/hooks/useGraphInteraction"
import useGraph from "@/store/useGraph"
import useFile from "@/store/useFile"
import { defaultJson } from "@/constants/data/data"
import GraphCanvasComponent from "./canvas/graph-canvas.component"

// ============================================================================
// Types
// ============================================================================

interface GraphViewProps {
	json: string
}

// ============================================================================
// Component
// ============================================================================

/**
 * Componente de vista de grafo para visualizar JSON
 * Proporciona funcionalidades de zoom, pan y navegación
 */
const GraphViewComponent: React.FC<GraphViewProps> = ({ json }) => {
	// Store actions
	const setViewPort = useGraph((state) => state.setViewPort)
	const setContents = useFile((state) => state.setContents)

	// Custom hook para interacciones
	const { bindLongPress, blurOnClick, debouncedOnZoomChange, gesturesEnabled } = useGraphInteraction()

	// ========================================================================
	// Effects
	// ========================================================================

	/**
	 * Sincronizar el contenido JSON con el store
	 */
	useEffect(() => {
		const contentToSet = json === "" ? defaultJson : json
		setContents({ contents: contentToSet, skipUpdate: true })
	}, [json, setContents])

	// ========================================================================
	// Render
	// ========================================================================

	return (
		<div className="json-graph-container relative h-screen w-full overflow-hidden">
			<div className="bg-container-editor-graph relative h-screen w-full overflow-hidden">
				<div
					className="absolute h-screen w-full overflow-hidden"
					onContextMenu={(e) => e.preventDefault()}
					onClick={blurOnClick}
					key={String(gesturesEnabled)}
					{...bindLongPress()}
				>
					<Space
						onUpdated={debouncedOnZoomChange}
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
