"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Mail, Save, FileText, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { StepLayout } from "@/components/step-layout";
import { ProgressSteps } from "@/components/ProgressSteps";

// Function to calculate target document length based on uploaded pages
function calculateTargetLength(uploadedPages: number): { targetPages: number; targetWords: number } {
  let targetPages = 3;
  if (uploadedPages <= 15) targetPages = 3 + Math.ceil(uploadedPages * 0.1);
  else if (uploadedPages <= 40) targetPages = 6 + Math.ceil(uploadedPages * 0.12);
  else if (uploadedPages <= 80) targetPages = 12 + Math.ceil(uploadedPages * 0.08);
  else if (uploadedPages <= 150) targetPages = 18 + Math.ceil(uploadedPages * 0.07);
  else targetPages = 28 + Math.ceil(Math.min(uploadedPages, 400) * 0.05);
  
  // Estimate words (roughly 250 words per page)
  const targetWords = targetPages * 250;
  
  return { targetPages, targetWords };
}

// Function to determine if document type requires multiple documents
function requiresMultipleDocuments(documentType: string): boolean {
  const multiDocTypes = ['motion', 'appeal', 'rehearing', 'opposition', 'brief', 'petition'];
  return multiDocTypes.some(type => documentType.toLowerCase().includes(type));
}

// Function to estimate page count from text length
function estimatePageCount(textLength: number): number {
  // Rough estimate: 1 page ≈ 2000 characters
  return Math.ceil(textLength / 2000);
}

