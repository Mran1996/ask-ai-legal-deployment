export async function deleteDocument(supabase: any, documentId: string) {
  const { data, error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId);

  if (error) {
    throw new Error(`Error deleting document: ${error.message}`);
  }

  return data;
} 