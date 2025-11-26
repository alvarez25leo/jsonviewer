import { useTranslation } from "react-i18next"
import { useCallback } from "react"
import { languages, LanguageCode } from "@/i18n"

/**
 * Custom hook for language management
 * Provides easy access to translation function and language switching
 */
export const useLanguage = () => {
	const { t, i18n } = useTranslation()

	const currentLanguage = i18n.language as LanguageCode

	const currentLanguageInfo = languages.find((lang) => lang.code === currentLanguage) || languages[0]

	const changeLanguage = useCallback(
		(langCode: LanguageCode) => {
			i18n.changeLanguage(langCode)
		},
		[i18n]
	)

	const toggleLanguage = useCallback(() => {
		const currentIndex = languages.findIndex((lang) => lang.code === currentLanguage)
		const nextIndex = (currentIndex + 1) % languages.length
		changeLanguage(languages[nextIndex].code)
	}, [currentLanguage, changeLanguage])

	return {
		t,
		i18n,
		currentLanguage,
		currentLanguageInfo,
		languages,
		changeLanguage,
		toggleLanguage,
	}
}

export default useLanguage
