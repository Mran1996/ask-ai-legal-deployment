import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ - Ask AI Legal",
  description: "Frequently asked questions about using the Ask AI Legal.",
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
