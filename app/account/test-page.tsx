'use client'

import AccountClient from "./AccountClient"

export default function TestAccountPage() {
  // Mock user data for testing
  const mockUser = {
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    displayName: "John Doe",
    avatarUrl: null,
    createdAt: "2024-01-15",
    planName: "AI Legal Premium",
    nextBilling: "August 21, 2025",
    features: [
      "Unlimited legal documents (up to 150 pages each)",
      "Unlimited AI-powered revisions",
      "Real case law embedded",
      "Case Success Analysis",
      "Delivered in PDF + DOCX",
      "Email + Phone Support"
    ]
  }

  return (
    <div className="min-h-screen bg-[#f6fefa]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-emerald-700">Account Dashboard</h1>
          <p className="text-gray-600">Test Account Page - No Authentication Required</p>
        </div>
        
        <AccountClient
          avatarUrl={mockUser.avatarUrl}
          displayName={mockUser.displayName}
          firstName={mockUser.firstName}
          lastName={mockUser.lastName}
          email={mockUser.email}
          createdAt={mockUser.createdAt}
          planName={mockUser.planName}
          nextBilling={mockUser.nextBilling}
          features={mockUser.features}
        />
      </div>
    </div>
  )
}
