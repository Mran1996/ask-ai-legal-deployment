"use client"

import { useState } from "react"
import {
  BadgeCheck,
  CreditCard,
  CalendarCheck,
  DollarSign,
  Download,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BillingPage() {
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(false)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-4">Choose Your Plan</h2>
      <p className="text-center text-gray-600 mb-12">
        Get professional legal documents — no law firm required.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Legal Start */}
        <div className="border rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-2">💼 Quick Legal Start</h3>
          <p className="text-3xl font-bold text-green-600 mb-4">$59</p>
          <ul className="text-sm space-y-2 mb-4">
            <li>✅ Up to 15 pages</li>
            <li>✅ 1 AI-generated legal response</li>
            <li>✅ Plain-language summary</li>
            <li>✅ No legal citations</li>
            <li>✅ PDF + DOCX download included</li>
          </ul>
          <p className="text-sm text-gray-600 mb-2">
            🧑‍⚖️ You'll be guided step-by-step and receive a ready-to-file document — without the cost of hiring an attorney.
          </p>
          <p className="text-green-600 text-sm font-medium">Ideal for notices, demand letters, or simple disputes</p>
          <button className="mt-4 w-full bg-green-600 text-white rounded-lg py-2 hover:bg-green-700">
            Get Quick Help
          </button>
        </div>

        {/* Court-Ready Docs */}
        <div className="border-2 border-green-600 rounded-xl p-6 shadow-lg relative">
          <span className="absolute top-4 right-4 text-xs bg-green-600 text-white px-2 py-1 rounded-full">
            Most Popular
          </span>
          <h3 className="text-xl font-semibold mb-2">⚖️ Court-Ready Docs</h3>
          <p className="text-3xl font-bold text-green-600 mb-4">$179</p>
          <ul className="text-sm space-y-2 mb-4">
            <li>✅ Up to 30 pages (up to 3 docs)</li>
            <li>✅ Tailored AI legal response</li>
            <li>✅ Legal suggestions included</li>
            <li>✅ Case Success Analysis</li>
            <li>✅ Step-by-step filing checklist</li>
            <li>✅ 1 revision included</li>
            <li>✅ Priority email support</li>
            <li>✅ PDF + DOCX formatting</li>
          </ul>
          <p className="text-sm text-gray-600 mb-2">
            🧑‍⚖️ Guided like an attorney would — fast, affordable, and ready to file.
          </p>
          <p className="text-green-600 text-sm font-medium">
            Best for criminal filings, post-conviction motions, civil claims, or complex disputes
          </p>
          <button className="mt-4 w-full bg-green-600 text-white rounded-lg py-2 hover:bg-green-700">
            Get File-Ready Help
          </button>
        </div>

        {/* CaseBuilder Pro */}
        <div className="border rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-2">🔒 CaseBuilder Pro</h3>
          <p className="text-3xl font-bold text-green-600 mb-4">$549</p>
          <ul className="text-sm space-y-2 mb-4">
            <li>✅ Up to 75 pages</li>
            <li>✅ Attorney-quality AI response</li>
            <li>✅ Includes case law + citations</li>
            <li>✅ 2 revisions included</li>
            <li>✅ Case Success Analysis</li>
            <li>✅ Legal strategy suggestions</li>
            <li>✅ Priority email + phone support</li>
            <li>✅ PDF + DOCX output</li>
            <li>✅ Filing checklist included</li>
          </ul>
          <p className="text-sm text-gray-600 mb-2">
            🧑‍⚖️ Built for high-stakes legal actions — get a court-ready document you can trust.
          </p>
          <p className="text-green-600 text-sm font-medium">
            Perfect for major disputes, motions to vacate, appeals, or multi-doc cases
          </p>
          <button className="mt-4 w-full bg-green-600 text-white rounded-lg py-2 hover:bg-green-700">
            Get Legal Draft Help
          </button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center">
                <BadgeCheck className="text-teal-600 w-5 h-5 mr-2" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-xl text-gray-900">Pro Plan</h3>
                  <p className="text-gray-500 text-sm mt-1">Billed monthly • Renews on May 15, 2025</p>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  $149<span className="text-sm font-normal text-gray-500">/month</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start">
                  <BadgeCheck className="w-4 h-4 text-teal-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Unlimited AI legal assistant access</span>
                </div>
                <div className="flex items-start">
                  <BadgeCheck className="w-4 h-4 text-teal-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Priority support response</span>
                </div>
                <div className="flex items-start">
                  <BadgeCheck className="w-4 h-4 text-teal-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Document analysis & storage</span>
                </div>
                <div className="flex items-start">
                  <BadgeCheck className="w-4 h-4 text-teal-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Advanced legal research tools</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between border-t pt-6">
              <Button variant="outline">Change Plan</Button>
              <Button variant="destructive" className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700">
                Cancel Subscription
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center">
                <CreditCard className="text-teal-600 w-5 h-5 mr-2" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center">
                  <div className="w-12 h-8 bg-blue-600 rounded mr-4 flex items-center justify-center text-white font-bold">
                    VISA
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-gray-500">Expires 03/27</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                  <div className="flex items-center">
                    <div className="w-12 h-8 bg-blue-600 rounded mr-4 flex items-center justify-center text-white font-bold">
                      VISA
                    </div>
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-gray-500">Expires 03/27 • Default</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Billing History</CardTitle>
              <CardDescription>View and download your past invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "Apr 15, 2025", amount: "$149.00", status: "Paid", id: "INV-2025-0412" },
                  { date: "Mar 15, 2025", amount: "$149.00", status: "Paid", id: "INV-2025-0311" },
                  { date: "Feb 15, 2025", amount: "$149.00", status: "Paid", id: "INV-2025-0215" },
                ].map((invoice, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-3"
                  >
                    <div className="flex items-center gap-4">
                      <CalendarCheck className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{invoice.date}</p>
                        <p className="text-xs text-gray-500">{invoice.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center ml-9 sm:ml-0">
                      <div className="flex items-center mr-6">
                        <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                        <span className="font-medium">{invoice.amount}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs mr-4">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        {invoice.status}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 border-t pt-6">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsPaymentExpanded(!isPaymentExpanded)}
        >
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="font-medium">Billing FAQs</h3>
          </div>
          {isPaymentExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>

        {isPaymentExpanded && (
          <div className="mt-4 space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">When will I be charged?</h4>
              <p>
                Your subscription renews automatically on the 15th of each month. You'll receive an email receipt after
                each payment.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">How do I cancel my subscription?</h4>
              <p>
                You can cancel your subscription at any time from the billing page. Your access will continue until the
                end of your current billing period.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Can I get a refund?</h4>
              <p>
                We offer a 7-day money-back guarantee for new subscriptions. Please contact our support team for
                assistance with refunds.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
