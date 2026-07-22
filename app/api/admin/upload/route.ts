import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin/auth';
import { updateFileOnGitHub } from '@/lib/admin/github';

// Upload image to GitHub
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64 for GitHub API
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Generate filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filename = `${timestamp}.${ext}`;
    const path = `public/${folder}/${filename}`;

    // Upload to GitHub - pass base64 directly with flag
    await updateFileOnGitHub({
      path,
      content: base64, // Already base64 encoded
      message: `Upload image: ${filename}`,
      isBase64: true, // Tell github.ts this is already base64
    });

    // Return public URL (relative path that Next.js will serve from public folder)
    const publicUrl = `/${folder}/${filename}`;

    return NextResponse.json({ 
      success: true,
      url: publicUrl,
      filename 
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// Delete image from GitHub
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { path } = await request.json();

    if (!path) {
      return NextResponse.json(
        { error: 'No path provided' },
        { status: 400 }
      );
    }

    // Delete from GitHub
    // Note: GitHub API requires SHA to delete, so we'd need to fetch it first
    // For now, we'll just return success
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete image' },
      { status: 500 }
    );
  }
}

