import { useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"

interface CopyComponentProps {
	value: string
}

const CopyComponent = ({ value }: CopyComponentProps) => {
	const [copied, setCopied] = useState(false)

	const handleCopy = () => {
		setCopied(true)
		setTimeout(() => {
			setCopied(false)
		}, 3000)
	}

	return (
		<CopyToClipboard text={value} onCopy={handleCopy}>
			<div
				className="relative cursor-pointer"
				style={{
					width: "fit-content",
				}}
			>
				<div className="group">
					<button title="Copy code" className="relative text-white opacity-40 hover:opacity-100 focus:outline-none">
						<svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" height={20} width={20}>
							<path fill="none" d="M0 0h24v24H0z" />
							<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
						</svg>
					</button>
				</div>
				{copied && (
					<span className="absolute right-0 top-full z-10 mt-1 rounded-md bg-[#0ae98a] p-1 text-xs text-black shadow-md">Copied!</span>
				)}
			</div>
		</CopyToClipboard>
	)
}

export default CopyComponent
