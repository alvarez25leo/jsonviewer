import ModalControllerComponent from "../container/modal-controller.component"
import GraphViewComponent from "../graph-view"

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
		</>
	)
}

export default JsonGraphComponent
