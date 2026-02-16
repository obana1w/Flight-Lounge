import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route to fetch stream URL from radioscanner.pro
 * This proxies requests to avoid CORS issues in the browser
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
    const response = await fetch(
      `http://live.radioscanner.pro/audio/${code.toLowerCase()}`,
      {
        cache: 'no-store', // Always get fresh URL
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch stream data: ${response.status}`);
    }

    const html = await response.text();

    // Extract stream URL from the player script
    const streamUrlMatch = html.match(/file:"([^"]+)"/);
    const streamUrl = streamUrlMatch ? streamUrlMatch[1] : null;

    if (!streamUrl) {
      return NextResponse.json(
        { error: 'Stream URL not found' },
        { status: 404 }
      );
    }

    // Extract listener count (text is in Windows-1251 encoding, so matches might be in Cyrillic)
    const listenersMatch = html.match(/слушателей:\s*(\d+)/i) ||
                          html.match(/listeners:\s*(\d+)/i);
    const listeners = listenersMatch ? parseInt(listenersMatch[1], 10) : 0;

    // Check if stream is live
    const isLive = !!streamUrl;

    return NextResponse.json({
      streamUrl,
      listeners,
      isLive,
    });
  } catch (error) {
    console.error(`Error fetching stream for ${code}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch stream data' },
      { status: 500 }
    );
  }
}
