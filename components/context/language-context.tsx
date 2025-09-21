"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = {
  value: string
  label: string
}

type LanguageContextType = {
  currentLanguage: Language
  changeLanguage: (language: Language) => void
  languages: Language[]
}

const defaultLanguages: Language[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "zh", label: "中文" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "it", label: "Italiano" },
  { value: "pt", label: "Português" },
  { value: "ru", label: "Русский" },
  { value: "ar", label: "العربية" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "hi", label: "हिंदी" },
  { value: "vi", label: "Tiếng Việt" },
  { value: "tl", label: "Tagalog" },
]

const defaultLanguage = defaultLanguages[0]

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(defaultLanguage)

  // Load saved language preference on initial render - using only localStorage, no Supabase
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage")
    if (savedLanguage) {
      try {
        const parsedLanguage = JSON.parse(savedLanguage)
        setCurrentLanguage(parsedLanguage)
        document.documentElement.lang = parsedLanguage.value
      } catch (error) {
        console.error("Failed to parse saved language:", error)
      }
    }
  }, [])

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language)
    localStorage.setItem("preferredLanguage", JSON.stringify(language))
    document.documentElement.lang = language.value
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, languages: defaultLanguages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
