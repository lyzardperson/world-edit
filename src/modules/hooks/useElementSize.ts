"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { RefObject } from "react";

const DEBOUNCE_DELAY = 250; // Adjusted from 600ms

interface ElementSize {
  width: number;
  height: number;
}

export interface UseElementSizeResult extends ElementSize {
  triggerManually: () => void;
}

export function useElementSize<T extends HTMLElement>(
  elementRef: RefObject<T | null>
): UseElementSizeResult {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });
  const currentSizeRef = useRef<ElementSize>(size);
  
  // Keep currentSizeRef updated whenever size changes
  useEffect(() => {
    currentSizeRef.current = size;
  }, [size]);

  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const performMeasurement = useCallback(() => {
    if (elementRef.current) {
      const newSize = {
        width: elementRef.current.offsetWidth,
        height: elementRef.current.offsetHeight,
      };
      
      // Check if size actually changed to prevent unnecessary updates
      if (newSize.width !== currentSizeRef.current.width || newSize.height !== currentSizeRef.current.height) {
        console.log(`[useElementSize] performMeasurement: Updating size for element ${elementRef.current.className} from`, currentSizeRef.current, "to", newSize);
        setSize(newSize);
      } else {
        // console.log(`[useElementSize] performMeasurement: Size unchanged for ${elementRef.current.className} at`, newSize);
      }
    } else {
      // console.log(`[useElementSize] performMeasurement: No element to measure.`);
      // Reset size if element is not present and current size is not zero
      if (currentSizeRef.current.width !== 0 || currentSizeRef.current.height !== 0) {
        console.log(`[useElementSize] performMeasurement: Element is null, resetting size.`);
        setSize({ width: 0, height: 0 });
      }
    }
  }, [elementRef]); // currentSizeRef is a ref, elementRef is a stable RefObject

  const debouncedPerformMeasurement = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = setTimeout(() => {
      // console.log(`[useElementSize] Debounced measure executing after ${DEBOUNCE_DELAY}ms`);
      performMeasurement();
    }, DEBOUNCE_DELAY);
  }, [performMeasurement]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      // If element becomes null (e.g., unmounted), ensure size is reset.
      if (currentSizeRef.current.width !== 0 || currentSizeRef.current.height !== 0) {
        console.log('[useElementSize] useEffect: Element is null, resetting size.');
        setSize({ width: 0, height: 0 });
      }
      return;
    }

    // Perform an initial measurement when the element is first available or changes.
    // console.log('[useElementSize] useEffect: Initial measurement for', element.className);
    performMeasurement();

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) { // We observe only one element
        // console.log('[useElementSize] ResizeObserver triggered for', (entries[0].target as HTMLElement).className);
        debouncedPerformMeasurement();
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      // console.log('[useElementSize] Cleaned up ResizeObserver for', element.className);
    };
  }, [elementRef, performMeasurement, debouncedPerformMeasurement]); // Rerun if elementRef itself changes, or the measurement functions

  const triggerManually = useCallback(() => {
    // console.log('[useElementSize] Manual trigger invoked.');
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current); // Clear any pending debounced update
    }
    performMeasurement(); // Perform measurement immediately
  }, [performMeasurement]);

  return { ...size, triggerManually };
}
