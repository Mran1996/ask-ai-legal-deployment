import { User } from "@/types/user";

interface SecuritySectionProps {
  user: User;
}

export default function SecuritySection({ user }: SecuritySectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security Settings</h3>
        <p className="text-sm text-gray-500">Manage your account security and authentication methods.</p>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Password</h4>
          <p className="text-sm text-gray-500 mb-3">Last changed 30 days ago</p>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Change Password
          </button>
        </div>

        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
          <p className="text-sm text-gray-500 mb-3">Add an extra layer of security to your account</p>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Enable 2FA
          </button>
        </div>

        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Active Sessions</h4>
          <p className="text-sm text-gray-500 mb-3">Manage your active sessions across devices</p>
          <button className="text-sm text-red-600 hover:text-red-800">
            Sign Out All Devices
          </button>
        </div>
      </div>
    </div>
  );
} 