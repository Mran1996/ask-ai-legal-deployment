import type { Metadata } from "next"
import ClientAccountLayout from './ClientAccountLayout'

export const metadata: Metadata = {
  title: "Account - Ask AI Legal",
  description: "Manage your account settings, documents, and billing.",
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientAccountLayout>{children}</ClientAccountLayout>;
}
