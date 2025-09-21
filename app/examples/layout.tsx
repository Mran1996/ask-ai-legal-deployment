import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Examples - Ask AI Legal",
  description: "See examples of legal documents, motions, and strategies that Ask AI Legal can help you create.",
}

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
