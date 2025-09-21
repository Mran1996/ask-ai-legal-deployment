-- Complete Database Setup for Legal Assistant App
-- This migration creates all necessary tables with pgvector support

-- Enable pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Create profiles table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    full_name VARCHAR(255),
    avatar_url TEXT,
    state VARCHAR(2),
    legal_category VARCHAR(255),
    plan VARCHAR(50) DEFAULT 'Pro',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (if not exists) - keeping for backward compatibility
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    content TEXT,
    metadata JSONB DEFAULT '{}',
    -- Legal document specific fields
    plaintiff VARCHAR(500),
    defendant VARCHAR(500),
    court VARCHAR(500),
    case_number VARCHAR(100),
    case_type VARCHAR(200),
    filing_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document_chunks table with pgvector support
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(1536), -- OpenAI text-embedding-ada-002 dimension
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(document_id, chunk_index)
);

-- Create case_analyses table
CREATE TABLE IF NOT EXISTS case_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    analysis_type VARCHAR(100) NOT NULL,
    jurisdiction_state VARCHAR(100),
    jurisdiction_county VARCHAR(100),
    analysis_content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_case_number ON documents(case_number);
CREATE INDEX IF NOT EXISTS idx_documents_court ON documents(court);

CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_chunk_index ON document_chunks(chunk_index);

-- Create vector similarity search index
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding ON document_chunks 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create case_analyses indexes
CREATE INDEX IF NOT EXISTS idx_case_analyses_user_id ON case_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_case_analyses_document_id ON case_analyses(document_id);
CREATE INDEX IF NOT EXISTS idx_case_analyses_created_at ON case_analyses(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_case_analyses_updated_at BEFORE UPDATE ON case_analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle Google OAuth user metadata structure
    -- Google OAuth stores data in user_metadata, not raw_user_meta_data
    INSERT INTO profiles (id, email, first_name, last_name, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'given_name'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', NEW.raw_user_meta_data->>'family_name'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
    );
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail the user creation
        RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION match_document_chunks(
    query_embedding VECTOR(1536),
    match_threshold FLOAT DEFAULT 0.78,
    match_count INT DEFAULT 5
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
    WHERE dc.embedding IS NOT NULL
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
    ORDER BY dc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Create function to get documents with chunk count
CREATE OR REPLACE FUNCTION get_documents_with_chunk_count(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    filename VARCHAR(255),
    original_filename VARCHAR(255),
    file_size INTEGER,
    file_type VARCHAR(50),
    plaintiff VARCHAR(500),
    defendant VARCHAR(500),
    court VARCHAR(500),
    case_number VARCHAR(100),
    case_type VARCHAR(200),
    filing_date DATE,
    chunk_count BIGINT,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.id,
        d.filename,
        d.original_filename,
        d.file_size,
        d.file_type,
        d.plaintiff,
        d.defendant,
        d.court,
        d.case_number,
        d.case_type,
        d.filing_date,
        COUNT(dc.id)::BIGINT as chunk_count,
        d.created_at
    FROM documents d
    LEFT JOIN document_chunks dc ON d.id = dc.document_id
    WHERE d.user_id = user_uuid
    GROUP BY d.id, d.filename, d.original_filename, d.file_size, d.file_type,
             d.plaintiff, d.defendant, d.court, d.case_number, d.case_type,
             d.filing_date, d.created_at
    ORDER BY d.created_at DESC;
END;
$$;

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_analyses ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Documents policies
CREATE POLICY "Users can view their own documents" ON documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON documents
    FOR DELETE USING (auth.uid() = user_id);

-- Document chunks policies
CREATE POLICY "Users can view their own document chunks" ON document_chunks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM documents d 
            WHERE d.id = document_chunks.document_id 
            AND d.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own document chunks" ON document_chunks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM documents d 
            WHERE d.id = document_chunks.document_id 
            AND d.user_id = auth.uid()
        )
    );

-- Case analyses policies
CREATE POLICY "Users can view their own case analyses" ON case_analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own case analyses" ON case_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own case analyses" ON case_analyses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own case analyses" ON case_analyses
    FOR DELETE USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE profiles IS 'User profiles linked to Supabase Auth users';
COMMENT ON TABLE users IS 'Legacy user accounts for the legal assistant app';
COMMENT ON TABLE documents IS 'Uploaded legal documents with extracted metadata';
COMMENT ON TABLE document_chunks IS 'Chunked document content with vector embeddings for semantic search';
COMMENT ON TABLE case_analyses IS 'Generated case analyses and legal documents';

COMMENT ON COLUMN document_chunks.embedding IS 'OpenAI text-embedding-ada-002 vector (1536 dimensions)';
COMMENT ON COLUMN documents.metadata IS 'Additional document metadata in JSON format';
COMMENT ON COLUMN document_chunks.metadata IS 'Chunk-specific metadata in JSON format';
COMMENT ON COLUMN case_analyses.metadata IS 'Analysis-specific metadata in JSON format';

-- Grant necessary permissions (adjust as needed for your Supabase setup)
-- These may not be needed in Supabase as RLS handles permissions
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated; 