export default function Step2() {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [documentText, setDocumentText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingDocument, setLoadingDocument] = useState(false);
  const [caseAnalysis, setCaseAnalysis] = useState<any | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [processingLargeDocument, setProcessingLargeDocument] = useState(false);
  const [missingInfo, setMissingInfo] = useState<string[]>([]);
  const [documentPlan, setDocumentPlan] = useState<{
    uploadedPages: number;
    targetPages: number;
    targetWords: number;
    documentType: string;
    needsMultipleDocs: boolean;
    documentsToGenerate: string[];
  } | null>(null);

  // Generate unique session ID for user data isolation
  const sessionId = typeof window !== 'undefined' ? 
    localStorage.getItem('user_session_id') || 
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : 
    'default_session';
  
  // Set session ID if not exists
  if (typeof window !== 'undefined' && !localStorage.getItem('user_session_id')) {
    localStorage.setItem('user_session_id', sessionId);
  }

  // Check for docId parameter and load document
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const docId = urlParams.get('docId');
    
    if (docId) {
      loadDocumentFromAPI(docId);
    }
  }, []);

  const loadDocumentFromAPI = async (docId: string) => {
    setLoadingDocument(true);
    try {
      const response = await fetch(`/api/get-document/${docId}`);
      if (response.ok) {
        const data = await response.json();
        setDocumentText(data.content || '');
        console.log('✅ Document loaded from API:', data.title);
      } else {
        console.error('Failed to load document:', response.statusText);
        setError('Failed to load document');
      }
    } catch (error) {
      console.error('Error loading document:', error);
      setError('Error loading document');
    } finally {
      setLoadingDocument(false);
    }
  };

  // On mount, check if we have real data from Step 1
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    console.log("🔍 Checking for real data from Step 1...");
    
    // Check if we have real user data from Step 1
    const hasRealData = checkForRealUserData();
    
    if (hasRealData) {
      console.log("✅ Real data found from Step 1");
      // Load existing document if it exists
    const existingDocument = localStorage.getItem("finalDocument");
      if (existingDocument) {
        console.log("📝 Using existing document from Step 1");
        setDocumentText(existingDocument);
      }
    } else {
      console.log("❌ No real data found from Step 1");
      // Don't generate any document - show empty state
      setDocumentText("");
    }
  }, []);

  // Function to check if we have real user data from Step 1
  const checkForRealUserData = () => {
    if (typeof window === 'undefined') return false;
    
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const legalCategory = localStorage.getItem("legalCategory");
    const chatHistory = localStorage.getItem("step1_chat_history");
    const uploadedText = localStorage.getItem("uploaded_parsed_text");
    
    // We need at least basic user info and some chat history or uploaded documents
    const hasBasicInfo = firstName && lastName && legalCategory;
    const hasContent = (chatHistory && chatHistory.length > 10) || (uploadedText && uploadedText.length > 50);
    
    console.log("📊 Data check:", {
      hasBasicInfo,
      hasContent,
      firstName: !!firstName,
      lastName: !!lastName,
      legalCategory: !!legalCategory,
      chatHistoryLength: chatHistory ? chatHistory.length : 0,
      uploadedTextLength: uploadedText ? uploadedText.length : 0
    });
    
    return hasBasicInfo && hasContent;
  };

  // Calculate document plan when component mounts (no auto-generation)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const uploadedParsedText = localStorage.getItem("uploaded_parsed_text") || "";
    const documentType = localStorage.getItem("uploaded_document_type") || localStorage.getItem("documentType") || "";
    
    const uploadedPageCount = uploadedParsedText ? estimatePageCount(uploadedParsedText.length) : 0;
    const { targetPages, targetWords } = calculateTargetLength(uploadedPageCount);
    const needsMultipleDocs = requiresMultipleDocuments(documentType);
    
    const documentsToGenerate = needsMultipleDocs 
      ? ['Main Document', 'Supporting Declaration', 'Proposed Order', 'Proof of Service', 'Exhibit Index']
      : ['Main Document'];
    
    setDocumentPlan({
      uploadedPages: uploadedPageCount,
      targetPages,
      targetWords,
      documentType,
      needsMultipleDocs,
      documentsToGenerate
    });

    // No auto-generation - user must click the generate button
    console.log("📄 Document plan calculated - waiting for user to click generate button");
  }, []);

  // Cleanup function - clear all data when user leaves Step 2 without saving
  useEffect(() => {
    return () => {
      if (typeof window === 'undefined') return;
      
      // Check if user saved data before leaving
      const savedData = localStorage.getItem("pipeline_saved_data");
      if (!savedData) {
        // User didn't save, clear all Steps 1-5 data
        const keysToRemove = [
          // Step 1 data
          "firstName", "lastName", "legalType", "legalCategory",
          // Step 2 data  
          "state", "county", "city",
          // Step 3 data
          "uploaded_documents", "uploaded_case_number", "uploaded_court_name", 
          "uploaded_opposing_party", "uploaded_state", "uploaded_county", 
          "uploaded_document_type", "uploaded_parsed_text", "uploaded_judge", 
          "uploaded_filing_date",
          // Step 1 data
          "step1_chat_history", "chat_responses", "step1_documents",
          // Step 2 data
          "finalDocument", "generated_document_cache",
          // Additional data
          "legalIssue", "desiredOutcome", "additionalInfo", "includeCaseLaw",
          "caseNumber", "courtName", "documentType", "userFacts", "document_facts"
        ];
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log("🧹 Cleared all Steps 1-5 data - user can start fresh");
      }
    };
  }, []);

  const generateDocument = async () => {
    if (typeof window === 'undefined') {
      setError("Browser environment required");
      setGenerating(false);
      return;
    }
    
    try {
      setGenerating(true);
      setError(null);
      setDocumentText(""); // Clear any existing document
      
      console.log("🚀 Starting document generation with REAL data only...");
      
      // First check if we have real data from Step 1
      const hasRealData = checkForRealUserData();
      if (!hasRealData) {
        setError("No real data found from Step 1. Please complete Step 1 with your case information first.");
        setGenerating(false);
        return;
      }
      
      // Get real data from Step 1
      const firstName = localStorage.getItem("firstName");
      const lastName = localStorage.getItem("lastName");
      const legalCategory = localStorage.getItem("legalCategory");
      const legalIssue = localStorage.getItem("legalIssue");
      const desiredOutcome = localStorage.getItem("desiredOutcome");
      const additionalInfo = localStorage.getItem("additionalInfo");
      const includeCaseLaw = localStorage.getItem("includeCaseLaw") === "true";
      
      // Get chat history from Step 1
      let chatHistory: Array<{ sender: string; text: string }> = [];
      try {
        const chatHistoryStr = localStorage.getItem("step1_chat_history");
        if (chatHistoryStr) {
          chatHistory = JSON.parse(chatHistoryStr);
        }
      } catch (e) {
        console.error("Error parsing chat history:", e);
      }
      
      // Get uploaded document data
      const uploadedCaseNumber = localStorage.getItem("uploaded_case_number");
      const uploadedCourtName = localStorage.getItem("uploaded_court_name");
      const uploadedOpposingParty = localStorage.getItem("uploaded_opposing_party");
      const uploadedState = localStorage.getItem("uploaded_state");
      const uploadedCounty = localStorage.getItem("uploaded_county");
      const uploadedDocumentType = localStorage.getItem("uploaded_document_type");
      const uploadedParsedText = localStorage.getItem("uploaded_parsed_text");
      const uploadedJudge = localStorage.getItem("uploaded_judge");
      const uploadedFilingDate = localStorage.getItem("uploaded_filing_date");
      
      console.log("📊 Using REAL data from Step 1:", {
        firstName,
        lastName,
        legalCategory,
        legalIssue,
        chatHistoryLength: chatHistory.length,
        uploadedTextLength: uploadedParsedText ? uploadedParsedText.length : 0,
        hasCaseNumber: !!uploadedCaseNumber,
        hasCourtName: !!uploadedCourtName,
        hasOpposingParty: !!uploadedOpposingParty
      });
      
      // Prepare the data for OpenAI API call
      const payload = {
        userId: localStorage.getItem("userId") || uuidv4(),
        title: `${legalCategory || "Legal Document"} - ${firstName} ${lastName}`,
        caseNumber: uploadedCaseNumber || null,
        county: uploadedCounty || null,
        state: uploadedState || null,
        opposingParty: uploadedOpposingParty || null,
        courtName: uploadedCourtName || null,
        includeCaseLaw: includeCaseLaw,
        chatHistory: [
          // Include the uploaded document content as a user message
          ...(uploadedParsedText ? [{
            role: "user",
            content: `Document uploaded: ${uploadedParsedText.slice(0, 4000)}${uploadedParsedText.length > 4000 ? '...' : ''}`
          }] : []),
          // Include chat history from Step 1
          ...chatHistory.map(msg => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text
          })),
          // Include case details if available
          ...(uploadedCaseNumber || uploadedCourtName || uploadedState ? [{
            role: "user",
            content: `Case details - Case Number: ${uploadedCaseNumber || "Not provided"}, Court: ${uploadedCourtName || "Not provided"}, State: ${uploadedState || "Not provided"}, County: ${uploadedCounty || "Not provided"}`
          }] : [])
        ]
      };

      console.log("📤 Sending REAL data to OpenAI API:", payload);
      
      // Call the document generation API
      const response = await fetch("/api/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to generate document");
        setGenerating(false);
        return;
      }
      
      // Handle the API response format
      const result = await response.json();
      
      if (result.success && result.data?.docId) {
        // Fetch the document content using the docId
        const docResponse = await fetch(`/api/get-document/${result.data.docId}`);
        if (docResponse.ok) {
          const docData = await docResponse.json();
          if (docData.content) {
            setDocumentText(docData.content);
            localStorage.setItem("finalDocument", docData.content);
            localStorage.setItem("currentDocumentId", result.data.docId); // Store document ID for case analysis
            console.log("✅ Document generated successfully with REAL data!");
            console.log("✅ Document ID:", result.data.docId);
            toast.success('Legal document generated successfully using your real case information!');
            
            // 🚀 Automatically trigger case analysis after document generation
            console.log("🔍 Automatically triggering case analysis for generated document...");
            toast.info('Analyzing your document for case success insights...');
            setTimeout(() => {
              handleGenerateCaseAnalysis();
            }, 1000); // Small delay to ensure document state is updated
          } else {
            setError("Document content not found");
          }
        } else {
          setError("Failed to fetch document content");
        }
      } else {
        setError(result.error || "Failed to generate document");
        console.error("❌ API error:", result);
      }
      
      setGenerating(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to generate document");
      setGenerating(false);
    }
  };

  const handleGenerateDocument = async () => {
    // This function is called from useEffect for auto-generation
    // It simply calls the existing generateDocument function
    await generateDocument();
  };

  const handleSave = () => {
    try {
      // Save all data from Steps 1-5 to pipeline
      const savedData = {
        // Step 1 data
        firstName: localStorage.getItem("firstName"),
        lastName: localStorage.getItem("lastName"),
        legalType: localStorage.getItem("legalType"),
        legalCategory: localStorage.getItem("legalCategory"),
        
        // Step 2 data
        state: localStorage.getItem("state"),
        county: localStorage.getItem("county"),
        city: localStorage.getItem("city"),
        
        // Step 3 data
        uploadedDocuments: localStorage.getItem("uploaded_documents"),
        uploaded_case_number: localStorage.getItem("uploaded_case_number"),
        uploaded_court_name: localStorage.getItem("uploaded_court_name"),
        uploaded_opposing_party: localStorage.getItem("uploaded_opposing_party"),
        uploaded_state: localStorage.getItem("uploaded_state"),
        uploaded_county: localStorage.getItem("uploaded_county"),
        uploaded_document_type: localStorage.getItem("uploaded_document_type"),
        uploaded_parsed_text: localStorage.getItem("uploaded_parsed_text"),
        uploaded_judge: localStorage.getItem("uploaded_judge"),
        uploaded_filing_date: localStorage.getItem("uploaded_filing_date"),
        
        // Step 1 data
        chatHistory: localStorage.getItem("step1_chat_history"),
        chatResponses: localStorage.getItem("chat_responses"),
        step1_documents: localStorage.getItem("step1_documents"),
        
        // Step 2 data
        finalDocument: documentText,
        caseAnalysis: caseAnalysis,
        documentPlan: documentPlan,
        
        // Additional data
        legalIssue: localStorage.getItem("legalIssue"),
        desiredOutcome: localStorage.getItem("desiredOutcome"),
        additionalInfo: localStorage.getItem("additionalInfo"),
        includeCaseLaw: localStorage.getItem("includeCaseLaw"),
        caseNumber: localStorage.getItem("caseNumber"),
        courtName: localStorage.getItem("courtName"),
        documentType: localStorage.getItem("documentType"),
        userFacts: localStorage.getItem("userFacts"),
        document_facts: localStorage.getItem("document_facts"),
        
        // Timestamp
        savedAt: new Date().toISOString()
      };
      
      localStorage.setItem("pipeline_saved_data", JSON.stringify(savedData));
      localStorage.setItem("finalDocument", documentText);
      toast.success('All data saved to pipeline successfully!');
    } catch (err) {
      toast.error('Failed to save data');
    }
  };

  const handleEmail = () => {
    try {
      const subject = encodeURIComponent('Legal Document');
      const body = encodeURIComponent(documentText);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    } catch (err) {
      toast.error('Failed to open email client');
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([documentText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Legal_Document.txt';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Document downloaded!');
    } catch (err) {
      toast.error('Failed to download document');
    }
  };

  // Add handler for Generate AI Case Analysis
  const handleGenerateCaseAnalysis = async () => {
    setAnalysisLoading(true);
    setCaseAnalysis(null);
    try {
      // Gather all real data as before
      const firstName = localStorage.getItem("firstName") || "";
      const lastName = localStorage.getItem("lastName") || "";
      const legalCategory = localStorage.getItem("legalCategory") || "";
      const legalIssue = localStorage.getItem("legalIssue") || "";
      const desiredOutcome = localStorage.getItem("desiredOutcome") || "";
      const additionalInfo = localStorage.getItem("additionalInfo") || "";
      const includeCaseLaw = localStorage.getItem("includeCaseLaw") === "true";
      const uploadedJudge = localStorage.getItem("uploaded_judge");
      const uploadedFilingDate = localStorage.getItem("uploaded_filing_date");
      const userFacts = localStorage.getItem("userFacts") || localStorage.getItem("document_facts") || "";
      const plaintiffName = `${firstName} ${lastName}`.trim();
      const defendantName = localStorage.getItem("uploaded_opposing_party") || "";
      const caseNumber = localStorage.getItem("uploaded_case_number") || localStorage.getItem("caseNumber") || "";
      const courtName = localStorage.getItem("uploaded_court_name") || localStorage.getItem("courtName") || "";
      const county = localStorage.getItem("uploaded_county") || localStorage.getItem("county") || "";
      const state = localStorage.getItem("uploaded_state") || localStorage.getItem("state") || "";
      const documentType = localStorage.getItem("uploaded_document_type") || localStorage.getItem("documentType") || "";
      const uploaded_parsed_text = localStorage.getItem("uploaded_parsed_text") || "";
      let chatResponses: string[] = [];
      try {
        const chatResponsesStr = localStorage.getItem("chat_responses");
        if (chatResponsesStr) {
          chatResponses = JSON.parse(chatResponsesStr);
        }
      } catch (e) {}
      
      // ✅ Get the document ID from URL params or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const docId = urlParams.get('docId') || localStorage.getItem('currentDocumentId');
      
      // ✅ Load document text from multiple sources
      let documentTextForAnalysis = documentText; // Use current documentText state
      
      // If no document text in state, try to load from localStorage or API
      if (!documentTextForAnalysis || documentTextForAnalysis.trim().length === 0) {
        // Try localStorage first
        const storedDocument = localStorage.getItem("finalDocument");
        if (storedDocument) {
          documentTextForAnalysis = storedDocument;
          console.log("📄 Using document from localStorage");
        } else if (docId) {
          // Try to load from API
          try {
            const response = await fetch(`/api/get-document/${docId}`);
            if (response.ok) {
              const data = await response.json();
              documentTextForAnalysis = data.content || '';
              console.log("📄 Loaded document from API");
            }
          } catch (error) {
            console.error("Error loading document from API:", error);
          }
        }
      }
      
      console.log("📊 Document text for analysis:", {
        hasDocumentText: !!documentTextForAnalysis,
        documentLength: documentTextForAnalysis?.length || 0,
        docId: docId
      });
      
      // If still no document text, provide a helpful message
      if (!documentTextForAnalysis || documentTextForAnalysis.trim().length === 0) {
        console.log("⚠️ No document text available for analysis");
        setCaseAnalysis({
          successRate: 0,
          title: `${plaintiffName || 'Plaintiff'} v. ${defendantName || 'Defendant'}`,
          jurisdiction: `${courtName || 'Court'}, ${state || 'State'}`,
          caseType: legalCategory || "Legal Matter",
          primaryIssues: ["No legal document available for analysis"],
          statutes: ["Document generation required"],
          outcomeEstimate: "Cannot estimate outcome - legal document not generated",
          strengths: ["Case information gathered"],
          weaknesses: ["Legal document not available for analysis"],
          timeline: "Document generation required first",
          actionPlan: "Generate a legal document first, then run case analysis",
          riskStrategy: "Complete document generation before analysis"
        });
        setAnalysisLoading(false);
        return;
      }
      
      const response = await fetch("/api/case-success-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: documentTextForAnalysis, // Use the properly loaded document text
          documentId: docId, // Pass document ID to link analysis to document
          state,
          legalCategory,
          courtName,
          caseNumber,
          userInfo: { firstName, lastName },
          caseInfo: {
            legalIssue,
            desiredOutcome,
            opposingParty: defendantName,
            additionalInfo,
            chatResponses,
            userFacts,
            documentType,
            county,
            judge: uploadedJudge,
            filingDate: uploadedFilingDate,
          },
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Case analysis API error:", response.status, errorText);
        setCaseAnalysis({ 
          error: `Failed to generate case analysis. ${response.status === 500 ? 'Server error.' : 'Please try again.'}` 
        });
        setAnalysisLoading(false);
        return;
      }
      const text = await response.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        // Try to extract JSON from text
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            parsed = JSON.parse(match[0]);
          } catch {
            parsed = { error: "Could not parse analysis response." };
          }
        } else {
          parsed = { error: "Could not parse analysis response." };
        }
      }
      setCaseAnalysis(parsed);
    } catch (err) {
      setCaseAnalysis({ error: "Failed to generate case analysis." });
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Add handler for Download Case Analysis
  const handleDownloadCaseAnalysis = () => {
    toast.info('Download AI Case Analysis coming soon!');
  };

    return (
    <StepLayout 
      headerTitle="Your Document is Ready"
      headerSubtitle="Review, edit, and download your legal document"
    >
      <div className="max-w-2xl mx-auto mt-8">
        <div className="mb-4"><ProgressSteps current="document" /></div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-center text-gray-700 font-semibold text-2xl">
              Step 2: Document Generation
            </div>
          </div>
          
          {/* Missing Information Notice - Removed per user request */}
          
          {/* Document Generation Info Bar - Hidden */}
          {false && documentPlan && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-800">Document Generation Plan</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
                <div><span className="font-medium">Uploaded Pages:</span> {documentPlan?.uploadedPages}</div>
                <div><span className="font-medium">Target Length:</span> {documentPlan?.targetPages} pages ({documentPlan?.targetWords?.toLocaleString()} words)</div>
                <div><span className="font-medium">Document Type:</span> {documentPlan?.documentType || 'Not specified'}</div>
                <div><span className="font-medium">Multiple Documents:</span> {documentPlan?.needsMultipleDocs ? 'Yes' : 'No'}</div>
              </div>
              {documentPlan?.needsMultipleDocs && (
                <div className="mt-2">
                  <span className="font-medium text-blue-700">Documents to Generate:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {documentPlan?.documentsToGenerate?.map((doc, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
                      <div className="w-full max-w-5xl mx-auto flex flex-row flex-wrap gap-2 mb-4 justify-center overflow-x-auto pb-2">
              {/* Only show generate button when real data is available */}
              {checkForRealUserData() && !documentText && (
                <Button 
                  onClick={generateDocument} 
                  disabled={generating} 
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {generating ? <Loader2 className="animate-spin mr-2" /> : null}
                  Generate Legal Document
                </Button>
              )}
              <Button onClick={handleSave} disabled={generating} className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
              <Button onClick={handleEmail} disabled={generating} className="bg-amber-500 hover:bg-amber-600 text-white">Email</Button>
              <Button onClick={handleDownload} disabled={generating} className="bg-purple-600 hover:bg-purple-700 text-white">Download</Button>
            </div>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          
          {/* Show message when no real data is available */}
          {!checkForRealUserData() && !documentText && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Case Information Found</h3>
                <p className="text-yellow-700 mb-4">
                  To generate a legal document, you need to complete Step 1 first with your case information.
                </p>
                <Button 
                  onClick={() => router.push('/ai-assistant/step-1')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Go to Step 1 - Provide Case Information
                </Button>
              </div>
            </div>
          )}
          
          <Textarea
            className="w-full min-h-[300px] font-mono text-base"
            value={documentText}
            onChange={e => setDocumentText(e.target.value)}
            disabled={generating || loadingDocument}
            placeholder={
              loadingDocument ? "Loading document..." : 
              !checkForRealUserData() ? "Complete Step 1 first to generate your legal document..." :
              "Your generated legal document will appear here..."
            }
          />
          {generating && <div className="flex items-center mt-2 text-gray-500"><Loader2 className="animate-spin mr-2" /> Generating document...</div>}
          {loadingDocument && <div className="flex items-center mt-2 text-blue-500"><Loader2 className="animate-spin mr-2" /> Loading document...</div>}
          {processingLargeDocument && (
            <div className="flex items-center mt-2 text-blue-600">
              <Loader2 className="animate-spin mr-2" /> 
              Processing large document... This may take a few minutes for comprehensive analysis.
            </div>
          )}
        </div>
        
                {/* New Case Analysis Box */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 pb-12">
          <div className="text-xl font-bold text-green-800 mb-2">AI-Powered Case Success Analysis</div>
          
          {/* Generate AI Case Analysis Buttons - Always visible at the top */}
          <div className="w-full max-w-5xl mx-auto flex flex-row flex-wrap gap-2 mb-4 justify-center overflow-x-auto pb-2">
            <Button 
              onClick={handleGenerateCaseAnalysis} 
              className="bg-green-600 hover:bg-green-700 text-white" 
              disabled={analysisLoading}
            >
              {analysisLoading ? <Loader2 className="animate-spin mr-2 inline-block" /> : null}
              {analysisLoading ? "Analyzing Case..." : "Generate AI Case Analysis"}
            </Button>
            <Button 
              onClick={handleDownloadCaseAnalysis} 
              className="bg-teal-600 hover:bg-teal-700 text-white" 
              disabled={generating}
            >
              Download AI Case Analysis
            </Button>
          </div>
          
           <div className="max-h-[400px] overflow-y-auto pr-2">
             {caseAnalysis ? (
               caseAnalysis.error ? (
                 <div className="text-red-600">{caseAnalysis.error}</div>
               ) : (
                 <div className="prose max-w-none">
                   <h2 className="text-2xl font-bold mb-2">{caseAnalysis.title || "Case Analysis"}</h2>
                   <div className="mb-2"><b>Jurisdiction:</b> {caseAnalysis.jurisdiction}</div>
                   <div className="mb-2"><b>Case Type:</b> {caseAnalysis.caseType}</div>
                   <div className="mb-2"><b>Success Rate:</b> {caseAnalysis.successRate}%</div>
                   <div className="mb-2"><b>Primary Issues:</b> {Array.isArray(caseAnalysis.primaryIssues) ? caseAnalysis.primaryIssues.join(", ") : caseAnalysis.primaryIssues}</div>
                   <div className="mb-2"><b>Statutes:</b> {Array.isArray(caseAnalysis.statutes) ? caseAnalysis.statutes.join(", ") : caseAnalysis.statutes}</div>
                   <div className="mb-2"><b>Outcome Estimate:</b> {caseAnalysis.outcomeEstimate}</div>
                   <div className="mb-2"><b>Strengths:</b>
                     <ul className="list-disc ml-6">
                       {Array.isArray(caseAnalysis.strengths) ? caseAnalysis.strengths.map((s: string, i: number) => <li key={i}>{s}</li>) : <li>{caseAnalysis.strengths}</li>}
                     </ul>
                   </div>
                   <div className="mb-2"><b>Weaknesses:</b>
                     <ul className="list-disc ml-6">
                       {Array.isArray(caseAnalysis.weaknesses) ? caseAnalysis.weaknesses.map((w: string, i: number) => <li key={i}>{w}</li>) : <li>{caseAnalysis.weaknesses}</li>}
                     </ul>
                   </div>
                   <div className="mb-2"><b>Timeline:</b> {caseAnalysis.timeline}</div>
                   <div className="mb-2"><b>Action Plan:</b> {caseAnalysis.actionPlan}</div>
                   <div className="mb-2"><b>Risk Strategy:</b> {caseAnalysis.riskStrategy}</div>
                 </div>
               )
             ) : (
               <div className="text-gray-500 mb-4">Click "Generate AI Case Analysis" to see expert insights for your legal matter.</div>
             )}
           </div>
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={() => router.back()}>Previous</Button>
            <Button className="bg-green-700 hover:bg-green-800 text-white" onClick={() => router.push('/ai-assistant/step-2/message')}>Message</Button>
          </div>
        </div>
      </div>
    </StepLayout>
  );
} 