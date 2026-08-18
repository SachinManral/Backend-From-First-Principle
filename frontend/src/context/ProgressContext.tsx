'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { API_BASE_URL } from '@/lib/demos';

interface ProgressContextType {
  deviceId: string;
  completedSlugs: string[];
  isCompleted: (slug: string) => boolean;
  toggleComplete: (slug: string) => void;
  markComplete: (slug: string) => void;
  getCompletionPercentage: (totalLectures: number) => number;
  resetProgress: () => void;
  // Likes system
  likesMap: Record<string, number>;
  userLikedList: string[];
  isLiked: (targetId: string) => boolean;
  getLikesCount: (targetId: string) => number;
  toggleLike: (targetId: string) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const PROGRESS_STORAGE_KEY = 'bfp_user_progress_v1';
const DEVICE_ID_KEY = 'bfp_device_id_v1';
const LIKES_CACHE_KEY = 'bfp_user_likes_v1';

function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'server-rendered-device';
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'dev-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now().toString(36);
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return 'fallback-device-' + Date.now();
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [deviceId, setDeviceId] = useState<string>('initializing');
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [userLikedList, setUserLikedList] = useState<string[]>([]);
  const [, setIsLoaded] = useState(false);

  // Initialize per-device state on mount
  useEffect(() => {
    const devId = getOrCreateDeviceId();
    setDeviceId(devId);

    // 1. Load local progress and cached liked list
    try {
      const savedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (savedProgress) {
        setCompletedSlugs(JSON.parse(savedProgress));
      }

      const savedLikes = localStorage.getItem(LIKES_CACHE_KEY);
      if (savedLikes) {
        setUserLikedList(JSON.parse(savedLikes));
      }
    } catch (e) {
      console.error('Error reading local device storage:', e);
    }

    // 2. Fetch server likes & device progress sync in background
    const syncWithBackend = async () => {
      try {
        // Fetch all likes
        const likesRes = await fetch(`${API_BASE_URL}/api/likes?deviceId=${devId}`, { cache: 'no-store' });
        if (likesRes.ok) {
          const likesData = await likesRes.json();
          if (likesData.likesMap) setLikesMap(likesData.likesMap);
          if (Array.isArray(likesData.userLikedList)) {
            setUserLikedList(likesData.userLikedList);
            localStorage.setItem(LIKES_CACHE_KEY, JSON.stringify(likesData.userLikedList));
          }
        }

        // Fetch saved progress for device if local is empty
        const progRes = await fetch(`${API_BASE_URL}/api/progress/${devId}`, { cache: 'no-store' });
        if (progRes.ok) {
          const progData = await progRes.json();
          if (Array.isArray(progData.completedSlugs) && progData.completedSlugs.length > 0) {
            setCompletedSlugs(prev => {
              const merged = Array.from(new Set([...prev, ...progData.completedSlugs]));
              localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(merged));
              return merged;
            });
          }
        }
      } catch (e) {
        // Graceful offline fallback
      } finally {
        setIsLoaded(true);
      }
    };

    syncWithBackend();

    // 3. Real-Time Server-Sent Events (SSE) Stream for sub-millisecond like updates
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(`${API_BASE_URL}/api/likes/stream`);

      eventSource.addEventListener('like_update', (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload && payload.targetId && typeof payload.totalLikes === 'number') {
            setLikesMap(prev => ({
              ...prev,
              [payload.targetId]: payload.totalLikes
            }));
          }
        } catch (err) {
          console.error('Error parsing live SSE like update:', err);
        }
      });

      eventSource.onerror = () => {
        // If SSE disconnects, browser automatically attempts reconnect
      };
    } catch (e) {
      console.warn('SSE not supported or connection failed, relying on background polling:', e);
    }

    // 4. Fallback interval polling (every 10s) to guarantee resilience across intermittent networks
    const interval = setInterval(async () => {
      try {
        const likesRes = await fetch(`${API_BASE_URL}/api/likes?deviceId=${devId}`, { cache: 'no-store' });
        if (likesRes.ok) {
          const likesData = await likesRes.json();
          if (likesData.likesMap) setLikesMap(likesData.likesMap);
        }
      } catch {}
    }, 10000);

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(interval);
    };
  }, []);

  // Mark Lecture Complete (idempotent addition)
  const markComplete = useCallback((slug: string) => {
    setCompletedSlugs(prev => {
      if (prev.includes(slug)) return prev;
      const next = [...prev, slug];
      try {
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save progress locally', e);
      }

      // Sync with database backend
      const devId = deviceId || getOrCreateDeviceId();
      fetch(`${API_BASE_URL}/api/progress/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: devId, completedSlugs: next })
      }).catch(() => {});

      return next;
    });
  }, [deviceId]);

  // Toggle Lecture Complete per-device
  const toggleComplete = useCallback((slug: string) => {
    setCompletedSlugs(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save progress locally', e);
      }

      // Sync with database backend
      const devId = deviceId || getOrCreateDeviceId();
      fetch(`${API_BASE_URL}/api/progress/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: devId, completedSlugs: next })
      }).catch(() => {});

      return next;
    });
  }, [deviceId]);

  const isCompleted = useCallback((slug: string) => completedSlugs.includes(slug), [completedSlugs]);

  const getCompletionPercentage = useCallback((totalLectures: number) => {
    if (!totalLectures) return 0;
    return Math.round((completedSlugs.length / totalLectures) * 100);
  }, [completedSlugs]);

  const resetProgress = useCallback(() => {
    setCompletedSlugs([]);
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    const devId = deviceId || getOrCreateDeviceId();
    fetch(`${API_BASE_URL}/api/progress/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId: devId, completedSlugs: [] })
    }).catch(() => {});
  }, [deviceId]);

  // Per-Device 1-Like Toggle
  const isLiked = useCallback((targetId: string) => userLikedList.includes(targetId), [userLikedList]);

  const getLikesCount = useCallback((targetId: string) => {
    return likesMap[targetId] || 0;
  }, [likesMap]);

  const toggleLike = useCallback(async (targetId: string) => {
    const devId = deviceId || getOrCreateDeviceId();
    const currentlyLiked = userLikedList.includes(targetId);
    const nextLiked = !currentlyLiked;

    // 1. Optimistic UI update (Instant sub-millisecond feedback)
    setUserLikedList(prev => {
      const updated = nextLiked ? [...prev, targetId] : prev.filter(id => id !== targetId);
      try {
        localStorage.setItem(LIKES_CACHE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setLikesMap(prev => ({
      ...prev,
      [targetId]: Math.max(0, (prev[targetId] || 0) + (nextLiked ? 1 : -1))
    }));

    // 2. Transmit to backend & database
    try {
      const res = await fetch(`${API_BASE_URL}/api/likes/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: devId, targetId })
      });

      if (res.ok) {
        const data = await res.json();
        setLikesMap(prev => ({ ...prev, [targetId]: data.totalLikes }));
        if (data.liked) {
          setUserLikedList(prev => Array.from(new Set([...prev, targetId])));
        } else {
          setUserLikedList(prev => prev.filter(id => id !== targetId));
        }
      }
    } catch (e) {
      console.error('Failed to sync like toggle with backend', e);
    }
  }, [deviceId, userLikedList]);

  return (
    <ProgressContext.Provider
      value={{
        deviceId,
        completedSlugs,
        isCompleted,
        toggleComplete,
        markComplete,
        getCompletionPercentage,
        resetProgress,
        likesMap,
        userLikedList,
        isLiked,
        getLikesCount,
        toggleLike
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
