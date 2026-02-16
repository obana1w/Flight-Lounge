import { NextRequest, NextResponse } from 'next/server';

// In-memory store for active listeners
// Format: { sessionId: lastHeartbeat timestamp }
const activeListeners = new Map<string, number>();

// Clean up old listeners (no heartbeat for 60 seconds)
function cleanupOldListeners() {
  const now = Date.now();
  const timeout = 60000; // 60 seconds

  for (const [sessionId, lastHeartbeat] of activeListeners.entries()) {
    if (now - lastHeartbeat > timeout) {
      activeListeners.delete(sessionId);
    }
  }
}

// POST - Register/update listener heartbeat
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Update heartbeat timestamp
    activeListeners.set(sessionId, Date.now());

    // Clean up old listeners
    cleanupOldListeners();

    return NextResponse.json({
      success: true,
      listeners: activeListeners.size
    });
  } catch (error) {
    console.error('Heartbeat error:', error);
    return NextResponse.json({ error: 'Failed to register heartbeat' }, { status: 500 });
  }
}

// GET - Get current listener count
export async function GET() {
  // Clean up old listeners before returning count
  cleanupOldListeners();

  return NextResponse.json({
    listeners: activeListeners.size
  });
}

// DELETE - Remove listener (when they stop listening)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (sessionId) {
      activeListeners.delete(sessionId);
    }

    cleanupOldListeners();

    return NextResponse.json({
      success: true,
      listeners: activeListeners.size
    });
  } catch (error) {
    console.error('Delete listener error:', error);
    return NextResponse.json({ error: 'Failed to remove listener' }, { status: 500 });
  }
}
