export async function updateDocument(supabase: any, documentId: string, updates: { title?: string; content?: string; ai_summary?: string }) {
  const { data, error } = await supabase
    .from('documents')
    .update(updates)
    .eq('id', documentId);

  if (error) {
    throw new Error(`Error updating document: ${error.message}`);
  }

  return data;
} 