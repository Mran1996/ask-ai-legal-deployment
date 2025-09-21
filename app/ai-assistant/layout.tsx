import type React from "react"
import type { Metadata } from "next"
import { LegalAssistantWrapper } from "@/components/context/legal-assistant-wrapper"

export const metadata: Metadata = {
  title: "AI Assistant - Ask AI Legal",
  description: "Get professional legal help in minutes with our AI-powered legal assistant.",
}

export default function AIAssistantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <LegalAssistantWrapper>{children}</LegalAssistantWrapper>
}
