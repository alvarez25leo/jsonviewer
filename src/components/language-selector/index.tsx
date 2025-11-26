import { useState, useRef, useEffect } from "react"
import useLanguage from "@/hooks/useLanguage"

interface LanguageSelectorProps {
	variant?: "dropdown" | "toggle" | "minimal"
	className?: string
}

export const LanguageSelector = ({ variant = "dropdown", className = "" }: LanguageSelectorProps) => {
	const { currentLanguageInfo, languages, changeLanguage, toggleLanguage } = useLanguage()
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	// Toggle variant - Simple button to switch between languages
	if (variant === "toggle") {
		return (
			<button
				onClick={toggleLanguage}
				className={`flex items-center gap-2 rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600 ${className}`}
				title="Switch language"
			>
				<span className="text-lg">{currentLanguageInfo.flag}</span>
				<span>{currentLanguageInfo.code.toUpperCase()}</span>
			</button>
		)
	}

	// Minimal variant - Just flag with dropdown
	if (variant === "minimal") {
		return (
			<div ref={dropdownRef} className={`relative ${className}`}>
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="flex items-center gap-1 rounded-md p-2 text-lg transition-colors hover:bg-gray-700"
					title="Change language"
				>
					{currentLanguageInfo.flag}
					<svg
						className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
					</svg>
				</button>

				{isOpen && (
					<div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] rounded-md border border-gray-700 bg-gray-800 py-1 shadow-lg">
						{languages.map((lang) => (
							<button
								key={lang.code}
								onClick={() => {
									changeLanguage(lang.code)
									setIsOpen(false)
								}}
								className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-700 ${
									currentLanguageInfo.code === lang.code ? "bg-gray-700 text-blue-400" : "text-white"
								}`}
							>
								<span className="text-lg">{lang.flag}</span>
								<span>{lang.name}</span>
								{currentLanguageInfo.code === lang.code && (
									<svg className="ml-auto h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								)}
							</button>
						))}
					</div>
				)}
			</div>
		)
	}

	// Default dropdown variant
	return (
		<div ref={dropdownRef} className={`relative ${className}`}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
			>
				<span className="text-lg">{currentLanguageInfo.flag}</span>
				<span>{currentLanguageInfo.name}</span>
				<svg
					className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{isOpen && (
				<div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-md border border-gray-700 bg-gray-800 py-1 shadow-lg">
					{languages.map((lang) => (
						<button
							key={lang.code}
							onClick={() => {
								changeLanguage(lang.code)
								setIsOpen(false)
							}}
							className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-gray-700 ${
								currentLanguageInfo.code === lang.code ? "bg-gray-700 text-blue-400" : "text-white"
							}`}
						>
							<span className="text-lg">{lang.flag}</span>
							<span>{lang.name}</span>
							{currentLanguageInfo.code === lang.code && (
								<svg className="ml-auto h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									/>
								</svg>
							)}
						</button>
					))}
				</div>
			)}
		</div>
	)
}

export default LanguageSelector
