import { useEffect, useRef, ReactNode } from "react"

interface ModalComponentProps {
	title?: string
	openModal: boolean
	closeModal: () => void
	children: ReactNode
	style?: React.CSSProperties
	className?: string
}
const ModalComponent = ({ openModal, closeModal, children, title, style, className }: ModalComponentProps) => {
	const ref = useRef<HTMLDialogElement>(null)

	useEffect(() => {
		if (openModal) {
			ref.current?.showModal()
		} else {
			ref.current?.close()
		}
	}, [openModal])

	return (
		<dialog
			className={`modal-dialog overflow-hidden rounded-lg p-3 shadow-lg ${className || ""}`}
			modal-mode="mega"
			ref={ref}
			style={style}
			onCancel={closeModal}
		>
			<div className="relative h-full w-full ">
				<div
					className="mb-2 grid w-full"
					style={{
						gridTemplateColumns: "1fr 35px",
					}}
				>
					<div>{title && <h2 className="title-modal text-lg font-bold opacity-80">{title}</h2>}</div>
					<div className="flex w-full">
						<button
							onClick={closeModal}
							className="flex h-[35px] w-[35px] items-center justify-center rounded-[8px] border-0 bg-[#13161ccc]  text-white outline-0 "
						>
							<svg viewBox="0 0 16 16" fill="currentColor" width={14} height={14} className="opacity-80 hover:opacity-100">
								<path d="M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z" />
							</svg>
						</button>
					</div>
				</div>
				<div className="w-full overflow-auto" style={{ height: 'calc(100% - 50px)' }}>{children}</div>
			</div>
		</dialog>
	)
}

export default ModalComponent
