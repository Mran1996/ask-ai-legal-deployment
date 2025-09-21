"use client";

import { useState, useEffect } from 'react';
import DownloadSection from './download-section';
import { useLegalAssistant } from './context/legal-assistant-context';
import { v4 as uuidv4 } from 'uuid';

// Example component showing how to use DownloadSection
export default function UsageExample() {
  const { userInfo } = useLegalAssistant();
  const [documentId, setDocumentId] = useState<string>('');
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('');

  // Example: Generate a document ID when component mounts
  useEffect(() => {
    // In a real app, this would come from your document creation process
    const generatedId = uuidv4();
    setDocumentId(generatedId);
    setDocumentTitle('Sample Legal Document');
  }, []);

  // Example: Check if analysis exists for this document
  useEffect(() => {
    if (documentId) {
      // In a real app, you would check your database
      // For now, we'll simulate having an analysis
      setHasAnalysis(true);
    }
  }, [documentId]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Document Management Example</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Document Information</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Document ID:</strong> {documentId}</p>
          <p><strong>Title:</strong> {documentTitle}</p>
          <p><strong>Has Analysis:</strong> {hasAnalysis ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {/* This is the DownloadSection component you can use */}
      <DownloadSection
        documentId={documentId}
        documentTitle={documentTitle}
        hasAnalysis={hasAnalysis}
      />

      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Integration Notes:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• The DownloadSection component handles all download logic</li>
          <li>• It automatically shows loading states during PDF generation</li>
          <li>• It provides user feedback via toast notifications</li>
          <li>• The analysis download is disabled if no analysis exists</li>
          <li>• Both downloads generate properly formatted PDFs</li>
        </ul>
      </div>
    </div>
  );
} 