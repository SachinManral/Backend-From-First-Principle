import { Router, Request, Response } from 'express';
import { dbQuery, dbQueryOne, dbExecute } from '../db/index.js';

const router = Router();

/**
 * ============================================================================
 * FIRST PRINCIPLE: REAL-TIME REALITY & ANONYMOUS DEVICE-BASED PERSISTENCE
 * 
 * 1. Anonymous Device Identity (Zero Login / Zero Friction):
 *    A client-generated UUID (Device ID) identifies the user without requiring
 *    account registration or storing Personally Identifiable Information (PII).
 * 
 * 2. 1-Like-Per-Device Guarantee:
 *    The database enforces PRIMARY KEY (device_id, target_id).
 *    Toggling an existing like cleanly deletes it; otherwise it inserts.
 * 
 * 3. Real-Time Server-Sent Events (SSE) Live Broadcast:
 *    When ANY user toggles a like, an SSE event is immediately broadcast to
 *    all connected clients in sub-millisecond real time.
 * ============================================================================
 */

// Active SSE client connections
const sseClients = new Set<Response>();

// Broadcast real-time like updates to all connected browser clients
function broadcastLikeUpdate(targetId: string, totalLikes: number, deviceId: string) {
  const payload = JSON.stringify({ targetId, totalLikes, deviceId, timestamp: Date.now() });
  const message = `event: like_update\ndata: ${payload}\n\n`;

  for (const client of sseClients) {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  }
}

// 1. Real-Time SSE Stream for Instant Like Sync
router.get('/likes/stream', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
    'Access-Control-Allow-Origin': '*'
  });

  res.write(`: connected at ${new Date().toISOString()}\n\n`);
  sseClients.add(res);

  // Send periodic keep-alive comments to prevent cloud proxies / load balancers from timing out
  const heartbeat = setInterval(() => {
    try {
      res.write(': keep-alive\n\n');
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

// 2. Toggle like for a specific target (lecture slug or platform-root)
router.post('/likes/toggle', async (req: Request, res: Response) => {
  const { deviceId, targetId } = req.body;

  if (!deviceId || !targetId) {
    return res.status(400).json({
      error: "Missing required fields 'deviceId' and 'targetId'."
    });
  }

  try {
    const existing = await dbQueryOne(
      'SELECT 1 FROM device_likes WHERE device_id = ? AND target_id = ?',
      [deviceId, targetId]
    );

    let liked = false;
    if (existing) {
      // Unlike (Decrement)
      await dbExecute(
        'DELETE FROM device_likes WHERE device_id = ? AND target_id = ?',
        [deviceId, targetId]
      );
      liked = false;
    } else {
      // Like (Increment)
      await dbExecute(
        'INSERT INTO device_likes (device_id, target_id) VALUES (?, ?)',
        [deviceId, targetId]
      );
      liked = true;
    }

    const countRow = await dbQueryOne<{ total: string | number }>(
      'SELECT COUNT(*) as total FROM device_likes WHERE target_id = ?',
      [targetId]
    );

    const totalLikes = countRow ? parseInt(String(countRow.total), 10) : 0;

    // Instant real-time broadcast to all other open clients
    broadcastLikeUpdate(targetId, totalLikes, deviceId);

    return res.status(200).json({
      success: true,
      targetId,
      liked,
      totalLikes,
      deviceId
    });
  } catch (error: any) {
    console.error('[LIKES TOGGLE ERROR]', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// 3. Get likes count and userLiked status for a single target
router.get('/likes/:targetId', async (req: Request, res: Response) => {
  const { targetId } = req.params;
  const deviceId = req.query.deviceId as string | undefined;

  try {
    const countRow = await dbQueryOne<{ total: string | number }>(
      'SELECT COUNT(*) as total FROM device_likes WHERE target_id = ?',
      [targetId]
    );

    let userLiked = false;
    if (deviceId) {
      const check = await dbQueryOne(
        'SELECT 1 FROM device_likes WHERE device_id = ? AND target_id = ?',
        [deviceId, targetId]
      );
      userLiked = !!check;
    }

    const totalLikes = countRow ? parseInt(String(countRow.total), 10) : 0;

    return res.status(200).json({
      targetId,
      totalLikes,
      userLiked
    });
  } catch (error: any) {
    console.error('[LIKES GET ERROR]', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// 4. Get aggregate likes for all targets and current device's liked list
router.get('/likes', async (req: Request, res: Response) => {
  const deviceId = req.query.deviceId as string | undefined;

  try {
    const rows = await dbQuery<{ target_id: string; count: string | number }>(
      'SELECT target_id, COUNT(*) as count FROM device_likes GROUP BY target_id'
    );

    const likesMap: Record<string, number> = {};
    rows.forEach(r => {
      likesMap[r.target_id] = parseInt(String(r.count), 10);
    });

    const userLikedList: string[] = [];
    if (deviceId) {
      const userLikes = await dbQuery<{ target_id: string }>(
        'SELECT target_id FROM device_likes WHERE device_id = ?',
        [deviceId]
      );
      userLikes.forEach(ul => userLikedList.push(ul.target_id));
    }

    return res.status(200).json({
      likesMap,
      userLikedList
    });
  } catch (error: any) {
    console.error('[AGGREGATE LIKES ERROR]', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// 5. Sync progress per device without login
router.post('/progress/sync', async (req: Request, res: Response) => {
  const { deviceId, completedSlugs } = req.body;

  if (!deviceId || !Array.isArray(completedSlugs)) {
    return res.status(400).json({
      error: "Missing required 'deviceId' string or 'completedSlugs' array."
    });
  }

  try {
    const slugsJson = JSON.stringify(completedSlugs);
    await dbExecute(`
      INSERT INTO device_progress (device_id, completed_slugs, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(device_id) DO UPDATE SET
        completed_slugs = excluded.completed_slugs,
        updated_at = CURRENT_TIMESTAMP
    `, [deviceId, slugsJson]);

    return res.status(200).json({
      success: true,
      deviceId,
      completedSlugs,
      count: completedSlugs.length
    });
  } catch (error: any) {
    console.error('[PROGRESS SYNC ERROR]', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// 6. Get saved progress for a device
router.get('/progress/:deviceId', async (req: Request, res: Response) => {
  const { deviceId } = req.params;

  try {
    const row = await dbQueryOne<{ completed_slugs: string; updated_at: string }>(
      'SELECT completed_slugs, updated_at FROM device_progress WHERE device_id = ?',
      [deviceId]
    );

    if (!row) {
      return res.status(200).json({
        deviceId,
        completedSlugs: [],
        updatedAt: null
      });
    }

    let completedSlugs: string[] = [];
    try {
      completedSlugs = JSON.parse(row.completed_slugs);
    } catch {
      completedSlugs = [];
    }

    return res.status(200).json({
      deviceId,
      completedSlugs,
      updatedAt: row.updated_at
    });
  } catch (error: any) {
    console.error('[PROGRESS GET ERROR]', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
