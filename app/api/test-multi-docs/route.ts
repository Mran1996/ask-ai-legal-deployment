import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('🧪 [MULTI-DOC TEST] Testing multi-document functionality');
    console.log('🧪 [MULTI-DOC TEST] Request body:', {
      documentsCount: body.documents?.length || 0,
      documentNames: body.documents?.map((d: any) => d.filename) || [],
      hasDocumentContext: !!body.documentContext,
      documentContextLength: body.documentContext?.length || 0
    });

    // Simulate the chat API processing multiple documents
    const documents = body.documents || [];
    const documentContext = body.documentContext || "";
    
    let systemPrompt = `You are Khristian, a knowledgeable and friendly legal assistant. You help users understand legal documents and provide guidance on legal matters.`;
    
    if (documents.length > 0) {
      const documentInfo = documents.map((doc: any, index: number) => [
        `Document ${index + 1}: ${doc.filename}`,
        doc.documentType && `Type: ${doc.documentType}`,
        doc.caseNumber && `Case Number: ${doc.caseNumber}`,
        doc.courtName && `Court: ${doc.courtName}`,
        doc.opposingParty && `Opposing Party: ${doc.opposingParty}`,
        doc.filingDate && `Filing Date: ${doc.filingDate}`,
        doc.state && `State: ${doc.state}`,
        doc.judge && `Judge: ${doc.judge}`,
        doc.documentSummary && `Summary: ${doc.documentSummary}`
      ].filter(Boolean).join('\n')).join('\n\n');
      
      const documentText = documentContext ? 
        `\n\nDocument Contents:\n${documentContext.substring(0, 1000)}${documentContext.length > 1000 ? '...' : ''}` : '';
      
      systemPrompt = `You are Khristian, a knowledgeable and friendly legal assistant. You help users understand legal documents and provide guidance on legal matters.

IMPORTANT: The user has uploaded ${documents.length} legal documents and you have access to their content. You should reference these documents when responding to their questions.

Document Information:
${documentInfo}${documentText}

When the user asks about the documents, explain them clearly and reference specific details from the content above. You can refer to documents by number (Document 1, Document 2, etc.) or by filename. Be helpful, clear, and professional.`;
    }

    // Simulate a response
    const testMessage = body.messages?.[body.messages.length - 1]?.content || "Can you explain the uploaded documents?";
    
    let response = "I don't see any documents uploaded yet.";
    
    if (documents.length === 1) {
      response = `I can see you've uploaded 1 document: "${documents[0].filename}". This appears to be a ${documents[0].documentType || 'legal document'}. I can help you understand its contents and answer any questions you have about it.`;
    } else if (documents.length > 1) {
      response = `I can see you've uploaded ${documents.length} documents:\n\n` + 
        documents.map((doc: any, index: number) => 
          `${index + 1}. "${doc.filename}"${doc.documentType ? ` (${doc.documentType})` : ''}`
        ).join('\n') + 
        `\n\nI can help you understand the contents of all these documents and answer any questions you have about them. You can ask me to explain specific documents by number or filename.`;
    }

    console.log('🧪 [MULTI-DOC TEST] Generated response:', {
      responseLength: response.length,
      documentsReferenced: documents.length
    });

    return NextResponse.json({
      success: true,
      message: response,
      documentCount: documents.length,
      documentNames: documents.map((d: any) => d.filename),
      systemPromptLength: systemPrompt.length,
      test: "multi-document functionality working"
    });

  } catch (error) {
    console.error('🧪 [MULTI-DOC TEST] Error:', error);
    return NextResponse.json({
      error: 'Test failed',
      details: error.message
    }, { status: 500 });
  }
} 