import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import formidable from "formidable";
import { readFileSync } from "fs";

console.log("[upload-avatar] SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("[upload-avatar] SUPABASE_SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function POST(request: Request) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Configure formidable with proper options
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
      filter: (part) => {
        return part.mimetype?.includes('image/') || false;
      }
    });

    const [fields, files] = await form.parse(request);
    const file = files.file?.[0];

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype || '')) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload JPEG, PNG, or WebP images only.' 
      }, { status: 400 });
    }

    // Validate file size (5MB limit)
    if (file.size && file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File too large. Please upload images smaller than 5MB.' 
      }, { status: 400 });
    }

    const fileBuffer = readFileSync(file.filepath);
    const fileName = `${user.id}-${Date.now()}-${file.originalFilename}`;

    // First, try to delete any existing avatar for this user
    try {
      const existingFiles = await supabase.storage
        .from('avatars')
        .list('', {
          search: user.id
        });

      if (existingFiles.data) {
        for (const existingFile of existingFiles.data) {
          await supabase.storage
            .from('avatars')
            .remove([existingFile.name]);
        }
      }
    } catch (deleteError) {
      console.error('Error deleting existing avatar:', deleteError);
      // Continue with upload even if deletion fails
    }

    // Upload new file
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, fileBuffer, {
        contentType: file.mimetype || 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    if (!publicUrl) {
      return NextResponse.json({ error: 'Failed to get public URL' }, { status: 500 });
    }

    return NextResponse.json({ publicUrl });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
} 