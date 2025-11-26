import { languagesType } from "@/types"

/**
 * Lista de lenguajes soportados por el editor
 */
export const SUPPORTED_LANGUAGES: readonly languagesType[] = [
	"json",
	"javascript",
	"typescript",
	"html",
	"css",
	"scss",
	"sql",
	"yaml",
	"xml",
] as const

/**
 * Configuración de estilos para botones
 */
export const BUTTON_STYLES = {
	base: "pointer-events-auto flex items-center justify-center rounded-md bg-[#2c3437] text-[0.8125rem] font-semibold leading-5 text-[#cccccc80] hover:bg-[#4d5565] hover:text-[#c5c5c5]",
	active: "bg-[#545e71] text-[#cccccc]",
	withGap: "gap-x-1",
	padding: {
		sm: "px-2 py-1",
		md: "px-3 py-[2px]",
	},
} as const

/**
 * Configuración del panel lateral
 */
export const PANEL_CONFIG = {
	width: 350,
	minWidth: 0,
} as const
