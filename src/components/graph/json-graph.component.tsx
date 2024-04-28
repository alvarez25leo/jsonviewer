import ModalControllerComponent from "../container/modal-controller.component"
import GraphViewComponent from "../graph-view"
import ToolbarZoomComponent from "../toolbar/toolbar-zoom.component"

interface JsonGraphProps {
	json: string
}

const JsonGraphComponent = ({ json }: JsonGraphProps) => {
	return (
		<>
			<div className=" h-screen">
				<GraphViewComponent json={json} />
			</div>
			<ModalControllerComponent />
            <ToolbarZoomComponent />
		</>
	)
}

export default JsonGraphComponent
