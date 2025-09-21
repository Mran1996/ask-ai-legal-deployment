-- Enable pgvector extension (safe to run if already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the document_chunks table
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL, -- order of the chunk in the document
  chunk_text TEXT NOT NULL,
  embedding VECTOR(1536), -- adjust dimension if your embedding model differs
  page_number INTEGER,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  -- Add more metadata columns as needed
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for fast vector search
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding
  ON document_chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Index for user/document lookup
CREATE INDEX IF NOT EXISTS idx_document_chunks_user_doc
  ON document_chunks (user_id, document_id);

-- Index for chunk ordering
CREATE INDEX IF NOT EXISTS idx_document_chunks_order
  ON document_chunks (document_id, chunk_index); 