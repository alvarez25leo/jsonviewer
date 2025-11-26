import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import en from "./locales/en.json"
import es from "./locales/es.json"

// Supported languages
export const languages = [
	{ code: "en", name: "English", flag: "🇺🇸" },
	{ code: "es", name: "Español", flag: "🇪🇸" },
] as const

export type LanguageCode = (typeof languages)[number]["code"]

// Resources
const resources = {
	en: { translation: en },
	es: { translation: es },
}

i18n
	// Detect user language
	.use(LanguageDetector)
	// Pass the i18n instance to react-i18next
	.use(initReactI18next)
	// Init i18next
	.init({
		resources,
		fallbackLng: "en",
		debug: import.meta.env.DEV,

		interpolation: {
			escapeValue: false, // React already escapes by default
		},

		detection: {
			// Order and from where user language should be detected
			order: ["localStorage", "navigator", "htmlTag"],
			// Keys or params to lookup language from
			lookupLocalStorage: "i18nextLng",
			// Cache user language on
			caches: ["localStorage"],
		},
	})

export default i18n
