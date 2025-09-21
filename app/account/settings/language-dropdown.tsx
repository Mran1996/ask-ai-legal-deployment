"use client"

import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/components/context/language-context"
import { ChevronDown } from "lucide-react"
import flags from "@/components/flags"

export default function LanguageDropdown() {
  const { currentLanguage, changeLanguage, languages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <span className="flex items-center" style={{ fontSize: "1.2em" }} aria-hidden="true">
            {flags[currentLanguage.value] || "🌐"}
          </span>
          {currentLanguage.label}
        </span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          <ul
            className="py-1 overflow-auto text-base rounded-md max-h-60 focus:outline-none sm:text-sm"
            tabIndex={-1}
            role="listbox"
            aria-labelledby="language-button"
          >
            {languages.map((language) => (
              <li
                key={language.value}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${
                  currentLanguage.value === language.value ? "bg-gray-100" : ""
                }`}
                role="option"
                aria-selected={currentLanguage.value === language.value}
                onClick={() => {
                  changeLanguage(language)
                  setIsOpen(false)
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="flex items-center" style={{ fontSize: "1.2em" }} aria-hidden="true">
                    {flags[language.value] || "🌐"}
                  </span>
                  <span className="block truncate">{language.label}</span>
                </span>
                {currentLanguage.value === language.value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-green-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
