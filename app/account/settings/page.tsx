"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import LanguageDropdown from "./language-dropdown"
import { useTranslation } from "@/utils/translations"

export default function SettingsPage() {
  const { t } = useTranslation()

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{t("settings")}</h1>

        <div className="space-y-6">
          {/* Language Preference */}
          <div className="border rounded-lg p-5 bg-white shadow-sm">
            <h2 className="font-medium text-base mb-2">{t("language")}</h2>
            <p className="text-sm text-muted-foreground mb-3">{t("languageDescription")}</p>
            <LanguageDropdown />
          </div>

          {/* AI Output Style */}
          <div className="border rounded-lg p-5 bg-white shadow-sm">
            <h2 className="font-medium text-base mb-2">{t("aiOutputStyle")}</h2>
            <p className="text-sm text-muted-foreground mb-3">{t("aiOutputDescription")}</p>
            <div className="flex items-center space-x-4">
              <Label htmlFor="formal-tone" className="text-sm">
                {t("formalTone")}
              </Label>
              <Switch id="formal-tone" defaultChecked />
            </div>
          </div>

          {/* Data Sharing */}
          <div className="border rounded-lg p-5 bg-white shadow-sm">
            <h2 className="font-medium text-base mb-2">{t("dataSharing")}</h2>
            <p className="text-sm text-muted-foreground mb-3">{t("dataSharingDescription")}</p>
            <div className="flex items-center space-x-4">
              <Label htmlFor="data-sharing" className="text-sm">
                {t("allowAnalytics")}
              </Label>
              <Switch id="data-sharing" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
