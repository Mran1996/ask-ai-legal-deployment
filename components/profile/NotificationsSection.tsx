import { User } from "@/types/user";
import { useState } from "react";

interface NotificationsSectionProps {
  user: User;
}

export default function NotificationsSection({ user }: NotificationsSectionProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <p className="text-sm text-gray-500">Manage how you receive notifications.</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Email Notifications</h4>
            <p className="text-sm text-gray-500">Receive notifications via email</p>
          </div>
          <button
            onClick={() => setEmailNotifications(!emailNotifications)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                emailNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Push Notifications</h4>
            <p className="text-sm text-gray-500">Receive push notifications</p>
          </div>
          <button
            onClick={() => setPushNotifications(!pushNotifications)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                pushNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
} 