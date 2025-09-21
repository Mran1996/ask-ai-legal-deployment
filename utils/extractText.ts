// utils/extractText.ts
export async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  
  try {
    // For text files, we can handle them directly in the browser
  if (name.endsWith(".txt")) {
      const text = await file.text();
      return text.trim();
    }
    
    // For PDF, DOCX, and other files, use the server-side API
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/extract-document', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to extract text');
    }
    
    return result.extractedText;
    
  } catch (error) {
    console.error('Error extracting text from file:', error);
    return `Error processing ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try uploading the file again, or copy and paste the text content directly into our chat.`;
  }
}
