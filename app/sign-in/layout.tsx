import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In - Ask AI Legal",
  description: "Sign in to your Ask AI Legal account to access your legal documents and AI assistant.",
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
