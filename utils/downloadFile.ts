// utils/downloadFile.ts
// Updated: Trigger deployment
export async function downloadPDF(type: 'document' | 'analysis', id: string, title?: string) {
  const endpoint = type === 'analysis' 
    ? `/api/download/analysis/${id}` 
    : `/api/download/document/${id}`;
  
  const response = await fetch(endpoint);

  if (!response.ok) {
    console.error(`Failed to download ${type}:`, await response.text());
    // Here you might want to show a toast to the user
    return;
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  const downloadTitle = type === 'analysis' 
    ? `Case_Analysis_${id}.pdf` 
    : `${title || 'Legal_Document'}.pdf`;
  
  link.download = downloadTitle;
  
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
} 