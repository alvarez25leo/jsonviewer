import { useCallback, memo } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorage.hooks"
import { ArrowRightIcon, ArrowLeftIcon } from "../icons"

// ============================================================================
// Types
// ============================================================================

interface ToggleButtonProps {
	isOpen: boolean
}

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Renderiza el ícono apropiado basado en el estado del panel
 */
const ToggleIcon: React.FC<ToggleButtonProps> = memo(({ isOpen }) =>
	isOpen ? <ArrowRightIcon size={24} /> : <ArrowLeftIcon size={24} />
)

ToggleIcon.displayName = "ToggleIcon"

// ============================================================================
// Styles
// ============================================================================

const BUTTON_STYLES = [
	"fixed",
	"bottom-[10px]",
	"right-[10px]",
	"z-50",
	"flex",
	"h-[45px]",
	"w-[45px]",
	"items-center",
	"justify-center",
	"rounded-full",
	"bg-[#282c34]",
	"text-[#cccccc80]",
	"shadow-md",
	"transition-transform",
	"hover:scale-105",
	"active:scale-95",
].join(" ")

// ============================================================================
// Main Component
// ============================================================================

/**
 * Botón flotante para mostrar/ocultar el panel lateral
 * Persiste el estado en localStorage
 */
const ButtonPanelShowComponent: React.FC = () => {
	const [showPanel, setShowPanel] = useLocalStorage<boolean>("showPanel", true)

	// ========================================================================
	// Handlers
	// ========================================================================

	const handleTogglePanel = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault()
			setShowPanel((prev) => !prev)
		},
		[setShowPanel]
	)

	// ========================================================================
	// Render
	// ========================================================================

	return (
		<button
			className={BUTTON_STYLES}
			onClick={handleTogglePanel}
			aria-label={showPanel ? "Ocultar panel" : "Mostrar panel"}
			aria-pressed={showPanel}
		>
			<ToggleIcon isOpen={showPanel} />
		</button>
	)
}

export default ButtonPanelShowComponent
