import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up - Ask AI Legal",
  description: "Create an account to access Ask AI Legal's AI-powered legal assistance.",
}

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
