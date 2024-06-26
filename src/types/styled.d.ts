import "styled-components"
import theme from "src/constants/theme"

type CustomTheme = typeof theme

declare module "styled-components" {
	export interface DefaultTheme extends CustomTheme {}
}

declare module "react-syntax-highlighter" {
	export interface SyntaxHighlighterProps {
		language: string
		style: any
	}
}
