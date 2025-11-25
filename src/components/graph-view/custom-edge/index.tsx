import { memo } from "react"
import { EdgeProps, Edge } from "reaflow"

const CustomEdgeWrapper = (props: EdgeProps) => {
	const { id, ...rest } = props as any
	return <Edge containerClassName={`edge-${id}`} {...rest} id={id} />
}

export const CustomEdge = memo(CustomEdgeWrapper)
