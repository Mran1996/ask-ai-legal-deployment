"use client"

import React from 'react';

interface CaseSuccessAnalysisPanelProps {
  analysis: {
    snapshot: {
      title: string;
      jurisdiction: string;
      type: string;
    };
    keyInsights: string[];
    statutes: Array<{
      title: string;
      url?: string;
    }>;
    success: {
      rate: number;
      label: string;
      strengths: string[];
      risks: string[];
    };
    nextSteps: string[];
    confidence: {
      label: "High" | "Medium" | "Low";
      color: "green" | "yellow" | "red";
      description: string;
    };
  };
  onClose: () => void;
}

export function CaseSuccessAnalysisPanel({ analysis, onClose }: CaseSuccessAnalysisPanelProps) {
  if (!analysis) return null;

  // Section data extraction with fallbacks
  const snapshot = analysis.snapshot || {};
  const keyInsights = analysis.keyInsights || [];
  const statutes = analysis.statutes || [];
  const success = analysis.success || {};
  const nextSteps = analysis.nextSteps || [];
  const confidence = analysis.confidence || {};

  // Helper for blue links
  const renderStatute = (statute: any, i: number) => {
    if (typeof statute === 'string') return <li key={i} className="text-blue-700 underline break-words">{statute}</li>;
    if (statute.url) return <li key={i}><a href={statute.url} className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">{statute.title || statute.url}</a></li>;
    return <li key={i}>{statute.title || JSON.stringify(statute)}</li>;
  };

  return (
    <div className="mt-16 mb-8">
      {/* Header Bar */}
      <div className="bg-emerald-600 text-white py-4 px-6 rounded-t-xl flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">AI-Powered Case Success Analysis</h2>
          <p className="text-emerald-100">Expert insights tailored to your case, jurisdiction, and documentation.</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-emerald-100 focus:outline-none"
          aria-label="Close analysis panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white border-x border-b border-gray-200 rounded-b-xl shadow-lg p-8">
        {/* 1. Case Snapshot */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">1. Case Snapshot</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-medium block text-gray-600">Case Title</span>
              <span>{snapshot.title || '-'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-medium block text-gray-600">Jurisdiction</span>
              <span>{snapshot.jurisdiction || '-'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-medium block text-gray-600">Case Type</span>
              <span>{snapshot.type || '-'}</span>
            </div>
          </div>
        </div>

        {/* 2. Key Legal Insights & Statutes */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">2. Key Legal Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">Primary Issues</h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {keyInsights.length > 0 ? keyInsights.map((issue, i) => <li key={i}>{issue}</li>) : <li>-</li>}
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">Statutes & Precedents</h4>
              <ul className="list-disc pl-5 space-y-2">
                {statutes.length > 0 ? statutes.map(renderStatute) : <li>-</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Success Probability Assessment */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">3. Success Probability Assessment</h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="mb-4">
              <p className="font-medium text-gray-800 mb-2">Estimated Outcome:</p>
              <div className="flex items-center gap-3">
                <div className="h-4 w-64 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${success.rate || 0}%` }}></div>
                </div>
                <span className="text-emerald-700 font-semibold">{success.rate || '-'}% {success.label ? `– ${success.label}` : ''}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-3">Strengths</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {success.strengths?.length > 0 ? success.strengths.map((s, i) => <li key={i}>{s}</li>) : <li>-</li>}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-3">Risks</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {success.risks?.length > 0 ? success.risks.map((r, i) => <li key={i}>{r}</li>) : <li>-</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Action Plan */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">4. Action Plan – Next Steps</h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {nextSteps.length > 0 ? nextSteps.map((a, i) => <li key={i}>{a}</li>) : <li>-</li>}
            </ul>
          </div>
        </div>

        {/* 5. AI Confidence Level */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">5. AI Confidence Level</h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="mb-2">
              <span className="font-medium">Confidence Score: </span>
              <span className={
                confidence.color === 'green' ? 'text-green-600 font-medium' :
                confidence.color === 'yellow' ? 'text-yellow-600 font-medium' :
                confidence.color === 'red' ? 'text-red-600 font-medium' :
                'font-medium'
              }>
                {confidence.label || '-'}
              </span>
            </div>
            <p className="text-gray-700">{confidence.description || '-'}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500 italic">This AI summary is for informational purposes only.</p>
        </div>
      </div>
    </div>
  );
} 