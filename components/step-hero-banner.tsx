"use client"

import { usePathname } from "next/navigation"

export function StepHeroBanner() {
  const pathname = usePathname()
  const showHero = pathname?.startsWith("/legal-assistant/step")

  if (!showHero) return null

  return (
    <div className="bg-emerald-500 text-white py-12 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold">AI-Powered Legal Assistant</h1>
        <p className="text-xl mt-2">Get professional legal help in minutes</p>
      </div>
    </div>
  )
}
