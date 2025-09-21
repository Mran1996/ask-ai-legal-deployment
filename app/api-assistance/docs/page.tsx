import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"

export default function APIDocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
            <p className="text-gray-600 mb-8">
              Comprehensive documentation for the Khristian Legal AI API endpoints and features.
            </p>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar Navigation */}
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-4">
                  <h2 className="font-bold mb-4">Documentation</h2>
                  <nav className="space-y-1">
                    <a href="#introduction" className="block px-3 py-2 rounded-md bg-teal-50 text-teal-600 font-medium">
                      Introduction
                    </a>
                    <a href="#authentication" className="block px-3 py-2 rounded-md hover:bg-gray-50">
                      Authentication
                    </a>
                    <a href="#rate-limits" className="block px-3 py-2 rounded-md hover:bg-gray-50">
                      Rate Limits
                    </a>
                    <a href="#errors" className="block px-3 py-2 rounded-md hover:bg-gray-50">
                      Error Handling
                    </a>
                    <div className="pt-2 pb-1">
                      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Endpoints</h3>
                    </div>
                    <a href="#documents" className="block px-3 py-2 rounded-md hover:bg-gray-50">
                      Documents
                    </a>
                    <a href="#chat" className="block px-3 py-2 rounded-md hover:bg-gray-50">
                      Chat
                    </a>
                    <a href="#jurisdictions" className="block px-3 py-2 rounded-md hover:bg-gray-50">
                      Jurisdictions
                    </a>
                    <a href="#webhooks" className="block px-3 py-2 rounded-md hover:bg-gray-50">
                      Webhooks
                    </a>
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-grow">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <section id="introduction" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                    <p className="mb-4">
                      The Khristian Legal AI API provides developers with programmatic access to our AI-powered legal
                      assistance platform. With this API, you can integrate legal document analysis, document
                      generation, and legal chat capabilities into your applications.
                    </p>
                    <p className="mb-4">
                      Our API follows RESTful principles and returns responses in JSON format. All API requests must be
                      made over HTTPS.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <h3 className="font-bold mb-2">Base URL</h3>
                      <code className="font-mono text-sm">https://api.askkhristian.com/v1</code>
                    </div>
                    <p>
                      The API is organized around resources such as documents, chat, and jurisdictions. Each resource
                      has specific endpoints for different operations.
                    </p>
                  </section>

                  <section id="authentication" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Authentication</h2>
                    <p className="mb-4">
                      All API requests require authentication using an API key. You can obtain an API key by creating a
                      developer account in the Khristian Developer Portal.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <h3 className="font-bold mb-2">API Key Authentication</h3>
                      <p className="mb-2">Include your API key in the Authorization header:</p>
                      <code className="font-mono text-sm block bg-gray-100 p-2 rounded">
                        Authorization: Bearer your_api_key_here
                      </code>
                    </div>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <p className="text-yellow-800">
                        <strong>Security Note:</strong> Keep your API key secure and never expose it in client-side
                        code. Always make API requests from your server.
                      </p>
                    </div>
                  </section>

                  <section id="rate-limits" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
                    <p className="mb-4">
                      API requests are subject to rate limiting to ensure fair usage and system stability. Rate limits
                      vary based on your subscription plan.
                    </p>
                    <table className="min-w-full border border-gray-200 mb-4">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 border-b text-left">Plan</th>
                          <th className="px-4 py-2 border-b text-left">Rate Limit</th>
                          <th className="px-4 py-2 border-b text-left">Monthly Quota</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-2 border-b">Developer</td>
                          <td className="px-4 py-2 border-b">60 requests per minute</td>
                          <td className="px-4 py-2 border-b">1,000 requests</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 border-b">Business</td>
                          <td className="px-4 py-2 border-b">120 requests per minute</td>
                          <td className="px-4 py-2 border-b">5,000 requests</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 border-b">Enterprise</td>
                          <td className="px-4 py-2 border-b">Custom</td>
                          <td className="px-4 py-2 border-b">Unlimited</td>
                        </tr>
                      </tbody>
                    </table>
                    <p>
                      Rate limit information is included in the response headers of each API request:
                      <code className="font-mono text-sm ml-2">X-RateLimit-Limit</code>,
                      <code className="font-mono text-sm ml-2">X-RateLimit-Remaining</code>, and
                      <code className="font-mono text-sm ml-2">X-RateLimit-Reset</code>.
                    </p>
                  </section>

                  {/* Additional sections would continue here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
