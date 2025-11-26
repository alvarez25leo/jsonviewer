import "styled-components"
import { darkTheme } from "@/constants/theme"

type CustomTheme = typeof darkTheme

declare module "styled-components" {
	export interface DefaultTheme extends CustomTheme {}
}

declare module "react-syntax-highlighter" {
	export interface SyntaxHighlighterProps {
		language: string
		style: any
	}
}
