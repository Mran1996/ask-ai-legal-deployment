export async function insertDocument({ supabase, userId, title, content }: {
  supabase: any; userId: string; title: string; content: string;
}) {
  const { data, error } = await supabase
    .from("documents")
    .insert([{ user_id: userId, title, content }])
    .select("*")
    .single();

  if (error) throw new Error(`Error inserting document: ${error.message}`);
  return data;
} 