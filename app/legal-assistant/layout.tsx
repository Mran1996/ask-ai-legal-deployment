import type { ReactNode } from "react"
import { StepHeroBanner } from "@/components/step-hero-banner"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"

export default function LegalAssistantLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="flex-grow">
        <StepHeroBanner />
        {children}
      </main>
      <Footer />
    </div>
  )
}
