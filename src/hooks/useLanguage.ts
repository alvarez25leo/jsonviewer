import { useTranslation } from "react-i18next"
import { useCallback } from "react"
import { languages, LanguageCode } from "@/i18n"

/**
 * Custom hook for language management
 * Provides easy access to translation function and language switching
 */
export const useLanguage = () => {
	const { t, i18n } = useTranslation()

	const currentLanguage = (i18n.language?.split("-")[0] || "en") as LanguageCode

	const currentLanguageInfo = languages.find((lang) => lang.code === currentLanguage) || languages[0]

	const changeLanguage = useCallback(
		(langCode: LanguageCode) => {
			if (langCode !== currentLanguage) {
				i18n.changeLanguage(langCode)
				// Reload page to apply Monaco Editor locale change
				// Monaco locale can only be set before the editor is initialized
				window.location.reload()
			}
		},
		[i18n, currentLanguage]
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
