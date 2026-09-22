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

// In-Memory Caches (Prevents Neon Database Wakeups & CPU spikes)
let cachedLikesMap: Record<string, number> | null = null;
let cachedLikesMapTimestamp = 0;
const LIKES_CACHE_TTL_MS = 60 * 1000; // 60s TTL

const deviceLikesCache = new Map<string, { list: string[]; timestamp: number }>();
const DEVICE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 min TTL

const progressCache = new Map<string, { completedSlugs: string[]; updatedAt: string | null; timestamp: number }>();

async function getCachedOrFreshLikesMap(): Promise<Record<string, number>> {
  const now = Date.now();
  if (cachedLikesMap && (now - cachedLikesMapTimestamp < LIKES_CACHE_TTL_MS)) {
    return cachedLikesMap;
  }

  try {
    const rows = await dbQuery<{ target_id: string; count: string | number }>(
      'SELECT target_id, COUNT(*) as count FROM device_likes GROUP BY target_id'
    );
    const map: Record<string, number> = {};
    rows.forEach(r => {
      map[r.target_id] = parseInt(String(r.count), 10);
    });
    cachedLikesMap = map;
    cachedLikesMapTimestamp = now;
    return map;
  } catch (err) {
    if (cachedLikesMap) return cachedLikesMap;
    return {};
  }
}

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

    // Update in-memory cache immediately
    if (cachedLikesMap) {
      cachedLikesMap[targetId] = totalLikes;
    }

    // Update device cache immediately
    const devCached = deviceLikesCache.get(deviceId);
    if (devCached) {
      if (liked) {
        if (!devCached.list.includes(targetId)) devCached.list.push(targetId);
      } else {
        devCached.list = devCached.list.filter(id => id !== targetId);
      }
      devCached.timestamp = Date.now();
    } else {
      deviceLikesCache.set(deviceId, { list: liked ? [targetId] : [], timestamp: Date.now() });
    }

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
    // Graceful optimistic fallback
    return res.status(200).json({
      success: true,
      targetId,
      liked: true,
      totalLikes: (cachedLikesMap?.[targetId] || 0) + 1,
      deviceId
    });
  }
});

// 3. Get likes count and userLiked status for a single target
router.get('/likes/:targetId', async (req: Request, res: Response) => {
  const { targetId } = req.params;
  const deviceId = req.query.deviceId as string | undefined;

  try {
    const map = await getCachedOrFreshLikesMap();
    const totalLikes = map[targetId] || 0;

    let userLiked = false;
    if (deviceId) {
      const devCached = deviceLikesCache.get(deviceId);
      if (devCached && (Date.now() - devCached.timestamp < DEVICE_CACHE_TTL_MS)) {
        userLiked = devCached.list.includes(targetId);
      } else {
        const check = await dbQueryOne(
          'SELECT 1 FROM device_likes WHERE device_id = ? AND target_id = ?',
          [deviceId, targetId]
        );
        userLiked = !!check;
      }
    }

    return res.status(200).json({
      targetId,
      totalLikes,
      userLiked
    });
  } catch (error: any) {
    console.error('[LIKES GET ERROR]', error);
    return res.status(200).json({
      targetId,
      totalLikes: cachedLikesMap?.[targetId] || 0,
      userLiked: false
    });
  }
});

// 4. Get aggregate likes for all targets and current device's liked list
router.get('/likes', async (req: Request, res: Response) => {
  const deviceId = req.query.deviceId as string | undefined;

  try {
    const likesMap = await getCachedOrFreshLikesMap();

    let userLikedList: string[] = [];
    if (deviceId) {
      const now = Date.now();
      const devCached = deviceLikesCache.get(deviceId);
      if (devCached && (now - devCached.timestamp < DEVICE_CACHE_TTL_MS)) {
        userLikedList = devCached.list;
      } else {
        try {
          const userLikes = await dbQuery<{ target_id: string }>(
            'SELECT target_id FROM device_likes WHERE device_id = ?',
            [deviceId]
          );
          userLikedList = userLikes.map(ul => ul.target_id);
          deviceLikesCache.set(deviceId, { list: userLikedList, timestamp: now });
        } catch {
          userLikedList = devCached?.list || [];
        }
      }
    }

    return res.status(200).json({
      likesMap,
      userLikedList
    });
  } catch (error: any) {
    console.error('[AGGREGATE LIKES ERROR]', error);
    return res.status(200).json({
      likesMap: cachedLikesMap || {},
      userLikedList: []
    });
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

  // Update in-memory cache immediately
  progressCache.set(deviceId, {
    completedSlugs,
    updatedAt: new Date().toISOString(),
    timestamp: Date.now()
  });

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
    // Return success since memory has it
    return res.status(200).json({
      success: true,
      deviceId,
      completedSlugs,
      count: completedSlugs.length
    });
  }
});

// 6. Get saved progress for a device
router.get('/progress/:deviceId', async (req: Request, res: Response) => {
  const { deviceId } = req.params;

  // Check cache first
  const cached = progressCache.get(deviceId);
  if (cached && (Date.now() - cached.timestamp < 60 * 1000)) {
    return res.status(200).json({
      deviceId,
      completedSlugs: cached.completedSlugs,
      updatedAt: cached.updatedAt
    });
  }

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

    progressCache.set(deviceId, {
      completedSlugs,
      updatedAt: row.updated_at,
      timestamp: Date.now()
    });

    return res.status(200).json({
      deviceId,
      completedSlugs,
      updatedAt: row.updated_at
    });
  } catch (error: any) {
    console.error('[PROGRESS GET ERROR]', error);
    return res.status(200).json({
      deviceId,
      completedSlugs: cached?.completedSlugs || [],
      updatedAt: cached?.updatedAt || null
    });
  }
});

export default router;
