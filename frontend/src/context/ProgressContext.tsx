'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ProgressContextType {
  completedSlugs: string[];
  isCompleted: (slug: string) => boolean;
  toggleComplete: (slug: string) => void;
  getCompletionPercentage: (totalLectures: number) => number;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const STORAGE_KEY = 'backend_first_principles_progress_v1';

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCompletedSlugs(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load progress from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const toggleComplete = (slug: string) => {
    setCompletedSlugs(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save progress', e);
      }
      return next;
    });
  };

  const isCompleted = (slug: string) => completedSlugs.includes(slug);

  const getCompletionPercentage = (totalLectures: number) => {
    if (!totalLectures) return 0;
    return Math.round((completedSlugs.length / totalLectures) * 100);
  };

  const resetProgress = () => {
    setCompletedSlugs([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ProgressContext.Provider
      value={{
        completedSlugs,
        isCompleted,
        toggleComplete,
        getCompletionPercentage,
        resetProgress
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
