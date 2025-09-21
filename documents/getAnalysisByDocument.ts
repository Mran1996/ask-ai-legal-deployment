import { supabase } from '@/lib/supabaseClient';

export async function getAnalysisByDocument(documentId: string) {
  const { data, error } = await supabase
    .from('case_analyses')
    .select('*')
    .eq('document_id', documentId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(`Error fetching analysis: ${error.message}`);
  }

  return data?.[0] || null;
} 