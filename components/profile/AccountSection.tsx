import { User } from "@/types/user";

interface AccountSectionProps {
  user: User;
}

export default function AccountSection({ user }: AccountSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account Information</h3>
        <p className="text-sm text-gray-500">Manage your account details and preferences.</p>
      </div>
      
      <div className="grid gap-6">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Name</label>
          <p className="text-gray-700">{user.fullName}</p>
        </div>
        
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Email</label>
          <p className="text-gray-700">{user.email}</p>
        </div>
        
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Username</label>
          <p className="text-gray-700">{user.username}</p>
        </div>
      </div>
    </div>
  );
} 