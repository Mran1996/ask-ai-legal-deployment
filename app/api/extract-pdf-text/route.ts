import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use pdf-parse for server-side PDF text extraction
    const pdfParse = require('pdf-parse');
    
    const data = await pdfParse(buffer);
    const extractedText = data.text;

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json({ 
        text: `PDF Document: ${file.name}\n\nThis PDF document has been uploaded successfully. The document appears to be an image-based PDF or contains no extractable text.\n\nPlease provide a brief summary of what the document contains, and I'll be able to:\n• Explain the legal implications\n• Answer questions about its contents\n• Help you understand your rights and options\n• Assist with any legal actions you need to take\n\nWhat is this document about?`
      });
    }

    // Clean up the text
    const cleanText = extractedText
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();

    return NextResponse.json({ text: cleanText });

  } catch (error) {
    console.error('PDF extraction error:', error);
    return NextResponse.json({ 
      error: 'Failed to extract text from PDF',
      text: `PDF Document: ${file.name || 'Unknown'}\n\nThis PDF document has been uploaded successfully. There was an issue extracting the text content.\n\nPlease provide a brief summary of what the document contains, and I'll be able to:\n• Explain the legal implications\n• Answer questions about its contents\n• Help you understand your rights and options\n• Assist with any legal actions you need to take\n\nWhat is this document about?`
    }, { status: 500 });
  }
}
