import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing – Ask AI Legal",
  description: "Get professional legal documents — no law firm required. Fast and affordable. Only $59 to start.",
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
