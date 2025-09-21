-- Fix for Step 4 Issues: Document Chunking and Database Permissions
-- Run this in your Supabase SQL editor

-- 1. Ensure original_filename column exists in documents table
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS original_filename VARCHAR(255);

-- Update existing records to have original_filename if it's null
UPDATE documents 
SET original_filename = filename 
WHERE original_filename IS NULL;

-- 2. Fix RLS policies for anonymous users and document_chunks
-- Drop existing policies that are too restrictive
DROP POLICY IF EXISTS "Users can insert their own document chunks" ON document_chunks;
DROP POLICY IF EXISTS "Users can view their own document chunks" ON document_chunks;

-- Create more flexible policies that work with anonymous users
CREATE POLICY "Allow document chunk operations" ON document_chunks
    FOR ALL USING (
        -- Allow if user is authenticated and owns the document
        (auth.uid() IS NOT NULL AND 
         EXISTS (
             SELECT 1 FROM documents d 
             WHERE d.id = document_chunks.document_id 
             AND d.user_id = auth.uid()
         ))
        OR
        -- Allow if document has anonymous user_id
        EXISTS (
            SELECT 1 FROM documents d 
            WHERE d.id = document_chunks.document_id 
            AND d.user_id = 'anonymous'
        )
    );

-- 3. Update documents table RLS policies to handle anonymous users
DROP POLICY IF EXISTS "Users can insert their own documents" ON documents;
DROP POLICY IF EXISTS "Users can view their own documents" ON documents;

CREATE POLICY "Allow document operations" ON documents
    FOR ALL USING (
        -- Allow if user is authenticated and owns the document
        (auth.uid() IS NOT NULL AND user_id = auth.uid())
        OR
        -- Allow if document belongs to anonymous user
        user_id = 'anonymous'
    );

-- 4. Ensure the match_document_chunks function works with anonymous users
CREATE OR REPLACE FUNCTION match_document_chunks(
    query_embedding VECTOR(1536),
    match_threshold FLOAT DEFAULT 0.78,
    match_count INT DEFAULT 5,
    user_id_param UUID DEFAULT NULL,
    document_id_param UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    chunk_index INTEGER,
    content TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        dc.id,
        dc.document_id,
        dc.chunk_index,
        dc.content,
        1 - (dc.embedding <=> query_embedding) AS similarity
    FROM document_chunks dc
    JOIN documents d ON dc.document_id = d.id
    WHERE dc.embedding IS NOT NULL
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
    AND (
        -- Filter by user_id if provided
        (user_id_param IS NOT NULL AND d.user_id = user_id_param)
        OR
        -- Filter by document_id if provided
        (document_id_param IS NOT NULL AND dc.document_id = document_id_param)
        OR
        -- Allow anonymous user access
        (user_id_param = 'anonymous' OR d.user_id = 'anonymous')
    )
    ORDER BY dc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 5. Create a function to handle anonymous document creation
CREATE OR REPLACE FUNCTION create_anonymous_document(
    p_document_id UUID,
    p_filename TEXT,
    p_original_filename TEXT,
    p_file_size INTEGER,
    p_file_type TEXT,
    p_content TEXT,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO documents (
        id,
        user_id,
        filename,
        original_filename,
        file_size,
        file_type,
        content,
        metadata
    ) VALUES (
        p_document_id,
        'anonymous',
        p_filename,
        p_original_filename,
        p_file_size,
        p_file_type,
        p_content,
        p_metadata
    );
    
    RETURN p_document_id;
END;
$$;

-- 6. Grant necessary permissions
GRANT EXECUTE ON FUNCTION create_anonymous_document TO authenticated;
GRANT EXECUTE ON FUNCTION create_anonymous_document TO anon;

-- 7. Ensure vector extension is enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- 8. Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding ON document_chunks 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 9. Add comments for documentation
COMMENT ON FUNCTION create_anonymous_document IS 'Creates documents for anonymous users with proper permissions';
COMMENT ON FUNCTION match_document_chunks IS 'Searches document chunks using vector similarity with support for anonymous users';

