import { useState } from "react"
import { encode, decode } from "js-base64"
import { useLocalStorage } from "@/hooks/useLocalStorage.hooks"
import { languagesType, LanguageValue, tabType } from "@/types"
import { toast } from "sonner"
import { useMitt } from "@/provider/mitt"
import JsonEditorComponent from "../editor/json-editor.component"
import JsonGraphComponent from "../graph/json-graph.component"
import DiffEditorComponent from "../editor/diff-editor.component"
import TabJsonGraphComponent from "../tabs/tab-json-graph.component"
import ButtonPanelShowComponent from "../buttons/button-panel-show.component"

const languagesList: Array<languagesType> = ["json", "javascript", "typescript", "html", "css", "scss", "sql", "yaml", "xml"]

const ContainerEditorComponent = () => {
	const [tabCurrent, setTabCurrent] = useLocalStorage<tabType>("tabCurrent", "code")
	const [language, setLanguage] = useLocalStorage<languagesType>("languageEditor", "json")
	const [codeValues, setCodeValues] = useLocalStorage<LanguageValue[]>("codeEditorValues", [])
	const [showPanel] = useLocalStorage<boolean>("showPanel", true)
	const [keyEditor, setKeyEditor] = useState<number>(0)

	const { emitter } = useMitt()

	const handleCopyCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		const code = codeValues.find((c) => c.language === language)?.value || ""
		const valueCode = decode(code || "")
		if (valueCode !== "") {
			try {
				await navigator.clipboard.writeText(valueCode)
				toast.success("¡Código copiado!")
			} catch (err) {
				toast.warning("Fallo al copiar el código:" + err)
			}
			return
		}
		toast.warning("No hay código para copiar")
	}

	const handleClearEditor = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		emitter.emit("clearCode", { language, tab: tabCurrent })
		const exists = codeValues.find((c) => c.language === language)
		if (exists) {
			setCodeValues(codeValues.filter((c) => c.language !== language))
			setKeyEditor((prev) => prev + 1)
			return
		}
	}

	const handleFormatCode = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		emitter.emit("formatCode", { language, tab: tabCurrent })
	}

	const handleMinifyEditor = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (language === "json") {
			const code = codeValues.find((c) => c.language === language)?.value || ""
			const valueCode = decode(code)
			if (valueCode !== "") {
				try {
					const codeMinify = JSON.stringify(JSON.parse(valueCode))
					const exists = codeValues.find((c) => c.language === language)
					if (exists) {
						const index = codeValues.findIndex((c) => c.language === language)
						codeValues[index].value = encode(codeMinify)
						setCodeValues(codeValues)
						setKeyEditor((prev) => prev + 1)
						emitter.emit("minifyCode", { language, tab: tabCurrent })
						return
					}
					setCodeValues((prev) => [...prev, { language: language as languagesType, value: encode(codeMinify) }])
					setKeyEditor((prev) => prev + 1)
					emitter.emit("minifyCode", { language, tab: tabCurrent })
				} catch (err) {
					toast.warning("Fallo al minificar el código:" + err)
				}
			}
		}
	}
	showPanel
	return (
		<>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: `1fr ${showPanel ? "350px" : "0px"}`,
				}}
			>
				<div
					style={{
						height: "100vh",
						width: `${showPanel ? "calc(100vw - 350px)" : "100vw"}`,
						maxWidth: `${showPanel ? "calc(100vw - 350px)" : "100vw"}`,
						minWidth: `${showPanel ? "calc(100vw - 350px)" : "100vw"}`,
						position: "relative",
						overflow: "hidden",
					}}
				>
					{tabCurrent === "code" ? <JsonEditorComponent key={`${language}${keyEditor}`} language={language} /> : null}

					{tabCurrent === "graph" && language === "json" ? (
						<JsonGraphComponent json={decode(codeValues.find((c) => c.language === "json")?.value || "")} />
					) : null}

					{tabCurrent === "compare" ? (
						<DiffEditorComponent
							key={`${language}${keyEditor}`}
							codeValue={decode(codeValues.find((c) => c.language === language)?.value || "")}
							codeValueModified={""}
							language={language}
						/>
					) : null}
				</div>
				<div className="px-1 py-3">
					<div className="mb-1">
						<TabJsonGraphComponent currentTab={tabCurrent} handleTabChange={setTabCurrent} language={language} />
					</div>
					<div>
						<div className="mb-2 mt-1">
							<label className="mb-2 text-[0.8125rem] font-semibold leading-5 text-[#cccccc80]">Lenguajes</label>
						</div>
						<div className="mt-1 flex flex-wrap gap-1">
							{languagesList.map((languageName) => (
								<button
									key={languageName}
									className={`pointer-events-auto flex items-center justify-center rounded-md bg-[#2c3437] px-3 py-[2px] text-[0.8125rem] font-semibold leading-5 text-[#cccccc80] hover:bg-[#4d5565] hover:text-[#c5c5c5] ${
										language === languageName ? "bg-[#545e71] text-[#cccccc]" : ""
									}`}
									onClick={() => setLanguage(languageName)}
								>
									{languageName}
								</button>
							))}
						</div>
					</div>
					<div>
						<div className="mb-2 mt-2">
							<label className="mb-2 text-[0.8125rem] font-semibold leading-5 text-[#cccccc80]">Actions</label>
						</div>
					</div>
					<div className="mt-1 flex gap-x-2">
						<button
							onClick={handleCopyCode}
							className="pointer-events-auto flex flex-1 items-center justify-center gap-x-1 rounded-md bg-[#2c3437] px-2 py-1 text-[0.8125rem] font-semibold leading-5 text-[#cccccc80] hover:bg-[#4d5565] hover:text-[#c5c5c5]"
						>
							<div>
								<svg viewBox="0 0 24 24" width={18} height={18}>
									<path
										fill="currentColor"
										d="M5.5028 4.62704L5.5 6.75V17.2542C5.5 19.0491 6.95507 20.5042 8.75 20.5042L17.3663 20.5045C17.0573 21.3782 16.224 22.0042 15.2444 22.0042H8.75C6.12665 22.0042 4 19.8776 4 17.2542V6.75C4 5.76929 4.62745 4.93512 5.5028 4.62704ZM17.75 2C18.9926 2 20 3.00736 20 4.25V17.25C20 18.4926 18.9926 19.5 17.75 19.5H8.75C7.50736 19.5 6.5 18.4926 6.5 17.25V4.25C6.5 3.00736 7.50736 2 8.75 2H17.75ZM17.75 3.5H8.75C8.33579 3.5 8 3.83579 8 4.25V17.25C8 17.6642 8.33579 18 8.75 18H17.75C18.1642 18 18.5 17.6642 18.5 17.25V4.25C18.5 3.83579 18.1642 3.5 17.75 3.5Z"
									></path>
								</svg>
							</div>
							<div className="flex items-center justify-center">Copy</div>
						</button>
						<button
							className="pointer-events-auto flex flex-1 items-center justify-center gap-x-1 rounded-md bg-[#2c3437] px-2 py-1 text-[0.8125rem] font-semibold leading-5 text-[#cccccc80] hover:bg-[#4d5565] hover:text-[#c5c5c5]"
							onClick={handleFormatCode}
						>
							<div>
								<svg
									width={18}
									height={18}
									viewBox="0 0 16 16"
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1"
								>
									<polyline points="2.75 4.75,2.75 1.75,8.25 1.75,13.25 6.75,13.25 14.25,2.75 14.25" />
									<path d="m6.25 7.75 2 1.75-2 1.75m-2.5-3.5-2 1.75 2 1.75" />
								</svg>
							</div>
							<div className="flex items-center justify-center">Format</div>
						</button>
						<button
							className="pointer-events-auto flex flex-1 items-center justify-center gap-x-1 rounded-md bg-[#2c3437] px-2 py-1 text-[0.8125rem] font-semibold leading-5 text-[#cccccc80] hover:bg-[#4d5565] hover:text-[#c5c5c5]"
							onClick={handleClearEditor}
						>
							<div></div>
							<div className="flex items-center justify-center">Clean</div>
						</button>
						<button
							className="pointer-events-auto flex flex-1 items-center justify-center gap-x-1 rounded-md bg-[#2c3437] px-2 py-1 text-[0.8125rem] font-semibold leading-5 text-[#cccccc80] hover:bg-[#4d5565] hover:text-[#c5c5c5]"
							onClick={handleMinifyEditor}
						>
							<div></div>
							<div className="flex items-center justify-center">Minify</div>
						</button>
					</div>
				</div>
			</div>
			<ButtonPanelShowComponent />
		</>
	)
}

export default ContainerEditorComponent
