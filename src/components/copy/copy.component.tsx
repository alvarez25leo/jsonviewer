import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
interface CopyComponentProps {
	value: string
}

const CopyComponent = ({ value }: CopyComponentProps) => {
	const [copied, setCopied] = useState(false)

	const clickCopyToClipboard = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(value)
            toast.success("Copied to clipboard")
			setCopied(true)
		} catch (error) {
			toast.error("Failed to copy to clipboard")
		}
	}, [value])

	useEffect(() => {
		if (copied) {
			const timer = setTimeout(() => {
				setCopied(false)
			}, 500)
			return () => clearTimeout(timer)
		}
	}, [copied])

	return (
		<div
			className="relative cursor-pointer"
			style={{
				width: "fit-content",
			}}
		>
			<div className="group">
				<button
					onClick={clickCopyToClipboard}
					title="Copy code"
					className="relative text-white opacity-40 hover:opacity-100 focus:outline-none"
				>
					<svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" height={20} width={20}>
						<path fill="none" d="M0 0h24v24H0z" />
						<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
					</svg>
				</button>
			</div>
			{copied && <span className="absolute right-0 top-full z-10 mt-1 rounded-md bg-[#0ae98a] p-1 text-xs text-black shadow-md">Copied!</span>}
		</div>
	)
}

export default CopyComponent
