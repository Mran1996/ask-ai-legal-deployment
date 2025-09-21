"use client"

export default function NotificationsPage() {
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>

        <p className="text-sm text-muted-foreground mb-6">Manage which alerts you receive from Ask AI Legal.</p>

        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h2 className="font-medium text-base mb-2">AI Document Updates</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Get notified when your AI-generated document is ready or revised.
            </p>
            <label className="inline-flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="accent-green-600" />
              <span>Email notifications</span>
            </label>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="font-medium text-base mb-2">Billing & Plan Changes</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Receive alerts for invoices, renewals, or plan status updates.
            </p>
            <label className="inline-flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="accent-green-600" />
              <span>Email notifications</span>
            </label>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="font-medium text-base mb-2">Promotions & Legal News</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Occasional updates about new features or legal resources.
            </p>
            <label className="inline-flex items-center space-x-2">
              <input type="checkbox" className="accent-green-600" />
              <span>Email notifications</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
