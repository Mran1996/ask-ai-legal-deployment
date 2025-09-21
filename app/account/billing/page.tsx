"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ViewPurchaseHistory from "@/components/ViewPurchaseHistory"
import { useSupabase } from '@/components/SupabaseProvider';
import { User } from '@supabase/supabase-js';
import { Briefcase, CheckCircle2, Download, History } from "lucide-react"

const billingHistory = [
  {
    date: "2024-05-01",
    description: "Pro Plan Renewal",
    amount: "$149.00",
    invoiceUrl: "/invoices/invoice-2024-05-01.pdf",
  },
  {
    date: "2023-05-01",
    description: "Pro Plan Renewal",
    amount: "$149.00",
    invoiceUrl: "/invoices/invoice-2023-05-01.pdf",
  },
]

type BillingStatus = "loading" | "active" | "inactive"

export default function BillingPage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = useSupabase();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);
  const [status, setStatus] = useState<BillingStatus>("loading")
  const [showAllHistory, setShowAllHistory] = useState(false)
  const [showPlans, setShowPlans] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user?.id) return
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/check-active?userId=${user.id}`)
        const data = await res.json()
        setStatus(data.active ? "active" : "inactive")
      } catch (err) {
        console.error("Status check failed:", err)
        setStatus("inactive")
      }
    }
    checkStatus()
  }, [user?.id])

  const handleDownloadReceipt = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/receipt?userId=${user?.id}`)
      const data = await res.json()
      if (data?.url) {
        window.open(data.url, "_blank")
      } else {
        alert("Receipt not found.")
      }
    } catch (err) {
      console.error("Error downloading receipt", err)
      alert("Something went wrong.")
    }
    setLoading(false)
  }

  // Mock data
  const planName = "AI Legal Premium"
  const nextBilling = "August 21, 2025"
  const features = [
    "Unlimited legal documents (up to 150 pages each)",
    "Unlimited AI-powered revisions",
    "Real case law embedded",
    "Case Success Analysis",
    "Delivered in PDF + DOCX",
    "Email + Phone Support"
  ]

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Billing & Payments</h1>
      {/* Plan status box */}
      <div className="rounded-xl border border-gray-200 bg-green-50 p-5 flex items-center gap-4 mb-6">
        <Briefcase className="w-8 h-8 text-gray-700" />
        <div>
          <div className="text-lg">
            You&apos;re on the <span className="font-bold">{planName}</span> Plan
          </div>
          <div className="text-base mt-1">Next billing: <span className="font-semibold">{nextBilling}</span></div>
        </div>
      </div>
      {/* Features list */}
      <ul className="mb-8 space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="flex items-center gap-2 border rounded-lg px-6 py-3 text-lg font-medium bg-white hover:bg-gray-50 transition">
          <Download className="w-5 h-5" />
          Download Receipt
        </button>
        <button className="flex items-center gap-2 border rounded-lg px-6 py-3 text-lg font-medium bg-white hover:bg-gray-50 transition">
          <History className="w-5 h-5" />
          View Purchase History
        </button>
      </div>
    </div>
  )
} 