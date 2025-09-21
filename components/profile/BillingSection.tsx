import { User } from "@/types/user";

interface BillingSectionProps {
  user: User;
}

export default function BillingSection({ user }: BillingSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing & Subscription</h3>
        <p className="text-sm text-gray-500">Manage your billing information and subscription details.</p>
      </div>
      
      <div className="grid gap-6">
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Current Plan</h4>
          <p className="text-gray-700">Free Tier</p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Payment Method</h4>
          <p className="text-gray-700">No payment method added</p>
          <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
            Add Payment Method
          </button>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Billing History</h4>
          <p className="text-gray-500 text-sm">No billing history available</p>
        </div>
      </div>
    </div>
  );
} 