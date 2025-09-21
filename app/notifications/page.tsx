"use client"

export default function NotificationsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notification Settings</h1>
      <p>This is the notifications page with your preferences.</p>

      <div className="mt-6 p-4 bg-white rounded-lg border">
        <h2 className="text-lg font-semibold mb-2 text-primary">Email Notifications</h2>
        <p>Control which emails you receive from Ask AI Legal.</p>
      </div>
    </div>
  )
}
