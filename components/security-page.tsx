"use client"

import { Lock, ShieldCheck, KeyRound, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function SecurityPage() {
  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Security Settings</h1>

      {/* Change Password */}
      <div className="mb-8 space-y-4 bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-3">
          <KeyRound className="w-6 h-6 text-teal-600" />
          <div>
            <h2 className="text-lg font-medium text-gray-800">Change Password</h2>
            <p className="text-sm text-gray-500">Update your account password regularly to keep your account secure.</p>
          </div>
        </div>
        <Button variant="default" className="w-fit">
          Update Password
        </Button>
      </div>

      {/* Two-Factor Authentication */}
      <div className="mb-8 space-y-4 bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-teal-600" />
          <div>
            <h2 className="text-lg font-medium text-gray-800">Two-Factor Authentication</h2>
            <p className="text-sm text-gray-500">Add an extra layer of protection to your account using 2FA.</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Enable Two-Factor Authentication</span>
          <Switch />
        </div>
      </div>

      {/* Session Management */}
      <div className="mb-8 space-y-4 bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-3">
          <LogOut className="w-6 h-6 text-teal-600" />
          <div>
            <h2 className="text-lg font-medium text-gray-800">Log Out of All Devices</h2>
            <p className="text-sm text-gray-500">End all active sessions across browsers and devices.</p>
          </div>
        </div>
        <Button variant="destructive" className="w-fit">
          Log Out Everywhere
        </Button>
      </div>

      {/* Security Alerts */}
      <div className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-3">
          <Lock className="w-6 h-6 text-teal-600" />
          <div>
            <h2 className="text-lg font-medium text-gray-800">Security Alerts</h2>
            <p className="text-sm text-gray-500">
              Get notified about new logins, changes to your account, or suspicious activity.
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Receive Email Alerts</span>
          <Switch />
        </div>
      </div>
    </div>
  )
}
