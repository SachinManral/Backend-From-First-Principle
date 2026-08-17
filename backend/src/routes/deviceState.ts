import { Router, Request, Response } from 'express';
import db from '../db/index.js';

const router = Router();

/**
 * ============================================================================
 * FIRST PRINCIPLE: PER-DEVICE STATE & IDEMPOTENT MUTATIONS
 * 
 * 1. Per-Device Identity:
 *    A client-generated UUID (Device ID) identifies the user without requiring
 *    account registration or storing PII (Personally Identifiable Information).
 * 
 * 2. 1-Like-Per-Device Guarantee:
 *    The database enforces UNIQUE(device_id, target_id) on SQLite disk.
 *    Toggling an existing like cleanly deletes it; otherwise it inserts.
 * ============================================================================
 */

// Toggle like for a specific target (lecture slug or platform-root)
router.post('/likes/toggle', (req: Request, res: Response) => {
  const { deviceId, targetId } = req.body;

  if (!deviceId || !targetId) {
    return res.status(400).json({
      error: "Missing required fields 'deviceId' and 'targetId'."
    });
  }

  const checkExisting = db.prepare(
    'SELECT 1 FROM device_likes WHERE device_id = ? AND target_id = ?'
  ).get(deviceId, targetId);

  let liked = false;
  if (checkExisting) {
    // Unlike
    db.prepare('DELETE FROM device_likes WHERE device_id = ? AND target_id = ?').run(deviceId, targetId);
    liked = false;
  } else {
    // Like
    db.prepare('INSERT INTO device_likes (device_id, target_id) VALUES (?, ?)').run(deviceId, targetId);
    liked = true;
  }

  const countRow = db.prepare(
    'SELECT COUNT(*) as total FROM device_likes WHERE target_id = ?'
  ).get(targetId) as { total: number };

  return res.status(200).json({
    success: true,
    targetId,
    liked,
    totalLikes: countRow.total,
    deviceId
  });
});

// Get likes count and userLiked status for a single target
router.get('/likes/:targetId', (req: Request, res: Response) => {
  const { targetId } = req.params;
  const deviceId = req.query.deviceId as string | undefined;

  const countRow = db.prepare(
    'SELECT COUNT(*) as total FROM device_likes WHERE target_id = ?'
  ).get(targetId) as { total: number };

  let userLiked = false;
  if (deviceId) {
    const check = db.prepare(
      'SELECT 1 FROM device_likes WHERE device_id = ? AND target_id = ?'
    ).get(deviceId, targetId);
    userLiked = !!check;
  }

  return res.status(200).json({
    targetId,
    totalLikes: countRow?.total || 0,
    userLiked
  });
});

// Get aggregate likes for all targets and current device's liked list
router.get('/likes', (req: Request, res: Response) => {
  const deviceId = req.query.deviceId as string | undefined;

  const rows = db.prepare(
    'SELECT target_id, COUNT(*) as count FROM device_likes GROUP BY target_id'
  ).all() as Array<{ target_id: string; count: number }>;

  const likesMap: Record<string, number> = {};
  rows.forEach(r => {
    likesMap[r.target_id] = r.count;
  });

  const userLikedList: string[] = [];
  if (deviceId) {
    const userLikes = db.prepare(
      'SELECT target_id FROM device_likes WHERE device_id = ?'
    ).all(deviceId) as Array<{ target_id: string }>;
    userLikes.forEach(ul => userLikedList.push(ul.target_id));
  }

  return res.status(200).json({
    likesMap,
    userLikedList
  });
});

// Sync progress per device without login
router.post('/progress/sync', (req: Request, res: Response) => {
  const { deviceId, completedSlugs } = req.body;

  if (!deviceId || !Array.isArray(completedSlugs)) {
    return res.status(400).json({
      error: "Missing required 'deviceId' string or 'completedSlugs' array."
    });
  }

  const slugsJson = JSON.stringify(completedSlugs);
  db.prepare(`
    INSERT INTO device_progress (device_id, completed_slugs, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(device_id) DO UPDATE SET
      completed_slugs = excluded.completed_slugs,
      updated_at = CURRENT_TIMESTAMP
  `).run(deviceId, slugsJson);

  return res.status(200).json({
    success: true,
    deviceId,
    completedSlugs,
    count: completedSlugs.length
  });
});

// Get saved progress for a device
router.get('/progress/:deviceId', (req: Request, res: Response) => {
  const { deviceId } = req.params;

  const row = db.prepare(
    'SELECT completed_slugs, updated_at FROM device_progress WHERE device_id = ?'
  ).get(deviceId) as { completed_slugs: string; updated_at: string } | undefined;

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
});

export default router;
