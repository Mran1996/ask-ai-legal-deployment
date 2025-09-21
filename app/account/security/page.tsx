"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabase } from '@/components/SupabaseProvider';
import { User } from '@supabase/supabase-js';

export default function SecurityPage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = useSupabase();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // ✅ Detect if signed in with Google
  const isGoogleUser = user?.app_metadata?.provider === "google";

  const handlePasswordUpdate = async () => {
    setStatus("loading");

    const res = await fetch("/api/update-password", {
      method: "POST",
      body: JSON.stringify({ newPassword }),
    });

    if (res.ok) {
      setStatus("success");
      setNewPassword("");
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
      <h1 className="text-3xl font-bold mb-2">Security</h1>
      <p className="text-gray-600 mb-6">Manage your account security and password settings.</p>

      <div className="space-y-6">
        {/* Account Security Status */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Account Security</h2>
          
          {isGoogleUser ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <p className="font-medium text-green-800">Google Sign-In Active</p>
                  <p className="text-sm text-green-600">Your account is secured with Google authentication</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  readOnly
                  value={user?.email || ""}
                  className="bg-gray-50 text-gray-600"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🔒</span>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Password Authentication</p>
                  <p className="text-sm text-blue-600">Your account uses email and password authentication</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  readOnly
                  value={user?.email || ""}
                  className="bg-gray-50 text-gray-600"
                />
              </div>
            </div>
          )}
        </div>

        {/* Password Management */}
        {!isGoogleUser && (
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <p className="text-sm text-gray-600 mb-4">Update your account password to keep your account secure.</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                />
              </div>

              <Button 
                onClick={handlePasswordUpdate} 
                disabled={status === "loading" || !newPassword.trim()} 
                className="w-full md:w-auto"
              >
                {status === "loading" ? "Updating..." : "Update Password"}
              </Button>

              {status === "success" && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">✓ Password updated successfully.</p>
                </div>
              )}
              
              {status === "error" && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">✗ Something went wrong. Please try again.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
