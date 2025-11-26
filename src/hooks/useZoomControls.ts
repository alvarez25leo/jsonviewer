import { useCallback, useEffect, useMemo, useState } from "react"
import useGraph from "@/store/useGraph"

interface UseZoomControlsReturn {
	zoomFactor: number
	displayZoomPercent: number
	zoomIn: () => void
	zoomOut: () => void
	centerView: () => void
	resetZoom: () => void
	setZoomFactor: (factor: number) => void
}

/**
 * Custom hook para controlar el zoom del grafo
 * Proporciona acciones de zoom y el valor actual del zoom
 */
export function useZoomControls(): UseZoomControlsReturn {
	const graphZoomIn = useGraph((state) => state.zoomIn)
	const graphZoomOut = useGraph((state) => state.zoomOut)
	const graphCenterView = useGraph((state) => state.centerView)
	const graphSetZoomFactor = useGraph((state) => state.setZoomFactor)
	const viewPortZoomFactor = useGraph((state) => state.viewPort?.zoomFactor || 1)

	const [tempZoomValue, setTempZoomValue] = useState(viewPortZoomFactor)

	// Sincronizar valor temporal con el zoom del viewport
	useEffect(() => {
		if (!Number.isNaN(viewPortZoomFactor)) {
			setTempZoomValue(viewPortZoomFactor)
		}
	}, [viewPortZoomFactor])

	// Porcentaje de zoom para mostrar
	const displayZoomPercent = useMemo(() => {
		return Math.round(viewPortZoomFactor * 100)
	}, [viewPortZoomFactor])

	// Resetear zoom a 100%
	const resetZoom = useCallback(() => {
		setTempZoomValue(1)
		graphSetZoomFactor(1)
	}, [graphSetZoomFactor])

	// Wrapper para zoom in
	const zoomIn = useCallback(() => {
		graphZoomIn()
	}, [graphZoomIn])

	// Wrapper para zoom out
	const zoomOut = useCallback(() => {
		graphZoomOut()
	}, [graphZoomOut])

	// Wrapper para centrar vista
	const centerView = useCallback(() => {
		graphCenterView()
	}, [graphCenterView])

	// Wrapper para establecer factor de zoom
	const setZoomFactor = useCallback(
		(factor: number) => {
			graphSetZoomFactor(factor)
		},
		[graphSetZoomFactor]
	)

	return {
		zoomFactor: tempZoomValue,
		displayZoomPercent,
		zoomIn,
		zoomOut,
		centerView,
		resetZoom,
		setZoomFactor,
	}
}
