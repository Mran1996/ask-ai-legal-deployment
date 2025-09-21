import type React from "react"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"

export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
