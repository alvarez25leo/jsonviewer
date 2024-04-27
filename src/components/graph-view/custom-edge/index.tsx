import { memo } from "react"
import { EdgeProps, Edge } from "reaflow"

const CustomEdgeWrapper = (props: EdgeProps) => {
	return <Edge containerClassName={`edge-${props.id}`} {...props} />
}

export const CustomEdge = memo(CustomEdgeWrapper)
