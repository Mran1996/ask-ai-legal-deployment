"use client"

import type React from "react"
import { LegalAssistantProvider } from "@/components/context/legal-assistant-context"

export function LegalAssistantWrapper({ children }: { children: React.ReactNode }) {
  return <LegalAssistantProvider>{children}</LegalAssistantProvider>
}
