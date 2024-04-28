import { gaEvent } from "@/lib/utils/gaEvent"
import { searchQuery, cleanupHighlight, highlightMatchedNodes } from "@/lib/utils/graph/search"
import useGraph from "@/store/useGraph"
import { useEffect, useState } from "react"
import { useDebouncedValue } from "./useDebouncedValue.hooks"

export const useFocusNode = () => {
	const viewPort = useGraph((state) => state.viewPort)
	const [selectedNode, setSelectedNode] = useState(0)
	const [nodeCount, setNodeCount] = useState(0)
	const [value, setValue] = useState("")
	const [debouncedValue] = useDebouncedValue(value, 600)

	const skip = () => setSelectedNode((current) => (current + 1) % nodeCount)

	useEffect(() => {
		if (!value) {
			cleanupHighlight()
			setSelectedNode(0)
			setNodeCount(0)
			return
		}

		if (!viewPort || !debouncedValue) return
		const matchedNodes: NodeListOf<Element> = searchQuery(`span[data-key*='${debouncedValue}' i]`)
		const matchedNode: Element | null = matchedNodes[selectedNode] || null

		cleanupHighlight()

		if (matchedNode && matchedNode.parentElement) {
			highlightMatchedNodes(matchedNodes, selectedNode)
			setNodeCount(matchedNodes.length)

			viewPort?.camera.centerFitElementIntoView(matchedNode.parentElement, {
				elementExtraMarginForZoom: 400,
			})
		} else {
			setSelectedNode(0)
			setNodeCount(0)
		}

		gaEvent("input", "search node in graph")
	}, [selectedNode, debouncedValue, value, viewPort])

	return [value, setValue, skip, nodeCount, selectedNode] as const
}
