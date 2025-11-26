import { useLocalStorage } from "@/hooks/useLocalStorage.hooks"
import { useZoomControls } from "@/hooks/useZoomControls"
import useModal from "@/store/useModal"
import { SearchInput } from "../search-input"
import { TypesIcon, CenterViewIcon, ZoomOutIcon, ZoomInIcon } from "../icons"

// ============================================================================
// Types
// ============================================================================

interface ToolbarButtonProps {
	title: string
	onClick: () => void
	children: React.ReactNode
	className?: string
}

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Botón reutilizable para la barra de herramientas de zoom
 */
const ToolbarButton: React.FC<ToolbarButtonProps> = ({ title, onClick, children, className = "" }) => (
	<button
		title={title}
		className={`button-zoom-list flex h-[44px] w-[44px] items-center justify-center ${className}`}
		onClick={onClick}
	>
		{children}
	</button>
)

// ============================================================================
// Main Component
// ============================================================================

/**
 * Componente de barra de herramientas para controles de zoom
 * Incluye búsqueda, generación de tipos, centrar vista y controles de zoom
 */
const ToolbarZoomComponent: React.FC = () => {
	// Estado del panel
	const [showPanel] = useLocalStorage<boolean>("showPanel", true)

	// Modal para generación de tipos
	const setVisible = useModal((state) => state.setVisible)

	// Controles de zoom
	const { displayZoomPercent, zoomIn, zoomOut, centerView, resetZoom } = useZoomControls()

	// ========================================================================
	// Handlers
	// ========================================================================

	const handleGenerateTypes = () => {
		setVisible("type")(true)
	}

	// ========================================================================
	// Render
	// ========================================================================

	return (
		<div className={`absolute bottom-2 z-20 h-[48px] rounded-[4px] ${showPanel ? "right-2" : "right-20"}`}>
			<div className="toolbar-zoom-container relative">
				<div></div>
				<div className="flex gap-x-1">
					{/* Search Input */}
					<SearchInput />

					{/* Generate Types Button */}
					<div>
						<ToolbarButton title="Generate Types" onClick={handleGenerateTypes}>
							<TypesIcon />
						</ToolbarButton>
					</div>

					{/* Center View Button */}
					<div>
						<ToolbarButton title="Center View" onClick={centerView}>
							<CenterViewIcon />
						</ToolbarButton>
					</div>

					{/* Zoom Out Button */}
					<div>
						<ToolbarButton title="Zoom Out" onClick={zoomOut}>
							<ZoomOutIcon />
						</ToolbarButton>
					</div>

					{/* Zoom Percentage Button */}
					<div>
						<ToolbarButton title="Zoom 100%" onClick={resetZoom} className="with-text">
							{displayZoomPercent}%
						</ToolbarButton>
					</div>

					{/* Zoom In Button */}
					<div>
						<ToolbarButton title="Zoom In" onClick={zoomIn}>
							<ZoomInIcon />
						</ToolbarButton>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ToolbarZoomComponent
