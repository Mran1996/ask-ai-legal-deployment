import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const name = file.name.toLowerCase();
    let extractedText = '';

    try {
      if (name.endsWith('.txt')) {
        extractedText = await file.text();
      } else if (name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const data = await pdf(Buffer.from(arrayBuffer));
        extractedText = data.text;
      } else if (name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ buffer: Buffer.from(arrayBuffer) });
        extractedText = result.value;
      } else if (name.endsWith('.doc')) {
        extractedText = `DOC Document: ${file.name}\n\nThis is an older Microsoft Word document format. For best results, please save your document as a .docx file and upload it again. Alternatively, you can copy and paste the text content directly into our chat.`;
      } else {
        extractedText = `Uploaded file: ${file.name}\n\nThis file type is not supported for automatic text extraction. Please copy and paste the text content directly into our chat, or convert it to a supported format (PDF, DOCX, or TXT).`;
      }
    } catch (error) {
      console.error('Error extracting text from file:', error);
      extractedText = `Error processing ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try uploading the file again, or copy and paste the text content directly into our chat.`;
    }

    return NextResponse.json({ 
      success: true, 
      extractedText: extractedText.trim(),
      filename: file.name,
      fileSize: file.size
    });

  } catch (error) {
    console.error('Document extraction API error:', error);
    return NextResponse.json({ 
      error: 'Failed to extract document text' 
    }, { status: 500 });
  }
}
