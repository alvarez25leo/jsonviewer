import React from "react"
import ReactDOM from "react-dom/client"
import { MittProvider } from "@/provider/mitt"
import App from "./App.tsx"
import "./index.css"
import "./css/fonts.css"
import { ThemeProvider } from "styled-components"
import { darkTheme } from "./constants/theme.ts"

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<MittProvider>
			<ThemeProvider theme={darkTheme}>
				<App />
			</ThemeProvider>
		</MittProvider>
	</React.StrictMode>
)
