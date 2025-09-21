"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useSupabase } from '@/components/SupabaseProvider';
import { User } from '@supabase/supabase-js';

export default function ProfileAvatar() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = useSupabase();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [imgError, setImgError] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      setAvatarUrl(user.user_metadata.avatar_url);
      setImgError(false);
    }
  }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Clear previous errors
    setError("");

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPEG, PNG, or WebP image.");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Please select an image smaller than 5MB.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Upload failed with status ${res.status}`);
      }

      const { publicUrl, error: uploadError } = await res.json();

      if (uploadError || !publicUrl) {
        throw new Error(uploadError || "No URL returned");
      }

      const saveRes = await fetch("/api/save-avatar-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: publicUrl }),
      });

      if (!saveRes.ok) {
        const saveErrorData = await saveRes.json();
        throw new Error(saveErrorData.error || "Failed to save avatar URL");
      }

      setAvatarUrl(publicUrl);
      setImgError(false);
      
      // Refresh the page to update user metadata
      window.location.reload();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unexpected error occurred";
      setError(errorMessage);
      console.error("Avatar upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 cursor-pointer hover:bg-gray-300 transition-colors"
        onClick={() => fileRef.current?.click()}
        style={{ minWidth: 80, minHeight: 80, maxWidth: 80, maxHeight: 80 }}
      >
        {avatarUrl && avatarUrl.includes("http") && !imgError ? (
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={80}
            height={80}
            className="rounded-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-sm text-gray-500">
            {uploading ? "Uploading..." : "Upload"}
          </span>
        )}
      </div>
      
      <input 
        type="file" 
        ref={fileRef} 
        className="hidden" 
        onChange={handleFileChange}
        accept="image/jpeg,image/jpg,image/png,image/webp"
      />
      
      <p className="text-xs text-gray-500 mt-2 cursor-pointer hover:text-gray-700" 
         onClick={() => fileRef.current?.click()}>
        Click to change photo
      </p>
      
      {error && (
        <p className="text-xs text-red-500 mt-1 text-center max-w-48">
          {error}
        </p>
      )}
    </div>
  );
} 