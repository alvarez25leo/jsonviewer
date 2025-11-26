import { loader } from "@monaco-editor/react"

// Monaco Editor supported locales
export type MonacoLocale = "de" | "es" | "fr" | "it" | "ja" | "ko" | "ru" | "zh-cn" | "zh-tw"

// Map i18n language codes to Monaco locales
const localeMap: Record<string, MonacoLocale | undefined> = {
	es: "es",
	de: "de",
	fr: "fr",
	it: "it",
	ja: "ja",
	ko: "ko",
	ru: "ru",
	"zh-CN": "zh-cn",
	"zh-TW": "zh-tw",
}

/**
 * Configure Monaco Editor locale
 * Must be called before Monaco Editor is mounted
 */
export function configureMonacoLocale(languageCode: string): void {
	const monacoLocale = localeMap[languageCode]

	if (monacoLocale) {
		loader.config({
			"vs/nls": {
				availableLanguages: {
					"*": monacoLocale,
				},
			},
		})
	} else {
		// Default to English (no locale config needed)
		loader.config({
			"vs/nls": {
				availableLanguages: {},
			},
		})
	}
}

/**
 * Get current Monaco locale from language code
 */
export function getMonacoLocale(languageCode: string): MonacoLocale | "en" {
	return localeMap[languageCode] || "en"
}
