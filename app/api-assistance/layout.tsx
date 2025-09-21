import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "API Assistance - Ask AI Legal",
  description: "Integrate AI-powered legal assistance directly into your applications with our developer API.",
}

export default function APIAssistanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
