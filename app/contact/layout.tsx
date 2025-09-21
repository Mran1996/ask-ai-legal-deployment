import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - Ask AI Legal",
  description: "Get in touch with the Ask AI Legal team for support, feedback, or inquiries.",
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
