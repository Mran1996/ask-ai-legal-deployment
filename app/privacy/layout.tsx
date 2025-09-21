import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Ask AI Legal",
  description: "Learn about how Ask AI Legal collects, uses, and protects your personal information.",
}

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
