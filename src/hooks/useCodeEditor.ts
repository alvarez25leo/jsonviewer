import { useCallback, useMemo } from "react"
import { encode, decode } from "js-base64"
import { toast } from "sonner"
import { useLocalStorage } from "./useLocalStorage.hooks"
import { useMitt } from "@/provider/mitt"
import { languagesType, LanguageValue, tabType } from "@/types"

interface UseCodeEditorOptions {
	language: languagesType
	tabCurrent: tabType
}

interface UseCodeEditorReturn {
	codeValues: LanguageValue[]
	currentCode: string
	currentCodeEncoded: string
	setCodeValues: React.Dispatch<React.SetStateAction<LanguageValue[]>>
	updateCodeValue: (value: string) => void
	clearCode: () => boolean
	copyCode: () => Promise<void>
	minifyCode: () => boolean
	getDecodedValue: (lang?: languagesType) => string
}

/**
 * Custom hook para manejar la lógica del editor de código
 * Proporciona operaciones CRUD sobre los valores de código almacenados
 */
export function useCodeEditor({ language, tabCurrent }: UseCodeEditorOptions): UseCodeEditorReturn {
	const [codeValues, setCodeValues] = useLocalStorage<LanguageValue[]>("codeEditorValues", [])
	const { emitter } = useMitt()

	// Memoizar el valor actual del código
	const currentCodeEncoded = useMemo(() => {
		return codeValues.find((c) => c.language === language)?.value || ""
	}, [codeValues, language])

	const currentCode = useMemo(() => {
		return decode(currentCodeEncoded)
	}, [currentCodeEncoded])

	// Obtener valor decodificado por lenguaje
	const getDecodedValue = useCallback(
		(lang?: languagesType): string => {
			const targetLang = lang || language
			const encoded = codeValues.find((c) => c.language === targetLang)?.value || ""
			return decode(encoded)
		},
		[codeValues, language]
	)

	// Actualizar valor del código
	const updateCodeValue = useCallback(
		(value: string) => {
			const valueBase64 = encode(value)
			const exists = codeValues.find((c) => c.language === language)

			if (exists) {
				setCodeValues((prev) => prev.map((c) => (c.language === language ? { ...c, value: valueBase64 } : c)))
			} else {
				setCodeValues((prev) => [...prev, { language, value: valueBase64 }])
			}
		},
		[codeValues, language, setCodeValues]
	)

	// Limpiar código del lenguaje actual
	const clearCode = useCallback((): boolean => {
		emitter.emit("clearCode", { language, tab: tabCurrent })
		const exists = codeValues.find((c) => c.language === language)

		if (exists) {
			setCodeValues((prev) => prev.filter((c) => c.language !== language))
			return true
		}
		return false
	}, [codeValues, language, tabCurrent, setCodeValues, emitter])

	// Copiar código al portapapeles
	const copyCode = useCallback(async (): Promise<void> => {
		if (currentCode === "") {
			toast.warning("No hay código para copiar")
			return
		}

		try {
			await navigator.clipboard.writeText(currentCode)
			toast.success("¡Código copiado!")
		} catch (err) {
			toast.warning("Fallo al copiar el código: " + err)
		}
	}, [currentCode])

	// Minificar código JSON
	const minifyCode = useCallback((): boolean => {
		if (language !== "json") {
			toast.warning("Solo se puede minificar código JSON")
			return false
		}

		if (currentCode === "") {
			toast.warning("No hay código para minificar")
			return false
		}

		try {
			const codeMinify = JSON.stringify(JSON.parse(currentCode))
			updateCodeValue(codeMinify)
			emitter.emit("minifyCode", { language, tab: tabCurrent })
			return true
		} catch (err) {
			toast.warning("Fallo al minificar el código: " + err)
			return false
		}
	}, [language, currentCode, tabCurrent, updateCodeValue, emitter])

	return {
		codeValues,
		currentCode,
		currentCodeEncoded,
		setCodeValues,
		updateCodeValue,
		clearCode,
		copyCode,
		minifyCode,
		getDecodedValue,
	}
}
