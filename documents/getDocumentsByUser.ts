export async function getDocumentsByUser(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Error fetching documents: ${error.message}`);
  }

  return data;
} 