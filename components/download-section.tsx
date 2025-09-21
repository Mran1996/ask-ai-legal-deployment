"use client";

import { useState } from 'react';
import { FileText, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { downloadPDF } from '@/utils/downloadFile';

interface DownloadSectionProps {
  documentId: string;
  documentTitle?: string;
  hasAnalysis?: boolean;
}

export default function DownloadSection({ 
  documentId, 
  documentTitle = "Legal Document",
  hasAnalysis = false 
}: DownloadSectionProps) {
  const [downloadingDocument, setDownloadingDocument] = useState(false);
  const [downloadingAnalysis, setDownloadingAnalysis] = useState(false);

  const handleDownload = async (type: 'document' | 'analysis') => {
    if (type === 'document') {
      setDownloadingDocument(true);
    } else {
      if (!hasAnalysis) {
        toast({
          title: "No Analysis Available",
          description: "Please generate a case analysis first.",
          variant: "destructive",
        });
        return;
      }
      setDownloadingAnalysis(true);
    }

    try {
      await downloadPDF(type, documentId, documentTitle);
      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} downloaded successfully!`,
      });
    } catch (error) {
      console.error(`Download ${type} error:`, error);
      toast({
        title: "Error",
        description: `Failed to download ${type}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      if (type === 'document') {
        setDownloadingDocument(false);
      } else {
        setDownloadingAnalysis(false);
      }
    }
  };

  return (
    <div className="mt-6 border rounded-md bg-gray-50 p-4">
      <h3 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
        <span className="inline-block">📂</span> Download Your Files
      </h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => handleDownload('document')}
          disabled={downloadingDocument}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
        >
          {downloadingDocument ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating PDF...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Download Legal Document
            </div>
          )}
        </Button>
        
        <Button
          onClick={() => handleDownload('analysis')}
          disabled={downloadingAnalysis || !hasAnalysis}
          className={`w-full sm:w-auto font-medium py-3 px-6 rounded-lg transition text-white ${
            hasAnalysis 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-green-500 opacity-50 cursor-not-allowed'
          }`}
        >
          {downloadingAnalysis ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating PDF...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4" />
              Download AI Case Analysis
            </div>
          )}
        </Button>
      </div>
      
      {!hasAnalysis && (
        <p className="text-sm text-gray-600 mt-2">
          Generate a case analysis first to download it as a PDF.
        </p>
      )}
    </div>
  );
} 