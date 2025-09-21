'use client'

export default function SimpleAccountPage() {
  return (
    <div className="min-h-screen bg-[#f6fefa]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-700 mb-2">Account Dashboard</h1>
          <p className="text-gray-600">Welcome to your AI Legal Assistant account</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* User Info Section */}
          <div className="flex items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mr-6">
              <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                <path stroke="currentColor" strokeWidth="2" d="M4 20c0-4 4-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">John Doe</h2>
              <p className="text-gray-600">john.doe@example.com</p>
              <p className="text-sm text-gray-500">Member since January 15, 2024</p>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="bg-emerald-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-emerald-700 mb-4">Current Plan</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xl font-bold text-gray-800">AI Legal Premium</p>
                <p className="text-gray-600">Next billing: August 21, 2025</p>
              </div>
              <span className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Active
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Plan Includes:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Unlimited legal documents (up to 150 pages each)",
                "Unlimited AI-powered revisions",
                "Real case law embedded",
                "Case Success Analysis",
                "Delivered in PDF + DOCX",
                "Email + Phone Support"
              ].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <svg className="w-5 h-5 text-emerald-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition">
                Create New Document
              </button>
              <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition">
                View Documents
              </button>
              <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition">
                Billing Settings
              </button>
              <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition">
                Account Settings
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800 font-medium">Account page is working! This is a simple version that loads immediately.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
