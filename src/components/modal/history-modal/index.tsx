import ModalComponent from "../moda.component"
import { modalProps } from "@/types"
import useHistory from "@/store/useHistory"
import useJson from "@/store/useJson"
import { toast } from "sonner"

export const HistoryModal = ({ opened, onClose }: modalProps) => {
	const { history, currentIndex, canUndo, canRedo, undo, redo, clearHistory, goToState } = useHistory()
	const setJson = useJson((state) => state.setJson)

	const handleUndo = () => {
		const state = undo()
		if (state) {
			setJson(state.content)
			toast.success("Undo successful")
		}
	}

	const handleRedo = () => {
		const state = redo()
		if (state) {
			setJson(state.content)
			toast.success("Redo successful")
		}
	}

	const handleGoToState = (index: number) => {
		const state = goToState(index)
		if (state) {
			setJson(state.content)
			toast.success(`Restored to: ${state.label}`)
		}
	}

	const formatDate = (timestamp: number) => {
		return new Date(timestamp).toLocaleString()
	}

	return (
		<ModalComponent openModal={opened} title="History" closeModal={onClose} style={{ minWidth: "500px", minHeight: "60vh" }}>
			<div className="flex flex-col gap-4">
				{/* Actions */}
				<div className="flex gap-2">
					<button
						onClick={handleUndo}
						disabled={!canUndo()}
						className={`flex-1 rounded-md px-4 py-2 font-medium transition-colors ${
							canUndo()
								? "bg-blue-600 text-white hover:bg-blue-700"
								: "cursor-not-allowed bg-gray-700 text-gray-500"
						}`}
					>
						↶ Undo
					</button>
					<button
						onClick={handleRedo}
						disabled={!canRedo()}
						className={`flex-1 rounded-md px-4 py-2 font-medium transition-colors ${
							canRedo()
								? "bg-blue-600 text-white hover:bg-blue-700"
								: "cursor-not-allowed bg-gray-700 text-gray-500"
						}`}
					>
						↷ Redo
					</button>
					<button
						onClick={clearHistory}
						className="rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
					>
						Clear
					</button>
				</div>

				{/* History List */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-300">
						History ({history.length} states)
					</label>
					<div className="custom-scrollbar max-h-[400px] overflow-auto rounded-md bg-[#0d121c]">
						{history.length === 0 ? (
							<div className="p-4 text-center text-gray-500">No history available</div>
						) : (
							<ul className="divide-y divide-gray-800">
								{history.map((state, index) => (
									<li
										key={state.id}
										onClick={() => handleGoToState(index)}
										className={`cursor-pointer p-3 transition-colors hover:bg-gray-800 ${
											index === currentIndex ? "bg-blue-900/30 border-l-2 border-blue-500" : ""
										}`}
									>
										<div className="flex items-center justify-between">
											<span className="font-medium text-gray-200">
												{index === currentIndex && "● "}
												{state.label}
											</span>
											<span className="text-xs text-gray-500">{formatDate(state.timestamp)}</span>
										</div>
										<div className="mt-1 text-xs text-gray-500">
											{state.content.length} characters
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				{/* Keyboard Shortcuts Info */}
				<div className="rounded-md bg-gray-800/50 p-3">
					<p className="text-sm text-gray-400">
						<span className="font-medium text-gray-300">Keyboard Shortcuts:</span>
						<br />
						Ctrl+Z - Undo | Ctrl+Shift+Z - Redo
					</p>
				</div>
			</div>
		</ModalComponent>
	)
}
