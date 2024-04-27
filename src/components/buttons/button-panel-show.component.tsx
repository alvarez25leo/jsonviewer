import { useLocalStorage } from "@/hooks/useLocalStorage.hooks"
import useGraph from "@/store/useGraph"

const ButtonPanelShowComponent = () => {
	const [showPanel, setShowPanel] = useLocalStorage<boolean>("showPanel", true)
	const zoomIn = useGraph((state) => state.zoomIn)

	const handleClickButton = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		zoomIn()
		setShowPanel(!showPanel)
	}

	return (
		<button
			className="fixed bottom-[10px] right-[10px] z-50 flex h-[45px] w-[45px] items-center justify-center rounded-full bg-[#282c34] text-[#cccccc80] shadow-md"
			onClick={handleClickButton}
		>
			{showPanel ? (
				<svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
				</svg>
			) : (
				<svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
				</svg>
			)}
		</button>
	)
}

export default ButtonPanelShowComponent
