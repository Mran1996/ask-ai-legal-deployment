"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
          if (!error) {
            setCanUpdate(true);
          } else {
            setError("Invalid or expired password reset link.");
          }
        });
      } else {
        setError("Invalid or missing password reset token.");
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage("✅ Password updated! Redirecting to login...");
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6fefa]">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-emerald-700 text-center mb-4">Choose a New Password</h2>
        {canUpdate ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            {error && <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">{error}</div>}
            {message && <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-md">{message}</div>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-emerald-600 text-white rounded-md font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="text-red-600 text-sm mb-4">{error || "Invalid or missing password reset token."}</div>
            <a href="/reset-password" className="text-emerald-700 hover:underline font-medium">Go back to reset password</a>
          </div>
        )}
      </div>
    </div>
  );
} 