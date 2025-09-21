import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch the analysis from the database
    const { data: analysis, error } = await supabase
      .from('case_analyses')
      .select('*')
      .eq('document_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !analysis) {
      return new NextResponse('Analysis not found', { status: 404 });
    }

    const analysisData = analysis.analysis_data;
    
    // Create formatted analysis content
    const analysisContent = `
      <div class="bg-white p-8">
        <h1 class="text-2xl font-bold mb-6 text-gray-800">Case Success Analysis</h1>
        
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-3 text-gray-700">${analysisData.title || 'Case Analysis'}</h2>
          <p class="text-sm text-gray-600 mb-4">Jurisdiction: ${analysisData.jurisdiction || 'Not specified'}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold text-blue-800 mb-2">Success Rate</h3>
            <p class="text-2xl font-bold text-blue-600">${analysisData.successRate || 0}%</p>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold text-green-800 mb-2">Case Type</h3>
            <p class="text-lg text-green-600">${analysisData.caseType || 'Not specified'}</p>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="font-semibold mb-3 text-gray-700">Primary Issues</h3>
          <ul class="list-disc list-inside space-y-1">
            ${(analysisData.primaryIssues || []).map((issue: string) => `<li class="text-gray-600">${issue}</li>`).join('')}
          </ul>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 class="font-semibold mb-3 text-gray-700">Strengths</h3>
            <ul class="list-disc list-inside space-y-1">
              ${(analysisData.strengths || []).map((strength: string) => `<li class="text-green-600">${strength}</li>`).join('')}
            </ul>
          </div>
          
          <div>
            <h3 class="font-semibold mb-3 text-gray-700">Weaknesses</h3>
            <ul class="list-disc list-inside space-y-1">
              ${(analysisData.weaknesses || []).map((weakness: string) => `<li class="text-red-600">${weakness}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="font-semibold mb-3 text-gray-700">Outcome Estimate</h3>
          <p class="text-gray-600">${analysisData.outcomeEstimate || 'Not available'}</p>
        </div>

        <div class="mb-6">
          <h3 class="font-semibold mb-3 text-gray-700">Timeline</h3>
          <p class="text-gray-600">${analysisData.timeline || 'Not specified'}</p>
        </div>

        <div class="mb-6">
          <h3 class="font-semibold mb-3 text-gray-700">Action Plan</h3>
          <p class="text-gray-600">${analysisData.actionPlan || 'Not available'}</p>
        </div>

        <div class="mb-6">
          <h3 class="font-semibold mb-3 text-gray-700">Risk Strategy</h3>
          <p class="text-gray-600">${analysisData.riskStrategy || 'Not available'}</p>
        </div>

        ${analysisData.statutes && analysisData.statutes.length > 0 ? `
          <div class="mb-6">
            <h3 class="font-semibold mb-3 text-gray-700">Relevant Statutes</h3>
            <ul class="list-disc list-inside space-y-1">
              ${analysisData.statutes.map((statute: string) => `<li class="text-gray-600">${statute}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="border-t pt-6">
          <p class="text-sm text-gray-500">Generated on: ${new Date(analysis.created_at).toLocaleDateString()}</p>
          <p class="text-sm text-gray-500">Document ID: ${id}</p>
        </div>
      </div>
    `;
    
    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Create a formatted HTML document with Tailwind CSS
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Case Success Analysis - ${id}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .analysis-content { font-size: 12pt; }
          </style>
        </head>
        <body class="bg-gray-50">
          <div class="analysis-content">
            ${analysisContent}
          </div>
        </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate the PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    // Return the PDF as a response
    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Case_Analysis_${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating analysis PDF:', error);
    return new NextResponse('Failed to generate analysis PDF', { status: 500 });
  }
} 