import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSupabase } from '@/components/SupabaseProvider';
import { User } from '@supabase/supabase-js';

export default function SecuritySection() {
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
    <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6">
      <h2 className="text-2xl font-bold mb-2">Security</h2>

      {isGoogleUser ? (
        <>
          <p className="text-gray-600 mb-4">
            Your account is secured with <strong>Google Sign-In</strong>. You do not need a password.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="text"
              readOnly
              value={user?.email || ""}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-500"
            />
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-600 mb-4">Change your account password below.</p>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <Button onClick={handlePasswordUpdate} disabled={status === "loading"}>
            {status === "loading" ? "Updating..." : "Update Password"}
          </Button>

          {status === "success" && <p className="text-green-600 mt-2">Password updated successfully.</p>}
          {status === "error" && <p className="text-red-600 mt-2">Something went wrong.</p>}
        </>
      )}
    </div>
  );
} 