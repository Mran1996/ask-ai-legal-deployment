-- Function for vector similarity search in document chunks
CREATE OR REPLACE FUNCTION match_document_chunks(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  user_id_param uuid,
  document_id_param uuid
)
RETURNS TABLE (
  id uuid,
  chunk_text text,
  chunk_index int,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.chunk_text,
    dc.chunk_index,
    1 - (dc.embedding <=> query_embedding) as similarity
  FROM document_chunks dc
  WHERE dc.user_id = user_id_param
    AND dc.document_id = document_id_param
    AND dc.embedding IS NOT NULL
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$; 