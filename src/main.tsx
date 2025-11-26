import React from "react"
import ReactDOM from "react-dom/client"
import { MittProvider } from "@/provider/mitt"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./App.tsx"
import EditorGraphPage from "./pages/editor-graph.page"
import "./index.css"
import "./css/fonts.css"
// Initialize i18n
import i18n from "./i18n"
// Configure Monaco locale based on current language
import { configureMonacoLocale } from "./config/monaco-locale"
import { ThemeProvider } from "styled-components"
import { darkTheme } from "./constants/theme.ts"

// Set Monaco locale before rendering
configureMonacoLocale(i18n.language)

if ('serviceWorker' in navigator && import.meta.env && import.meta.env.PROD) {
    const pathSw = `${window.location.origin}/sw.js`
    console.log('pathSw', pathSw)
    navigator.serviceWorker
        .register(pathSw)
        .then((reg) => {
            console.log('Service worker registered.', reg)
        })
        .catch((err) => {
            console.error('Service worker registration failed.', err)
        })
}

const root = ReactDOM.createRoot(document.getElementById("root")!)

root.render(
    <React.StrictMode>
        <MittProvider>
            <ThemeProvider theme={darkTheme}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/editor-graph" element={<EditorGraphPage />} />
                        <Route path="/*" element={<App />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </MittProvider>
    </React.StrictMode>
)

