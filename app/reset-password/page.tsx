"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage("If this email is registered, a password reset link has been sent.");
      setSent(true);
      setTimeout(() => {
        router.push('/sign-in');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6fefa]">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-emerald-700 text-center mb-2">Reset Password</h2>
        {message && (
          <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-md mb-4">{message}</div>
        )}
        {!sent && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            {error && <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">{error}</div>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-emerald-600 text-white rounded-md font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Email"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 