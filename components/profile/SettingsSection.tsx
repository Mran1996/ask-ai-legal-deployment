import { User } from "@/types/user";
import { useState } from "react";

interface SettingsSectionProps {
  user: User;
}

export default function SettingsSection({ user }: SettingsSectionProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">General Settings</h3>
        <p className="text-sm text-gray-500">Customize your application preferences.</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Dark Mode</h4>
            <p className="text-sm text-gray-500">Toggle dark mode theme</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              darkMode ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Language</h4>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Data & Privacy</h4>
          <div className="space-y-2">
            <button className="text-sm text-blue-600 hover:text-blue-800 block">
              Download My Data
            </button>
            <button className="text-sm text-red-600 hover:text-red-800 block">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 