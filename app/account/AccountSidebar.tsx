"use client";

import { useState, useRef } from 'react';
import { useSupabase } from '@/components/SupabaseProvider';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useRouter } from 'next/navigation';
import ProfileAvatar from "@/components/ProfileAvatar";

interface AccountSidebarProps {
  user: SupabaseUser;
  setActiveTab: (tab: 'account' | 'billing' | 'security') => void;
  cardMode?: boolean;
}

export default function AccountSidebar({ user, setActiveTab, cardMode }: AccountSidebarProps) {
  const router = useRouter();
  const supabase = useSupabase();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.user_metadata?.avatar_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPEG, PNG, or WebP image.");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Please select an image smaller than 5MB.");
      return;
    }

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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      alert(`Upload error: ${errorMessage}`);
      console.error("Avatar upload error:", err);
    }
  };
  
  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <aside
      className={cardMode
        ? "flex flex-col items-center w-full"
        : "hidden md:flex flex-col w-64 h-full bg-white shadow-xl p-8 border-r"
      }
    >
      <div className="mb-4">
        <ProfileAvatar />
      </div>
      <h2 className={cardMode ? "text-xl font-semibold mt-2 mb-1" : "text-xl font-semibold mt-2 mb-1 text-center whitespace-nowrap overflow-hidden text-ellipsis"}>
        {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
      </h2>
      <p className={cardMode ? "text-sm text-gray-800 mb-4 px-2 whitespace-normal leading-snug" : "text-sm text-gray-800 mb-4 px-2 whitespace-normal leading-snug text-center"}>
        Empowering access to justice with artificial intelligence.
      </p>
      <Separator className="my-4" />
      <nav className="w-full text-left flex-1">
        <div className="space-y-4 text-sm font-medium text-gray-800">
          <button onClick={() => setActiveTab('account')} className="flex items-center gap-2 cursor-pointer w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
            <span>👤</span>
            <span>Account</span>
          </button>
          <button onClick={() => setActiveTab('billing')} className="flex items-center gap-2 cursor-pointer w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
            <span>💳</span>
            <span>Billing</span>
          </button>
          <button onClick={() => setActiveTab('security')} className="flex items-center gap-2 cursor-pointer w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
            <span>🔒</span>
            <span>Security</span>
          </button>
        </div>
      </nav>
    </aside>
  );
} 