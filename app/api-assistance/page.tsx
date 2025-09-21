import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Copy, Check, Key, Lock, Server, Zap } from "lucide-react"

export default function APIAssistancePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-emerald-500 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Khristian API</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Integrate AI-powered legal assistance directly into your applications
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            {/* Overview Section */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6">API Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="mb-4 text-emerald-600">
                    <Zap className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Powerful Legal AI</h3>
                  <p className="text-gray-600">
                    Access our attorney-style AI to analyze legal documents, generate responses, and provide legal
                    guidance.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="mb-4 text-emerald-600">
                    <Server className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">RESTful API</h3>
                  <p className="text-gray-600">
                    Simple, secure REST API with comprehensive documentation and client libraries for major programming
                    languages.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="mb-4 text-emerald-600">
                    <Lock className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Secure & Compliant</h3>
                  <p className="text-gray-600">
                    Enterprise-grade security with encryption, authentication, and compliance with legal data handling
                    requirements.
                  </p>
                </div>
              </div>
            </div>

            {/* API Documentation Tabs */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6">API Documentation</h2>
              <Tabs defaultValue="quickstart">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="quickstart">Quickstart</TabsTrigger>
                  <TabsTrigger value="authentication">Authentication</TabsTrigger>
                  <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                </TabsList>

                {/* Quickstart Tab */}
                <TabsContent value="quickstart" className="p-6 border rounded-b-lg bg-white">
                  <h3 className="text-xl font-bold mb-4">Getting Started</h3>
                  <p className="mb-4">
                    Follow these steps to start integrating the Khristian Legal AI API into your application:
                  </p>

                  <ol className="space-y-4 mb-6">
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">
                        1
                      </div>
                      <div>
                        <h4 className="font-bold">Sign up for an API key</h4>
                        <p className="text-gray-600">
                          Create a developer account and generate your API key from the dashboard.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">
                        2
                      </div>
                      <div>
                        <h4 className="font-bold">Install the SDK</h4>
                        <p className="text-gray-600">
                          Use our client libraries for your preferred programming language.
                        </p>
                        <div className="mt-2 bg-gray-50 p-3 rounded-md font-mono text-sm">
                          npm install @khristian/legal-ai-sdk
                        </div>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">
                        3
                      </div>
                      <div>
                        <h4 className="font-bold">Make your first API call</h4>
                        <p className="text-gray-600">Start with a simple document analysis request.</p>
                        <div className="mt-2 relative">
                          <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
                            <pre>{`import { KhristianAI } from '@khristian/legal-ai-sdk';

// Initialize the client
const khristian = new KhristianAI({
  apiKey: 'your_api_key_here'
});

// Analyze a legal document
async function analyzeLegalDocument() {
  const response = await khristian.documents.analyze({
    documentText: 'This is an eviction notice...',
    documentType: 'eviction_notice',
    jurisdiction: 'WA'
  });
  
  console.log(response.analysis);
}`}</pre>
                          </div>
                          <button className="absolute top-2 right-2 p-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700">
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  </ol>

                  <Button className="bg-emerald-500 hover:bg-emerald-600">View Full Documentation</Button>
                </TabsContent>

                {/* Authentication Tab */}
                <TabsContent value="authentication" className="p-6 border rounded-b-lg bg-white">
                  <h3 className="text-xl font-bold mb-4">Authentication</h3>
                  <p className="mb-4">
                    The Khristian API uses API keys for authentication. Include your API key in the request headers.
                  </p>

                  <div className="mb-6">
                    <h4 className="font-bold mb-2">API Key Authentication</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex items-center gap-2 mb-4">
                        <Key className="h-5 w-5 text-emerald-600" />
                        <span className="font-medium">Your API Key</span>
                      </div>
                      <div className="flex gap-2">
                        <Input type="password" value="••••••••••••••••••••••••••••••" readOnly className="font-mono" />
                        <Button variant="outline" className="flex-shrink-0">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Keep your API key secure and never expose it in client-side code.
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold mb-2">Example Request with Authentication</h4>
                    <div className="relative">
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
                        <pre>{`// Using the SDK
const khristian = new KhristianAI({
  apiKey: 'your_api_key_here'
});

// Using fetch directly
const response = await fetch('https://api.askkhristian.com/v1/documents/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_api_key_here'
  },
  body: JSON.stringify({
    documentText: 'This is an eviction notice...',
    documentType: 'eviction_notice',
    jurisdiction: 'WA'
  })
});`}</pre>
                      </div>
                      <button className="absolute top-2 right-2 p-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </TabsContent>

                {/* Endpoints Tab */}
                <TabsContent value="endpoints" className="p-6 border rounded-b-lg bg-white">
                  <h3 className="text-xl font-bold mb-4">API Endpoints</h3>
                  <p className="mb-6">
                    The Khristian API provides the following endpoints for integrating legal AI capabilities:
                  </p>

                  <div className="space-y-6">
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b">
                        <div className="flex items-center">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium mr-2">
                            POST
                          </span>
                          <code className="font-mono text-sm">/v1/documents/analyze</code>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold mb-2">Analyze Document</h4>
                        <p className="text-gray-600 mb-2">
                          Analyze a legal document to extract key information and provide a summary.
                        </p>
                        <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-600">
                          View Documentation
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b">
                        <div className="flex items-center">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium mr-2">
                            POST
                          </span>
                          <code className="font-mono text-sm">/v1/documents/generate</code>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold mb-2">Generate Document</h4>
                        <p className="text-gray-600 mb-2">
                          Generate a legal document based on provided parameters and requirements.
                        </p>
                        <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-600">
                          View Documentation
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b">
                        <div className="flex items-center">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium mr-2">
                            POST
                          </span>
                          <code className="font-mono text-sm">/v1/chat/completions</code>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold mb-2">Legal Chat</h4>
                        <p className="text-gray-600 mb-2">
                          Get AI-powered responses to legal questions and follow-up inquiries.
                        </p>
                        <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-600">
                          View Documentation
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b">
                        <div className="flex items-center">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium mr-2">
                            GET
                          </span>
                          <code className="font-mono text-sm">/v1/jurisdictions</code>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold mb-2">Get Jurisdictions</h4>
                        <p className="text-gray-600 mb-2">
                          Retrieve a list of supported legal jurisdictions and their specific parameters.
                        </p>
                        <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-600">
                          View Documentation
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Examples Tab */}
                <TabsContent value="examples" className="p-6 border rounded-b-lg bg-white">
                  <h3 className="text-xl font-bold mb-4">Code Examples</h3>
                  <p className="mb-6">
                    Here are some examples of how to use the Khristian API for common legal assistance tasks:
                  </p>

                  <div className="space-y-8">
                    <div>
                      <h4 className="font-bold mb-2">Analyzing an Eviction Notice</h4>
                      <div className="relative">
                        <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
                          <pre>{`import { KhristianAI } from '@khristian/legal-ai-sdk';

const khristian = new KhristianAI({
  apiKey: 'your_api_key_here'
});

async function analyzeEvictionNotice() {
  const response = await khristian.documents.analyze({
    documentText: 'NOTICE TO VACATE: You are hereby notified that your tenancy will terminate in 30 days...',
    documentType: 'eviction_notice',
    jurisdiction: 'WA',
    options: {
      extractDeadlines: true,
      suggestResponses: true
    }
  });
  
  console.log('Document Type:', response.documentType);
  console.log('Key Deadlines:', response.deadlines);
  console.log('Suggested Responses:', response.suggestedResponses);
}`}</pre>
                        </div>
                        <button className="absolute top-2 right-2 p-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700">
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold mb-2">Generating a Response Letter</h4>
                      <div className="relative">
                        <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
                          <pre>{`import { KhristianAI } from '@khristian/legal-ai-sdk';

const khristian = new KhristianAI({
  apiKey: 'your_api_key_here'
});

async function generateResponseLetter() {
  const response = await khristian.documents.generate({
    documentType: 'response_letter',
    jurisdiction: 'WA',
    parameters: {
      recipientName: 'ABC Property Management',
      recipientAddress: '123 Main St, Seattle, WA 98101',
      senderName: 'Jane Doe',
      senderAddress: 'Apt 4B, 456 Pine St, Seattle, WA 98101',
      caseNumber: 'L&T-2025-12345',
      responseType: 'repair_request',
      issueDetails: 'The heating system has been non-functional for 14 days...',
      requestedAction: 'Immediate repair of the heating system and rent abatement'
    }
  });
  
  console.log('Generated Document:');
  console.log(response.documentText);
  
  // Save as PDF
  await khristian.documents.export({
    documentId: response.documentId,
    format: 'pdf',
    filename: 'response_letter.pdf'
  });
}`}</pre>
                        </div>
                        <button className="absolute top-2 right-2 p-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700">
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Pricing Section */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6">API Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Developer</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-3xl font-bold">$99</span>
                      <span className="text-gray-600 ml-1">/month</span>
                    </div>
                    <p className="text-gray-600 mb-6">For individual developers and small projects</p>

                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>1,000 API calls per month</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Document analysis</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Basic document generation</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Email support</span>
                      </li>
                    </ul>

                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Get Started</Button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-emerald-200 overflow-hidden relative">
                  <div className="absolute top-0 right-0">
                    <div className="bg-emerald-100 text-emerald-800 text-xs font-medium px-3 py-1 rounded-bl-lg">
                      Most Popular
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Business</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-3xl font-bold">$299</span>
                      <span className="text-gray-600 ml-1">/month</span>
                    </div>
                    <p className="text-gray-600 mb-6">For businesses and growing applications</p>

                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>5,000 API calls per month</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Advanced document analysis</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Custom document generation</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Priority support</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Webhooks</span>
                      </li>
                    </ul>

                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Get Started</Button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-3xl font-bold">Custom</span>
                    </div>
                    <p className="text-gray-600 mb-6">For large organizations with custom needs</p>

                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Unlimited API calls</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Full feature access</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Custom integrations</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Dedicated support</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>SLA guarantees</span>
                      </li>
                    </ul>

                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Contact Sales</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Sign up for a developer account today and start integrating AI-powered legal assistance into your
                applications.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-emerald-500 hover:bg-emerald-600">Create Developer Account</Button>
                <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
