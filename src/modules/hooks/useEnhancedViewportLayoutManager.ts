/**
 * Enhanced Viewport Layout Manager Hook
 * Manages viewport layouts with delayed resize triggers after toolbar actions
 */
"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { 
  VIEWPORT_RESIZE_DEBOUNCE_DELAY,
  LAYOUT_ANIMATION_DURATION 
} from '@/constants/viewport';
import type { 
  LayoutType, 
  LayoutSuggestion,
  LayoutViewConfig 
} from './useViewportLayoutManager';

interface DelayedResizeTrigger {
  /** Timestamp of the last toolbar action */
  lastActionTimestamp: number;
  /** Counter to force re-renders after delayed resize */
  resizeTriggerCount: number;
}

export const useEnhancedViewportLayoutManager = (initialViewCount: number = 1) => {
  const [viewCount, setViewCount] = useState<number>(initialViewCount);
  const [currentLayout, setCurrentLayout] = useState<LayoutType>("single");
  const [delayedResizeTrigger, setDelayedResizeTrigger] = useState<DelayedResizeTrigger>({
    lastActionTimestamp: 0,
    resizeTriggerCount: 0,
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  /** Trigger delayed resize after toolbar actions */
  const triggerDelayedResize = useCallback(() => {
    const currentTime = Date.now();
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Update last action timestamp immediately
    setDelayedResizeTrigger(prev => ({
      ...prev,
      lastActionTimestamp: currentTime,
    }));
    
    // Set timeout for delayed resize trigger
    timeoutRef.current = setTimeout(() => {
      console.log('[Enhanced Layout Manager] Triggering delayed resize after toolbar action');
      setDelayedResizeTrigger(prev => ({
        ...prev,
        resizeTriggerCount: prev.resizeTriggerCount + 1,
      }));
    }, VIEWPORT_RESIZE_DEBOUNCE_DELAY);
    
  }, []);
  
  /** Enhanced add view with delayed resize trigger */
  const addViewWithResize = useCallback(() => {
    setViewCount(prev => prev + 1);
    triggerDelayedResize();
  }, [triggerDelayedResize]);
  
  /** Enhanced layout selection with delayed resize trigger */
  const selectLayoutWithResize = useCallback((layoutType: LayoutType) => {
    setCurrentLayout(layoutType);
    triggerDelayedResize();
  }, [triggerDelayedResize]);
  
  /** Cleanup timeout on unmount */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Rest of the logic from useViewportLayoutManager...
  // This would include all the layout calculations and suggestions
  
  return {
    viewCount,
    currentLayout,
    delayedResizeTrigger,
    addViewWithResize,
    selectLayoutWithResize,
    triggerDelayedResize,
  };
};
