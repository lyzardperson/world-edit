"use client";

import { useState, useEffect, useRef } from 'react';
import { MIN_VIEWPORT_DIMENSIONS } from '@/constants/viewport';

interface ViewportSize {
  width: number;
  height: number;
}

interface DelayedResizeTrigger {
  lastActionTimestamp: number;
  resizeTriggerCount: number;
}

/**
 * A simpler hook that measures the actual size of a viewport container
 * and returns dimensions that should be used for the canvas
 */
export const useViewportSize = (
  delayedResizeTrigger?: DelayedResizeTrigger
): [React.RefObject<HTMLDivElement | null>, ViewportSize] => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<ViewportSize>({
    width: MIN_VIEWPORT_DIMENSIONS.width,
    height: MIN_VIEWPORT_DIMENSIONS.height
  });

  const [forceUpdateCounter, setForceUpdateCounter] = useState(0);

  // Handle delayed resize triggers
  useEffect(() => {
    if (delayedResizeTrigger && delayedResizeTrigger.resizeTriggerCount > 0) {
      console.log('[useViewportSize] Delayed resize trigger detected, forcing size recalculation');
      setForceUpdateCounter(prev => prev + 1);
    }
  }, [delayedResizeTrigger?.resizeTriggerCount]);

  // Measure the container size
  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      console.log('[useViewportSize] No container element found');
      return;
    }

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      const newSize = {
        width: Math.max(MIN_VIEWPORT_DIMENSIONS.width, rect.width),
        height: Math.max(MIN_VIEWPORT_DIMENSIONS.height, rect.height)
      };
      
      console.log('[useViewportSize] Size updated:', {
        rect: { width: rect.width, height: rect.height },
        finalSize: newSize,
        element: {
          tagName: element.tagName,
          className: element.className,
          offsetWidth: element.offsetWidth,
          offsetHeight: element.offsetHeight
        }
      });
      
      setSize(newSize);
    };

    // Initial size measurement
    updateSize();

    // Set up ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        console.log('[useViewportSize] ResizeObserver triggered:', {
          contentRect: entry.contentRect,
          borderBoxSize: entry.borderBoxSize?.[0] || 'not available'
        });
        updateSize();
      }
    });

    resizeObserver.observe(element);

    // Also listen to window resize as a fallback
    const handleWindowResize = () => {
      console.log('[useViewportSize] Window resize detected');
      setTimeout(updateSize, 100); // Small delay to let layout settle
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      console.log('[useViewportSize] Cleanup completed');
    };
  }, [forceUpdateCounter]); // Re-run when force update counter changes

  return [containerRef, size];
};
