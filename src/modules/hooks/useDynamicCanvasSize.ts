"use client";

import { useState, useEffect, useMemo } from 'react';
import type { LayoutSuggestion } from './useViewportLayoutManager';
import { 
  MIN_VIEWPORT_DIMENSIONS,
  VIEWPORT_RESIZE_DEBOUNCE_DELAY 
} from '@/constants/viewport';

interface CanvasSize {
  width: number;
  height: number;
}

interface DelayedResizeTrigger {
  lastActionTimestamp: number;
  resizeTriggerCount: number;
}

const parseGridTemplate = (classString: string, type: 'cols' | 'rows'): number => {
  const regex = new RegExp(`grid-${type}-([0-9]+)`);
  const match = classString.match(regex);
  return match ? parseInt(match[1], 10) : 1;
};

const parseSpan = (classString: string, type: 'col' | 'row'): number => {
  const regex = new RegExp(`${type}-span-([0-9]+)`);
  const match = classString.match(regex);
  return match ? parseInt(match[1], 10) : 1;
};

export const useDynamicCanvasSize = (
  containerRef: React.RefObject<HTMLElement | null>,
  layoutConfig: LayoutSuggestion | null,
  viewIndex: number,
  gapRem: number = 0.125, // Default gap-0.5 (0.125rem)
  delayedResizeTrigger?: DelayedResizeTrigger // Optional delayed resize trigger
): CanvasSize => {
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [forceUpdateCounter, setForceUpdateCounter] = useState(0);

  // Effect to handle delayed resize triggers from toolbar actions
  useEffect(() => {
    if (delayedResizeTrigger && delayedResizeTrigger.resizeTriggerCount > 0) {
      console.log('[Dynamic Canvas Size] Delayed resize trigger activated, forcing recalculation');
      setForceUpdateCounter(prev => prev + 1);
    }
  }, [delayedResizeTrigger?.resizeTriggerCount]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      console.log(`[useDynamicCanvasSize - View ${viewIndex}] No container element found`);
      return;
    }

    console.log(`[useDynamicCanvasSize - View ${viewIndex}] Setting up ResizeObserver for element:`, {
      tagName: element.tagName,
      className: element.className,
      offsetWidth: element.offsetWidth,
      offsetHeight: element.offsetHeight,
      clientWidth: element.clientWidth,
      clientHeight: element.clientHeight
    });

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const newSize = { width: entry.contentRect.width, height: entry.contentRect.height };
        console.log(`[useDynamicCanvasSize - View ${viewIndex}] ResizeObserver detected change:`, {
          contentRect: newSize,
          borderBoxSize: entry.borderBoxSize?.[0] ? {
            inlineSize: entry.borderBoxSize[0].inlineSize,
            blockSize: entry.borderBoxSize[0].blockSize
          } : 'not available',
          target: {
            tagName: entry.target.tagName,
            className: entry.target.className
          }
        });
        setContainerSize(newSize);
      }
    });

    resizeObserver.observe(element);
    // Initial size
    const initialSize = { width: element.offsetWidth, height: element.offsetHeight };
    console.log(`[useDynamicCanvasSize - View ${viewIndex}] Initial container size:`, initialSize);
    setContainerSize(initialSize);

    return () => {
      console.log(`[useDynamicCanvasSize - View ${viewIndex}] Cleaning up ResizeObserver`);
      resizeObserver.disconnect();
    };
  }, [containerRef, viewIndex]);  const calculatedSize = useMemo((): CanvasSize => {
    console.log(`[useDynamicCanvasSize - View ${viewIndex}] ===== CALCULATION START =====`);
    console.log(`[useDynamicCanvasSize - View ${viewIndex}] Input parameters:`, {
      layoutConfig: layoutConfig ? {
        type: layoutConfig.type,
        containerGridClasses: layoutConfig.containerGridClasses,
        itemGridConfigLength: layoutConfig.itemGridConfig.length
      } : null,
      containerRefCurrent: !!containerRef.current,
      containerSize,
      viewIndex,
      gapRem,
      forceUpdateCounter
    });

    if (!layoutConfig || !containerRef.current || containerSize.width === 0 || containerSize.height === 0) {
      console.log(`[useDynamicCanvasSize - View ${viewIndex}] Early return - missing data:`, {
        hasLayoutConfig: !!layoutConfig,
        hasContainerRef: !!containerRef.current,
        containerSize
      });
      
      const fallbackSize = { 
        width: containerRef.current?.offsetWidth || MIN_VIEWPORT_DIMENSIONS.width, 
        height: containerRef.current?.offsetHeight || MIN_VIEWPORT_DIMENSIONS.height 
      };
      
      console.log(`[useDynamicCanvasSize - View ${viewIndex}] Fallback dimensions:`, fallbackSize);
      return fallbackSize;
    }

    const totalCols = parseGridTemplate(layoutConfig.containerGridClasses, 'cols');
    const totalRows = parseGridTemplate(layoutConfig.containerGridClasses, 'rows');

    console.log(`[useDynamicCanvasSize - View ${viewIndex}] Grid configuration:`, {
      totalCols,
      totalRows,
      containerGridClasses: layoutConfig.containerGridClasses
    });

    const itemConfig = layoutConfig.itemGridConfig[viewIndex];
    if (!itemConfig) {
        console.log(`[useDynamicCanvasSize - View ${viewIndex}] Missing itemConfig for viewIndex ${viewIndex}`);
        // Fallback if itemConfig is missing for the viewIndex
        const fallbackWidth = containerSize.width / totalCols - (totalCols -1) * (gapRem * 16) / totalCols;
        const fallbackHeight = containerSize.height / totalRows - (totalRows -1) * (gapRem * 16) / totalRows;
        const fallbackSize = { 
          width: Math.max(MIN_VIEWPORT_DIMENSIONS.width, fallbackWidth), 
          height: Math.max(MIN_VIEWPORT_DIMENSIONS.height, fallbackHeight) 
        };
        console.log(`[useDynamicCanvasSize - View ${viewIndex}] Fallback calculation:`, fallbackSize);
        return fallbackSize;
    }

    const itemColSpan = parseSpan(itemConfig.className, 'col');
    const itemRowSpan = parseSpan(itemConfig.className, 'row');
    
    console.log(`[useDynamicCanvasSize - View ${viewIndex}] Item configuration:`, {
      itemConfigClassName: itemConfig.className,
      itemColSpan,
      itemRowSpan
    });
    
    const gapPx = gapRem * parseFloat(getComputedStyle(document.documentElement).fontSize || '16');

    const totalHorizontalGap = (totalCols - 1) * gapPx;
    const totalVerticalGap = (totalRows - 1) * gapPx;

    const availableWidthForCells = containerSize.width - totalHorizontalGap;
    const availableHeightForCells = containerSize.height - totalVerticalGap;

    console.log(`[useDynamicCanvasSize - View ${viewIndex}] Gap calculations:`, {
      gapRem,
      gapPx,
      totalHorizontalGap,
      totalVerticalGap,
      availableWidthForCells,
      availableHeightForCells
    });

    const cellWidth = availableWidthForCells > 0 ? availableWidthForCells / totalCols : 0;
    const cellHeight = availableHeightForCells > 0 ? availableHeightForCells / totalRows : 0;

    const canvasWidth = itemColSpan * cellWidth + (itemColSpan > 1 ? (itemColSpan - 1) * gapPx : 0);
    const canvasHeight = itemRowSpan * cellHeight + (itemRowSpan > 1 ? (itemRowSpan - 1) * gapPx : 0);
    
    console.log(`[useDynamicCanvasSize - View ${viewIndex}] Cell calculations:`, {
      cellWidth,
      cellHeight,
      rawCanvasWidth: canvasWidth,
      rawCanvasHeight: canvasHeight
    });

    const finalSize = { 
      width: Math.max(MIN_VIEWPORT_DIMENSIONS.width, canvasWidth),
      height: Math.max(MIN_VIEWPORT_DIMENSIONS.height, canvasHeight)
    };
    
    console.log(`[useDynamicCanvasSize - View ${viewIndex}] ===== FINAL RESULT =====`, finalSize);
    console.log(`[useDynamicCanvasSize - View ${viewIndex}] ===== CALCULATION END =====`);
    
    return finalSize;

  }, [containerSize, layoutConfig, viewIndex, gapRem, containerRef, forceUpdateCounter]); // Added forceUpdateCounter

  return calculatedSize;
};
