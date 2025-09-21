"use client"

import type React from "react"
import { LegalAssistantProvider } from "@/components/context/legal-assistant-context"

export default function AIAssistantClient({
  children,
}: {
  children: React.ReactNode
}) {
  return <LegalAssistantProvider>{children}</LegalAssistantProvider>
}
