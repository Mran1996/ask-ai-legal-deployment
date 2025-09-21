import { NextRequest, NextResponse } from 'next/server';
import { processUploadedDocument, retrieveRelevantChunks } from '@/lib/document-chunking';
import { supabase } from '@/lib/supabaseClient';
import { splitIntoChunks, generateEmbedding } from '@/lib/document-chunking';

export async function POST(req: NextRequest) {
  try {
    const { action, text, userId, documentId, query } = await req.json();

    switch (action) {
      case 'process':
        // Test document processing
        console.log('[TEST] Processing document:', { userId, documentId, textLength: text?.length });
        await processUploadedDocument(
          userId || 'test-user',
          documentId || 'test-doc',
          text || 'This is a test document for chunking and embedding.',
          { title: 'Test Document' }
        );
        return NextResponse.json({ success: true, message: 'Document processed successfully' });

      case 'retrieve':
        // Test chunk retrieval
        console.log('[TEST] Retrieving chunks for:', { userId, documentId, query });
        const chunks = await retrieveRelevantChunks(
          userId || 'test-user',
          documentId || 'test-doc',
          query || 'test query',
          3
        );
        return NextResponse.json({ success: true, chunks });

      case 'check-chunks':
        // Check if chunks exist for a document
        console.log('[TEST] Checking chunks for document:', documentId);
        const { data: existingChunks, error: checkError } = await supabase
          .from('document_chunks')
          .select('*')
          .eq('document_id', documentId)
          .eq('user_id', userId || 'test-user');
        
        if (checkError) {
          console.error('[TEST] Error checking chunks:', checkError);
          return NextResponse.json({ error: 'Database error checking chunks' }, { status: 500 });
        }
        
        return NextResponse.json({ 
          success: true, 
          chunkCount: existingChunks?.length || 0,
          chunks: existingChunks 
        });

      case 'test-db-connection':
        // Test database connection
        console.log('[TEST] Testing database connection');
        const { data: testData, error: dbError } = await supabase
          .from('document_chunks')
          .select('count')
          .limit(1);
        
        if (dbError) {
          console.error('[TEST] Database connection error:', dbError);
          return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
        }
        
        return NextResponse.json({ success: true, message: 'Database connection successful' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[TEST] Test chunking error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error?.message || String(error)
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    console.log('🧪 [TEST] === TEST CHUNKING ENDPOINT START ===');
    
    const results = {
      database: { connected: false, tables: [], error: null },
      chunking: { success: false, chunks: 0, error: null },
      embedding: { success: false, dimensions: 0, error: null }
    };

    // Test database connection and tables
    try {
      console.log('🧪 [TEST] Testing database connection...');
      const { data: tables, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .in('table_name', ['documents', 'document_chunks', 'users']);

      if (tableError) {
        results.database.error = tableError.message;
        console.error('🧪 [TEST] Database table check failed:', tableError);
      } else {
        results.database.connected = true;
        results.database.tables = tables?.map(t => t.table_name) || [];
        console.log('🧪 [TEST] Database connected, tables found:', results.database.tables);
      }
    } catch (dbError) {
      results.database.error = dbError.message;
      console.error('🧪 [TEST] Database connection failed:', dbError);
    }

    // Test chunking functionality
    try {
      console.log('🧪 [TEST] Testing chunking functionality...');
      const testText = "This is a test document. It contains multiple sentences. We want to see if chunking works properly. Each sentence should be processed correctly. The chunking algorithm should split this into appropriate chunks.";
      const chunks = splitIntoChunks(testText, 50); // Small chunks for testing
      results.chunking.success = true;
      results.chunking.chunks = chunks.length;
      console.log('🧪 [TEST] Chunking successful, created', chunks.length, 'chunks');
    } catch (chunkError) {
      results.chunking.error = chunkError.message;
      console.error('🧪 [TEST] Chunking failed:', chunkError);
    }

    // Test embedding generation
    try {
      console.log('🧪 [TEST] Testing embedding generation...');
      const testText = "This is a test text for embedding generation.";
      const embedding = await generateEmbedding(testText);
      results.embedding.success = true;
      results.embedding.dimensions = embedding.length;
      console.log('🧪 [TEST] Embedding successful, dimensions:', embedding.length);
    } catch (embedError) {
      results.embedding.error = embedError.message;
      console.error('🧪 [TEST] Embedding failed:', embedError);
    }

    // Test database connection and basic operations
    try {
      console.log("🧪 [TEST] Testing database connection...");
      
      // Test basic connection by checking if tables exist
      const { data: tableCheck, error: tableError } = await supabase
        .rpc('get_documents_with_chunk_count', { user_uuid: '00000000-0000-0000-0000-000000000000' });
      
      if (tableError) {
        console.log("🧪 [TEST] Database tables check failed:", tableError);
        console.log("🧪 [TEST] This likely means the database schema hasn't been set up yet.");
        console.log("🧪 [TEST] Please run the SQL migration in Supabase to create the required tables.");
        return new Response(JSON.stringify({ 
          error: "Database schema not set up", 
          details: tableError.message,
          action: "Run the SQL migration in Supabase to create tables"
        }), { status: 500 });
      }
      
      console.log("✅ Database schema is set up correctly");
      
      // Check what documents exist
      const { data: documents, error: docError } = await supabase
        .from('documents')
        .select('*')
        .limit(10);
      
      console.log("🧪 [TEST] Documents in database:", {
        count: documents?.length || 0,
        error: docError?.message,
        documents: documents?.map(d => ({ id: d.id, title: d.filename, user_id: d.user_id }))
      });
      
      // Check what chunks exist
      const { data: chunks, error: chunkError } = await supabase
        .from('document_chunks')
        .select('*')
        .limit(10);
      
      console.log("🧪 [TEST] Document chunks in database:", {
        count: chunks?.length || 0,
        error: chunkError?.message,
        chunks: chunks?.map(c => ({ id: c.id, document_id: c.document_id, content_length: c.content?.length }))
      });
    } catch (dbError) {
      console.error('🧪 [TEST] Database connection failed:', dbError);
      results.database.error = dbError.message;
    }

    console.log('🧪 [TEST] === TEST CHUNKING ENDPOINT END ===');
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });

  } catch (error) {
    console.error('🧪 [TEST] CRITICAL ERROR in test endpoint:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 