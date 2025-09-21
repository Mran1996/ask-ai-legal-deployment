export async function insertAnalysis(
  supabase: any,
  userId: string, 
  documentId: string, 
  analysisData: any,
  title?: string
) {
  const { data, error } = await supabase
    .from('case_analyses')
    .insert([{ 
      user_id: userId, 
      document_id: documentId, 
      analysis_data: analysisData,
      title: title || 'Case Success Analysis',
      created_at: new Date().toISOString()
    }]);

  if (error) {
    throw new Error(`Error inserting analysis: ${error.message}`);
  }

  return data;
} 