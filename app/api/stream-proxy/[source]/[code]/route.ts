import { NextRequest, NextResponse } from 'next/server';

/**
 * Universal proxy endpoint for audio streams from different sources
 * Supports: radioscanner.pro, liveatc.net
 * This bypasses CORS restrictions by proxying the audio through our server
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ source: string; code: string }> }
) {
  const { source, code } = await params;

  if (!source || !code) {
    return NextResponse.json(
      { error: 'Source and code are required' },
      { status: 400 }
    );
  }

  try {
    let streamUrl: string;

    // Handle different stream sources
    if (source === 'radioscanner') {
      // RadioScanner.pro - requires HTML parsing
      const pageResponse = await fetch(
        `http://live.radioscanner.pro/audio/${code.toLowerCase()}`,
        { cache: 'no-store' }
      );

      if (!pageResponse.ok) {
        throw new Error(`Failed to fetch radioscanner page: ${pageResponse.status}`);
      }

      const html = await pageResponse.text();

      // Extract stream URL from HTML
      const streamUrlMatch = html.match(/file:"([^"]+)"/);
      const extractedUrl = streamUrlMatch ? streamUrlMatch[1] : null;

      if (!extractedUrl) {
        return NextResponse.json(
          { error: 'Stream URL not found in radioscanner page' },
          { status: 404 }
        );
      }

      streamUrl = extractedUrl;
      console.log(`[RadioScanner] Proxying stream from: ${streamUrl}`);
    } else if (source === 'liveatc') {
      // LiveATC.net - direct stream URL with cache buster
      const timestamp = Date.now();
      streamUrl = `https://s1-fmt2.liveatc.net/${code.toLowerCase()}?nocache=${timestamp}`;
      console.log(`[LiveATC] Proxying stream from: ${streamUrl}`);
    } else {
      return NextResponse.json(
        { error: `Unknown source: ${source}` },
        { status: 400 }
      );
    }

    // Fetch the actual audio stream
    const streamResponse = await fetch(streamUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'audio/mpeg, audio/*',
        'Connection': 'keep-alive',
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

    // Build response headers - preserve important Icecast headers
    const headers = new Headers();
    headers.set('Content-Type', streamResponse.headers.get('Content-Type') || 'audio/mpeg');
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Range');

    // Preserve Icecast metadata headers if present
    const icyHeaders = ['icy-br', 'icy-name', 'icy-genre', 'icy-url', 'ice-audio-info'];
    icyHeaders.forEach(header => {
      const value = streamResponse.headers.get(header);
      if (value) {
        headers.set(header, value);
      }
    });

    // Return the stream with appropriate headers
    return new NextResponse(streamBody, {
      headers,
    });
  } catch (error) {
    console.error(`Error proxying stream for ${source}/${code}:`, error);
    return NextResponse.json(
      {
        error: 'Failed to proxy stream',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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
