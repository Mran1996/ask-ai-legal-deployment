-- Migration to add missing columns for document processing
-- Run this in your Supabase SQL editor

-- Add missing columns to documents table
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS filename TEXT,
ADD COLUMN IF NOT EXISTS file_type TEXT,
ADD COLUMN IF NOT EXISTS parsed_text TEXT,
ADD COLUMN IF NOT EXISTS extracted_case_number TEXT,
ADD COLUMN IF NOT EXISTS extracted_court TEXT,
ADD COLUMN IF NOT EXISTS document_type TEXT,
ADD COLUMN IF NOT EXISTS document_summary TEXT,
ADD COLUMN IF NOT EXISTS opposing_party TEXT,
ADD COLUMN IF NOT EXISTS filing_date TEXT,
ADD COLUMN IF NOT EXISTS extracted_judge TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS county TEXT,
ADD COLUMN IF NOT EXISTS extracted_finding TEXT,
ADD COLUMN IF NOT EXISTS extracted_result TEXT;

-- Create document_chunks table if it doesn't exist
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  page_number INTEGER,
  embedding VECTOR(1536),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_chunk_index ON document_chunks(chunk_index);
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops);

-- Enable RLS on document_chunks
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for document_chunks
CREATE POLICY "Users can view their own document chunks" ON document_chunks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE documents.id = document_chunks.document_id 
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own document chunks" ON document_chunks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE documents.id = document_chunks.document_id 
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own document chunks" ON document_chunks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE documents.id = document_chunks.document_id 
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own document chunks" ON document_chunks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE documents.id = document_chunks.document_id 
      AND documents.user_id = auth.uid()
    )
  ); 