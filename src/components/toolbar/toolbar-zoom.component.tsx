import { useLocalStorage } from "@/hooks/useLocalStorage.hooks"
import useGraph from "@/store/useGraph"
import { useEffect, useState } from "react"

const ToolbarZoomComponent = () => {
	const [showPanel] = useLocalStorage<boolean>("showPanel", true)
	const zoomIn = useGraph((state) => state.zoomIn)
	const zoomOut = useGraph((state) => state.zoomOut)
	const centerView = useGraph((state) => state.centerView)
	const setZoomFactor = useGraph((state) => state.setZoomFactor)

	const zoomFactor = useGraph((state) => state.viewPort?.zoomFactor || 1)
	const [tempZoomValue, setTempZoomValue] = useState(zoomFactor)

	useEffect(() => {
		if (!Number.isNaN(zoomFactor)) setTempZoomValue(zoomFactor)
	}, [zoomFactor])

	const handleResetZoom = () => {
		setTempZoomValue(100 / 100)
		console.log("tempZoomValue", tempZoomValue)
		setZoomFactor(1)
	}

	return (
		<div className={`absolute bottom-2 h-[48px] rounded-[4px]   ${showPanel ? "right-2" : "right-20"}`}>
			<div className="toolbar-zoom-container relative ">
				<div></div>
				<div className="flex gap-x-1">
					<div>
						<button className="button-zoom-list flex h-[44px] w-[44px] items-center justify-center" onClick={() => centerView()}>
							<svg
								viewBox="0 0 24 24"
								aria-hidden="true"
								data-testid="svg-icon"
								focusable="false"
								role="presentation"
                                width={20}
                                height={20}
							>
								<path
									fill="currentColor"
									d="M20 17.614V4.886l-4 1.5v12.728l4-1.5zm-5.373 3.871L9 19.375l-5.649 2.118A1 1 0 0 1 2 20.557V5.693a1 1 0 0 1 .649-.936l5.995-2.249A.973.973 0 0 1 9 2.443a1.069 1.069 0 0 1 .373.072L15 4.625l5.649-2.118A1 1 0 0 1 22 3.443v14.864a1 1 0 0 1-.649.936l-5.995 2.249a.973.973 0 0 1-.356.065.993.993 0 0 1-.373-.072zM14 19.114V6.386l-4-1.5v12.728l4 1.5zM8 4.886l-4 1.5v12.728l4-1.5V4.886z"
								/>
							</svg>
						</button>
					</div>
					<div>
						<button className="button-zoom-list flex h-[44px] w-[44px] items-center justify-center" onClick={() => zoomOut()}>
							<svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
							</svg>
						</button>
					</div>
					<div>
						<button className="button-zoom-list with-text flex h-[44px] w-[44px] items-center justify-center" onClick={() => handleResetZoom()}>
							{Math.round(zoomFactor * 100)}%
						</button>
					</div>
					<div>
						<button className="button-zoom-list flex h-[44px] w-[44px] items-center justify-center" onClick={() => zoomIn()}>
							<svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ToolbarZoomComponent
