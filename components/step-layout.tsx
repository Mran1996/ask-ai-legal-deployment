"use client"
import { Navigation } from "@/components/navigation"
import type { ReactNode } from "react"

interface StepLayoutProps {
  children: ReactNode
  headerTitle?: string
  headerSubtitle?: string
}

export function StepLayout({ children, headerTitle, headerSubtitle }: StepLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="flex-grow">
        <div className="bg-[#00A884] text-white py-16 px-6 md:py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold">{headerTitle || "Your Document is Ready"}</h1>
            <p className="text-xl mt-2">{headerSubtitle || "Review, edit, and download your legal document"}</p>
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}
