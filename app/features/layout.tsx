import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Features - Ask AI Legal",
  description: "Discover how Ask AI Legal's AI-powered features can help with your legal needs.",
}

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
