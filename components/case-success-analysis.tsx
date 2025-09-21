"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface CaseSuccessAnalysisProps {
  isOpen: boolean
  onClose: () => void
  caseDetails: {
    title: string
    jurisdiction: string
    type: string
    successRate: number
  }
}

export default function CaseSuccessAnalysis({ caseInfo }: { caseInfo: any }) {
  const { title, jurisdiction, caseType, primaryIssues, statutes, outcomeEstimate, strengths, weaknesses, timeline, actionPlan, riskStrategy } = caseInfo;

  return (
    <div className="rounded-lg border shadow-sm p-6 bg-white space-y-6">
      <div className="bg-green-600 text-white p-4 rounded-t-lg font-semibold text-lg">
        AI-Powered Case Success Analysis
        <p className="text-sm font-normal mt-1">Tailored insights for your case, jurisdiction, and legal documents.</p>
      </div>

      {/* Section 1 */}
      <section>
        <h2 className="font-semibold text-gray-800 text-base mb-2">1. Case Snapshot</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div><strong>Case Title:</strong> {title}</div>
          <div><strong>Jurisdiction:</strong> {jurisdiction}</div>
          <div><strong>Case Type:</strong> {caseType}</div>
        </div>
      </section>

      {/* Section 2 */}
      <section>
        <h2 className="font-semibold text-gray-800 text-base mb-2">2. Legal Issues & Case Law</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Primary Legal Issues:</strong>
            <ul className="list-disc list-inside text-gray-700 mt-1">
              {primaryIssues.map((issue: string, i: number) => <li key={i}>{issue}</li>)}
            </ul>
          </div>
          <div>
            <strong>Relevant Statutes & Precedents:</strong>
            <ul className="list-disc list-inside text-gray-700 mt-1">
              {statutes.map((statute: string, i: number) => <li key={i}>{statute}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section>
        <h2 className="font-semibold text-gray-800 text-base mb-2">3. Strengths & Weaknesses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Strengths:</strong>
            <ul className="list-disc list-inside mt-1 text-green-700">
              {strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div>
            <strong>Weaknesses:</strong>
            <ul className="list-disc list-inside mt-1 text-red-700">
              {weaknesses.map((w: string, i: number) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* Section 4 */}
      <section>
        <h2 className="font-semibold text-gray-800 text-base mb-2">4. Estimated Outcome & Timeline</h2>
        <p className="text-sm mb-2"><strong>Estimated Outcome:</strong> <span className="text-blue-700">{outcomeEstimate}</span></p>
        <p className="text-sm"><strong>Expected Timeline:</strong> {timeline}</p>
      </section>

      {/* Section 5 */}
      <section>
        <h2 className="font-semibold text-gray-800 text-base mb-2">5. Action Plan – Next Legal Steps</h2>
        <p className="text-sm text-gray-700">{actionPlan}</p>
      </section>

      {/* Section 6 */}
      <section>
        <h2 className="font-semibold text-gray-800 text-base mb-2">6. Risk Mitigation & Recommendations</h2>
        <p className="text-sm text-gray-700">{riskStrategy}</p>
      </section>

      <footer className="text-xs text-center text-gray-400 mt-6 italic">
        This AI summary is for informational purposes only and should not be taken as legal advice.
      </footer>
    </div>
  );
}
