import { useCallback, useMemo } from "react"
import debounce from "lodash.debounce"
import { useLongPress } from "use-long-press"
import useGraph from "@/store/useGraph"
import useConfig from "@/store/useConfig"

interface UseGraphInteractionReturn {
	bindLongPress: ReturnType<typeof useLongPress>
	blurOnClick: () => void
	debouncedOnZoomChange: () => void
	gesturesEnabled: boolean
}

/**
 * Custom hook para manejar las interacciones del grafo
 * Gestiona long press, blur y eventos de zoom
 */
export function useGraphInteraction(): UseGraphInteractionReturn {
	const setViewPort = useGraph((state) => state.setViewPort)
	const viewPort = useGraph((state) => state.viewPort)
	const gesturesEnabled = useConfig((state) => state.gesturesEnabled)

	// Callback para long press - añade clase de arrastre
	const handleLongPressStart = useCallback(() => {
		const canvas = document.querySelector(".draw-graph") as HTMLDivElement | null
		canvas?.classList.add("dragging")
	}, [])

	// Callback para finalizar long press
	const handleLongPressFinish = useCallback(() => {
		const canvas = document.querySelector(".draw-graph") as HTMLDivElement | null
		canvas?.classList.remove("dragging")
	}, [])

	// Configurar long press
	const bindLongPress = useLongPress(handleLongPressStart, {
		threshold: 150,
		onFinish: handleLongPressFinish,
	})

	// Desenfocar elemento activo al hacer click
	const blurOnClick = useCallback(() => {
		if ("activeElement" in document) {
			;(document.activeElement as HTMLElement)?.blur()
		}
	}, [])

	// Debounce para manejar cambios de zoom
	const debouncedOnZoomChange = useMemo(
		() =>
			debounce(() => {
				if (viewPort) {
					setViewPort(viewPort)
				}
			}, 300),
		[setViewPort, viewPort]
	)

	return {
		bindLongPress,
		blurOnClick,
		debouncedOnZoomChange,
		gesturesEnabled,
	}
}
