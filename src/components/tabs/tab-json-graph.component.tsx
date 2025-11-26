import { useCallback, useMemo } from "react"
import { tabType } from "@/types"
import { CodeIcon, GraphIcon, CompareIcon } from "../icons"

// ============================================================================
// Types
// ============================================================================

interface TabJsonGraphProps {
	currentTab: tabType
	handleTabChange: (tab: tabType) => void
	language: string
}

interface TabConfig {
	id: tabType
	label: string
	icon: React.ReactNode
	disabled?: (language: string) => boolean
}

// ============================================================================
// Constants
// ============================================================================

const TABS_CONFIG: TabConfig[] = [
	{
		id: "code",
		label: "Code",
		icon: <CodeIcon />,
	},
	{
		id: "graph",
		label: "Graph",
		icon: <GraphIcon />,
		disabled: (language) => language !== "json",
	},
	{
		id: "compare",
		label: "Compare",
		icon: <CompareIcon />,
	},
]

// ============================================================================
// Styles
// ============================================================================

const BASE_STYLES = "flex justify-center items-center gap-x-1 px-2 py-1 rounded-md text-[#cccccc80] bg-[#2c3437] w-full"
const ACTIVE_STYLES = "bg-[rgba(255,255,255,.1)] text-[#cccccc]"
const DISABLED_STYLES = "opacity-50 cursor-not-allowed"

// ============================================================================
// Component
// ============================================================================

/**
 * Componente de tabs para alternar entre vistas de código, grafo y comparación
 */
const TabJsonGraphComponent: React.FC<TabJsonGraphProps> = ({
	currentTab,
	handleTabChange,
	language,
}) => {
	// ========================================================================
	// Memoized functions
	// ========================================================================

	/**
	 * Genera las clases CSS para cada tab basado en su estado
	 */
	const getTabClasses = useCallback(
		(tab: tabType, isDisabled: boolean): string => {
			const classes = [BASE_STYLES]

			if (currentTab === tab) {
				classes.push(ACTIVE_STYLES)
			}

			if (isDisabled) {
				classes.push(DISABLED_STYLES)
			}

			return classes.join(" ")
		},
		[currentTab]
	)

	/**
	 * Renderiza los tabs configurados
	 */
	const renderedTabs = useMemo(() => {
		return TABS_CONFIG.map((tab) => {
			const isDisabled = tab.disabled?.(language) ?? false

			return (
				<li key={tab.id}>
					<button
						disabled={isDisabled}
						className={getTabClasses(tab.id, isDisabled)}
						onClick={() => !isDisabled && handleTabChange(tab.id)}
						aria-current={currentTab === tab.id ? "page" : undefined}
					>
						<div>{tab.icon}</div>
						<div>{tab.label}</div>
					</button>
				</li>
			)
		})
	}, [language, currentTab, handleTabChange, getTabClasses])

	// ========================================================================
	// Render
	// ========================================================================

	return (
		<div className="rounded-md bg-[#2c3437] p-1 shadow-sm">
			<ul
				className="grid gap-1 text-sm font-medium text-[#000] dark:text-gray-400"
				style={{ gridTemplateColumns: `repeat(${TABS_CONFIG.length}, 1fr)` }}
				role="tablist"
			>
				{renderedTabs}
			</ul>
		</div>
	)
}

export default TabJsonGraphComponent
