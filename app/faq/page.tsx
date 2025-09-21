"use client"

import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { FileText, Users, Briefcase, Scale, Globe, Gavel, HelpCircle, Upload, Brain, FileOutput } from "lucide-react"

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h1>

            {/* FAQ Item 1 */}
            <div className="mb-12 border border-gray-100 rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <FileText className="text-emerald-600 mt-1 flex-shrink-0" />
                <h2 className="text-xl font-semibold">What types of legal issues can Ask AI Legal help me with?</h2>
              </div>
              <div className="ml-9">
                <p className="mb-4">We support a wide range of legal matters including:</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <span className="font-medium">Housing:</span> Eviction notices, repair demands, security deposits,
                      and lease disputes
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-medium">Family:</span> Divorce filings, custody agreements, child support
                      enforcement
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Briefcase className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <span className="font-medium">Employment:</span> Wage disputes, discrimination, wrongful
                      termination, benefits appeals
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Scale className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <span className="font-medium">Civil:</span> Lawsuits, small claims, settlements, breach of
                      contract
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <Globe className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <span className="font-medium">Immigration:</span> Visa requests, green card issues, citizenship
                      forms
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Gavel className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <span className="font-medium">Criminal:</span> Defense responses, rights explanations, expungement
                      requests
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="mb-12 border border-gray-100 rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <HelpCircle className="text-emerald-600 mt-1 flex-shrink-0" />
                <h2 className="text-xl font-semibold">Do I need a lawyer to use Ask AI Legal?</h2>
              </div>
              <div className="ml-9">
                <p>
                  No. Ask AI Legal is designed for self-represented individuals who need help drafting documents or
                  understanding their legal options. We do not offer legal representation, but we make it easy to
                  prepare professional legal paperwork.
                </p>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="mb-12 border border-gray-100 rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <Upload className="text-emerald-600 mt-1 flex-shrink-0" />
                <h2 className="text-xl font-semibold">Can I upload evidence or documents to get better results?</h2>
              </div>
              <div className="ml-9">
                <p>
                  Yes, you can upload leases, contracts, pay stubs, or other legal paperwork. Our assistant will use
                  that information to generate more accurate letters or motions.
                </p>
              </div>
            </div>

            {/* FAQ Item 4 */}
            <div className="mb-12 border border-gray-100 rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <Brain className="text-emerald-600 mt-1 flex-shrink-0" />
                <h2 className="text-xl font-semibold">
                  What makes Ask AI Legal different from a lawyer or other apps?
                </h2>
              </div>
              <div className="ml-9">
                <p>
                  Unlike traditional legal software, we use AI trained in legal logic and state-specific formatting. You
                  don't have to fill in templates — Ask AI Legal creates your documents based on your answers, tone, and
                  goals.
                </p>
              </div>
            </div>

            {/* FAQ Item 5 */}
            <div className="mb-12 border border-gray-100 rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <FileOutput className="text-emerald-600 mt-1 flex-shrink-0" />
                <h2 className="text-xl font-semibold">What happens after I generate my legal document?</h2>
              </div>
              <div className="ml-9">
                <p>
                  You can edit, save, download, or pay $25 to have us mail it to the opposing party. We guide you
                  through your next legal step with confidence messaging and suggestions.
                </p>
              </div>
            </div>

            {/* Still have questions section */}
            <div className="text-center mt-16 mb-12">
              <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
              <p className="mb-6">Our support team is here to help you navigate your legal journey.</p>
              <Button
                className="bg-emerald-500 hover:bg-emerald-600"
                onClick={() => (window.location.href = "/contact")}
                asChild
              >
                <a href="/contact">Contact Support</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
