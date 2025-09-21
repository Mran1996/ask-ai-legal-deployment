import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    console.log('[TEST-SUPABASE] Testing basic Supabase connection...');
    
    // Test 1: Basic connection
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('[TEST-SUPABASE] Basic connection error:', testError);
      return NextResponse.json({ 
        error: 'Basic connection failed',
        details: testError.message 
      }, { status: 500 });
    }
    
    console.log('[TEST-SUPABASE] Basic connection successful');
    
    // Test 2: Check if document_chunks table exists
    try {
      const { data: chunksData, error: chunksError } = await supabase
        .from('document_chunks')
        .select('count')
        .limit(1);
      
      if (chunksError) {
        console.error('[TEST-SUPABASE] document_chunks table error:', chunksError);
        return NextResponse.json({ 
          error: 'document_chunks table not found or inaccessible',
          details: chunksError.message,
          basicConnection: 'OK'
        }, { status: 500 });
      }
      
      console.log('[TEST-SUPABASE] document_chunks table accessible');
      
      return NextResponse.json({ 
        success: true,
        message: 'Supabase connection and document_chunks table are working',
        basicConnection: 'OK',
        chunksTable: 'OK'
      });
      
    } catch (chunksTableError) {
      console.error('[TEST-SUPABASE] Error checking document_chunks table:', chunksTableError);
      return NextResponse.json({ 
        error: 'Error checking document_chunks table',
        details: chunksTableError?.message || String(chunksTableError),
        basicConnection: 'OK'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('[TEST-SUPABASE] Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error testing Supabase',
      details: error?.message || String(error)
    }, { status: 500 });
  }
} 