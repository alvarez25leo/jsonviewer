import React from "react"
import ReactDOM from "react-dom/client"
import { MittProvider } from "@/provider/mitt"
import App from "./App.tsx"
import "./index.css"
import "./css/fonts.css"
import { ThemeProvider } from "styled-components"
import { darkTheme } from "./constants/theme.ts"

if('serviceWorker' in navigator){
    const pathSw = `${window.location.origin}/service-worker.js`
    console.log('pathSw', pathSw)
    navigator.serviceWorker
        .register(pathSw)
        .then(() => {
            console.log('SW registered: ')
        })
        .catch((e) => {
            console.log('SW registration failed: ', e)
        })
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<MittProvider>
			<ThemeProvider theme={darkTheme}>
				<App />
			</ThemeProvider>
		</MittProvider>
	</React.StrictMode>
)
