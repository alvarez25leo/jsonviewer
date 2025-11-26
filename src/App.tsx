import "./App.css"
import ContainerEditorComponent from "@/components/container/container-edito.component"
import { CommandPalette } from "@/components/command-palette"
import { Toaster } from "sonner"
import { loader } from "@monaco-editor/react"
import * as monaco from "monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import useConfig from "./store/useConfig"

self.MonacoEnvironment = {
	getWorker(_, label) {
		console.log("label", label)
		if (label === "json") {
			return new jsonWorker()
		}
		if (label === "css" || label === "scss" || label === "less") {
			return new cssWorker()
		}
		if (label === "html" || label === "handlebars" || label === "razor") {
			return new htmlWorker()
		}
		if (label === "typescript" || label === "javascript") {
			return new tsWorker()
		}
		return new editorWorker()
	},
}

loader.config({ monaco })

loader
	.init()
	.then(async (monaco) => {
		console.log("Monaco Editor loaded:", monaco)
	})
	.catch((error) => console.error("Monaco Editor not loaded:", error))

function App() {
	const darkmodeEnabled = useConfig((state) => state.darkmodeEnabled)

	console.log("darkmodeEnabled", darkmodeEnabled)
	return (
		<>
			<div
				className="bg-editor"
				style={{
					height: "100vh",
					width: "100vw",
					minHeight: "100vh",
				}}
			>
				<ContainerEditorComponent />
			</div>
			<CommandPalette />
			<Toaster position="bottom-right" />
		</>
	)
}

export default App
