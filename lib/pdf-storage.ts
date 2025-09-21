import puppeteer from 'puppeteer';
import { supabase } from '@/lib/supabaseClient';

async function launchBrowser() {
  return puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
}

export async function getDocumentPdfBuffer(documentId: string): Promise<Buffer> {
  const { data: document, error } = await supabase
    .from('documents')
    .select('title, content, ai_summary')
    .eq('id', documentId)
    .single();

  if (error || !document) {
    throw new Error('Document not found');
  }

  const browser = await launchBrowser();
  const page = await browser.newPage();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${document.title || 'Legal Document'}</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="p-8 font-serif">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold">${document.title || 'Legal Document'}</h1>
          <p class="text-sm text-gray-500">Document ID: ${documentId}</p>
        </div>
        <div class="whitespace-pre-wrap">${document.content}</div>
        ${document.ai_summary ? `
          <div class="mt-8 border-t pt-4">
            <h2 class="text-lg font-bold mb-2">AI Summary</h2>
            <p class="text-sm">${document.ai_summary}</p>
          </div>
        ` : ''}
      </body>
    </html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  return pdfBuffer;
}

export async function getCaseAnalysisPdfBuffer(documentId: string): Promise<Buffer> {
    const { data: analysis, error } = await supabase
      .from('case_analyses')
      .select('analysis_data, created_at')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

  if (error || !analysis) {
    throw new Error('Case analysis not found');
  }

  const analysisData = analysis.analysis_data as any;
  const browser = await launchBrowser();
  const page = await browser.newPage();

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Case Analysis</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="p-8 font-sans">
      <h1 class="text-2xl font-bold mb-4">Case Success Analysis</h1>
      <p class="mb-2"><strong>Document ID:</strong> ${documentId}</p>
      <p class="mb-4"><strong>Generated On:</strong> ${new Date(analysis.created_at).toLocaleDateString()}</p>
      
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="border p-4 rounded">
          <p class="text-sm font-bold">Success Rate</p>
          <p class="text-2xl">${analysisData.successRate || 'N/A'}%</p>
        </div>
        <div class="border p-4 rounded">
          <p class="text-sm font-bold">Case Type</p>
          <p class="text-xl">${analysisData.caseType || 'N/A'}</p>
        </div>
      </div>
       <div class="border p-4 rounded mb-4">
        <p class="text-sm font-bold mb-2">Primary Issues</p>
        <ul class="list-disc pl-5">
          ${(analysisData.primaryIssues || []).map((issue: string) => `<li>${issue}</li>`).join('')}
        </ul>
      </div>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="border p-4 rounded">
          <p class="text-sm font-bold text-green-600 mb-2">Strengths</p>
          <ul class="list-disc pl-5">
            ${(analysisData.strengths || []).map((s: string) => `<li>${s}</li>`).join('')}
          </ul>
        </div>
        <div class="border p-4 rounded">
          <p class="text-sm font-bold text-red-600 mb-2">Weaknesses</p>
          <ul class="list-disc pl-5">
            ${(analysisData.weaknesses || []).map((w: string) => `<li>${w}</li>`).join('')}
          </ul>
        </div>
      </div>
      <div class="border p-4 rounded">
        <p class="text-sm font-bold mb-2">Action Plan</p>
        <p>${analysisData.actionPlan || 'N/A'}</p>
      </div>

    </body>
  </html>
`;

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  return pdfBuffer;
} 