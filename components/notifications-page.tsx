"use client"

import type React from "react"

import { useState } from "react"
import { Bell, FileText, Mail, MessageSquare } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function NotificationsPage() {
  const [settings, setSettings] = useState({
    emailUpdates: true,
    chatAlerts: true,
    documentReady: true,
    mailStatus: false,
  })

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Notification Preferences</h1>

      {/* General Alerts */}
      <section className="mb-8 bg-white border rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <Bell className="w-5 h-5 text-teal-600" />
          General Alerts
        </h2>

        <NotificationRow
          icon={<Mail className="w-5 h-5 text-teal-500" />}
          title="Email Updates"
          description="Receive important system notices and account changes via email."
          checked={settings.emailUpdates}
          onChange={() => toggle("emailUpdates")}
        />

        <NotificationRow
          icon={<MessageSquare className="w-5 h-5 text-teal-500" />}
          title="Chat Message Alerts"
          description="Get notified when Khristian replies to your legal questions."
          checked={settings.chatAlerts}
          onChange={() => toggle("chatAlerts")}
        />
      </section>

      {/* Legal Document Notifications */}
      <section className="bg-white border rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-600" />
          Document Notifications
        </h2>

        <NotificationRow
          icon={<FileText className="w-5 h-5 text-teal-500" />}
          title="Document Ready"
          description="Be alerted when a new legal document is generated for you."
          checked={settings.documentReady}
          onChange={() => toggle("documentReady")}
        />

        <NotificationRow
          icon={<FileText className="w-5 h-5 text-teal-500" />}
          title="Mail Delivery Status"
          description="Track when Khristian mails your legal packet."
          checked={settings.mailStatus}
          onChange={() => toggle("mailStatus")}
        />
      </section>
    </div>
  )
}

function NotificationRow({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode
  title: string
  description: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        <div className="mt-1">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
