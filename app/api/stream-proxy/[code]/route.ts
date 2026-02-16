import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy endpoint for audio streams from radioscanner.pro
 * This bypasses CORS restrictions by proxying the audio through our server
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  if (!code) {
    return NextResponse.json(
      { error: 'Station code is required' },
      { status: 400 }
    );
  }

  try {
    // First, get the stream page to extract the dynamic URL
    const pageResponse = await fetch(
      `http://live.radioscanner.pro/audio/${code.toLowerCase()}`,
      { cache: 'no-store' }
    );

    if (!pageResponse.ok) {
      throw new Error(`Failed to fetch stream page: ${pageResponse.status}`);
    }

    const html = await pageResponse.text();

    // Extract stream URL
    const streamUrlMatch = html.match(/file:"([^"]+)"/);
    const streamUrl = streamUrlMatch ? streamUrlMatch[1] : null;

    if (!streamUrl) {
      return NextResponse.json(
        { error: 'Stream URL not found' },
        { status: 404 }
      );
    }

    console.log(`Proxying stream from: ${streamUrl}`);

    // Fetch the actual audio stream
    const streamResponse = await fetch(streamUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!streamResponse.ok) {
      throw new Error(`Failed to fetch audio stream: ${streamResponse.status}`);
    }

    // Get the stream body
    const streamBody = streamResponse.body;

    if (!streamBody) {
      throw new Error('No stream body available');
    }

    // Return the stream with appropriate headers
    return new NextResponse(streamBody, {
      headers: {
        'Content-Type': streamResponse.headers.get('Content-Type') || 'audio/mpeg',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error(`Error proxying stream for ${code}:`, error);
    return NextResponse.json(
      { error: 'Failed to proxy stream' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
