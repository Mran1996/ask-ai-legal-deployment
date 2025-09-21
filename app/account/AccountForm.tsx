"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSupabase } from '@/components/SupabaseProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User } from '@supabase/supabase-js';

export default function AccountForm({ user }: { user: User }) {
  const router = useRouter();
  const supabase = useSupabase();
  const [firstName, setFirstName] = useState(user.user_metadata.first_name || '');
  const [lastName, setLastName] = useState(user.user_metadata.last_name || '');
  const [email, setEmail] = useState(user.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error: updateUserError } = await supabase.auth.updateUser({
      email: email,
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    });

    if (updateUserError) {
      alert(`Error updating user: ${updateUserError.message}`);
      setIsSubmitting(false);
      return;
    }

    alert('Successfully updated account!');
    setIsSubmitting(false);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">👋 Welcome back, {firstName || 'User'}!</h2>
        <p className="text-gray-500">Update your account information below.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
} 