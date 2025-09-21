import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - Ask AI Legal",
  description: "Terms and conditions for using the Ask AI Legal service.",
}

export default function TermsOfServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
