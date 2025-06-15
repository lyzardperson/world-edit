"use client";

import { useState, useCallback, useMemo } from 'react';

export type LayoutType = 
  | "single"
  | "double-vertical"
  | "double-horizontal"
  | "triple-vertical" 
  | "triple-horizontal"
  | "triple-2T-1B" // Two Top, One Bottom
  | "triple-1T-2B" // One Top, Two Bottom
  | "triple-2L-1R" // Two Left, One Right
  | "triple-1L-2R" // One Left, Two Right
  | "quad";

export interface LayoutViewConfig {
  className: string; // Tailwind classes for the item (e.g., "col-span-2 row-span-1")
}

export interface LayoutSuggestion {
  type: LayoutType;
  containerGridClasses: string; // Tailwind classes for the grid container
  itemGridConfig: LayoutViewConfig[]; // Array of configs for each view
  descriptionKey: string; // i18n key for layout description
}

const LAYOUT_CONFIG: Record<LayoutType, Omit<LayoutSuggestion, 'type' | 'descriptionKey'> & { minViews: number, maxViews: number }> = {
  "single": { 
    containerGridClasses: "grid grid-cols-1 grid-rows-1", 
    itemGridConfig: [{ className: "col-span-1 row-span-1" }],
    minViews: 1, maxViews: 1 
  },
  "double-vertical": { 
    containerGridClasses: "grid grid-cols-1 grid-rows-2", 
    itemGridConfig: [{ className: "col-span-1 row-span-1" }, { className: "col-span-1 row-span-1" }],
    minViews: 2, maxViews: 2 
  },
  "double-horizontal": { 
    containerGridClasses: "grid grid-cols-2 grid-rows-1", 
    itemGridConfig: [{ className: "col-span-1 row-span-1" }, { className: "col-span-1 row-span-1" }],
    minViews: 2, maxViews: 2 
  },
  "triple-vertical": { 
    containerGridClasses: "grid grid-cols-1 grid-rows-3", 
    itemGridConfig: [{ className: "col-span-1 row-span-1" }, { className: "col-span-1 row-span-1" }, { className: "col-span-1 row-span-1" }],
    minViews: 3, maxViews: 3 
  },
  "triple-horizontal": { 
    containerGridClasses: "grid grid-cols-3 grid-rows-1", 
    itemGridConfig: [{ className: "col-span-1 row-span-1" }, { className: "col-span-1 row-span-1" }, { className: "col-span-1 row-span-1" }],
    minViews: 3, maxViews: 3 
  },
  "triple-2T-1B": {
    containerGridClasses: "grid grid-cols-2 grid-rows-2",
    itemGridConfig: [
      { className: "col-span-1 row-span-1" }, // Top-Left
      { className: "col-span-1 row-span-1" }, // Top-Right
      { className: "col-span-2 row-span-1" }, // Bottom
    ],
    minViews: 3, maxViews: 3
  },
  "triple-1T-2B": {
    containerGridClasses: "grid grid-cols-2 grid-rows-2",
    itemGridConfig: [
      { className: "col-span-2 row-span-1" }, // Top
      { className: "col-span-1 row-span-1" }, // Bottom-Left
      { className: "col-span-1 row-span-1" }, // Bottom-Right
    ],
    minViews: 3, maxViews: 3
  },
  "triple-2L-1R": {
    containerGridClasses: "grid grid-cols-2 grid-rows-2",
    itemGridConfig: [
      { className: "col-span-1 row-span-1" }, // Top-Left
      { className: "col-span-1 row-span-1" }, // Bottom-Left
      { className: "col-span-1 row-span-2" }, // Right
    ],
    minViews: 3, maxViews: 3
  },
  "triple-1L-2R": {
    containerGridClasses: "grid grid-cols-2 grid-rows-2",
    itemGridConfig: [
      { className: "col-span-1 row-span-2" }, // Left
      { className: "col-span-1 row-span-1" }, // Top-Right
      { className: "col-span-1 row-span-1" }, // Bottom-Right
    ],
    minViews: 3, maxViews: 3
  },
  "quad": { 
    containerGridClasses: "grid grid-cols-2 grid-rows-2", 
    itemGridConfig: [
      { className: "col-span-1 row-span-1" }, { className: "col-span-1 row-span-1" },
      { className: "col-span-1 row-span-1" }, { className: "col-span-1 row-span-1" }
    ],
    minViews: 4, maxViews: 4 
  },
};

function getLayoutDescriptionKey(layoutType: LayoutType): string {
  switch (layoutType) {
    case "single": return "layoutSingle";
    case "double-vertical": return "layoutDoubleVertical";
    case "double-horizontal": return "layoutDoubleHorizontal";
    case "triple-vertical": return "layoutTripleVertical";
    case "triple-horizontal": return "layoutTripleHorizontal";
    case "triple-2T-1B": return "layoutTriple2T1B";
    case "triple-1T-2B": return "layoutTriple1T2B";
    case "triple-2L-1R": return "layoutTriple2L1R";
    case "triple-1L-2R": return "layoutTriple1L2R";
    case "quad": return "layoutQuad";
    default: return "";
  }
}

export const useViewportLayoutManager = (initialViewCount: number = 1) => {
  const [viewCount, setViewCount] = useState<number>(initialViewCount);
  const [currentLayout, setCurrentLayout] = useState<LayoutType>("single");

  const suggestedLayouts = useMemo((): LayoutSuggestion[] => {
    const suggestions: LayoutSuggestion[] = [];
    if (viewCount === 1) {
      const config = LAYOUT_CONFIG.single;
      suggestions.push({ type: "single", containerGridClasses: config.containerGridClasses, itemGridConfig: config.itemGridConfig, descriptionKey: getLayoutDescriptionKey("single") });
    }
    if (viewCount === 2) {
      const dhConfig = LAYOUT_CONFIG["double-horizontal"];
      suggestions.push({ type: "double-horizontal", containerGridClasses: dhConfig.containerGridClasses, itemGridConfig: dhConfig.itemGridConfig, descriptionKey: getLayoutDescriptionKey("double-horizontal") });
      const dvConfig = LAYOUT_CONFIG["double-vertical"];
      suggestions.push({ type: "double-vertical", containerGridClasses: dvConfig.containerGridClasses, itemGridConfig: dvConfig.itemGridConfig, descriptionKey: getLayoutDescriptionKey("double-vertical") });
    }
    if (viewCount === 3) {
      (["triple-horizontal", "triple-vertical", "triple-2T-1B", "triple-1T-2B", "triple-2L-1R", "triple-1L-2R"] as LayoutType[]).forEach(type => {
        const config = LAYOUT_CONFIG[type];
        if (config.minViews <= viewCount && config.maxViews >= viewCount) {
          suggestions.push({ type, containerGridClasses: config.containerGridClasses, itemGridConfig: config.itemGridConfig, descriptionKey: getLayoutDescriptionKey(type) });
        }
      });
    }
    if (viewCount >= 4) { // Suggest quad for 4 or more, but quad is defined for exactly 4.
                           // The component rendering views will only render up to viewCount views.
      const quadConfig = LAYOUT_CONFIG.quad;
      if (quadConfig.minViews <= viewCount ) { // Allow quad if viewCount is 4 or more, itemGridConfig is for 4 items.
         suggestions.push({ type: "quad", containerGridClasses: quadConfig.containerGridClasses, itemGridConfig: quadConfig.itemGridConfig, descriptionKey: getLayoutDescriptionKey("quad") });
      }
    }
    
    // Fallback if no specific suggestions match (e.g. viewCount > 4 and no other layouts defined for it)
    // Or if initial viewCount doesn't match any specific block.
    if (suggestions.length === 0) {
        const defaultConfig = LAYOUT_CONFIG.single;
        suggestions.push({ type: "single", containerGridClasses: defaultConfig.containerGridClasses, itemGridConfig: defaultConfig.itemGridConfig, descriptionKey: getLayoutDescriptionKey("single") });
    }
    return suggestions;
  }, [viewCount]);

  const activeLayoutConfig = useMemo((): LayoutSuggestion => {
    const config = LAYOUT_CONFIG[currentLayout];
    return {
      type: currentLayout,
      containerGridClasses: config.containerGridClasses,
      itemGridConfig: config.itemGridConfig,
      descriptionKey: getLayoutDescriptionKey(currentLayout)
    };
  }, [currentLayout]);

  const selectLayout = useCallback((layoutType: LayoutType) => {
    const selectedConfig = LAYOUT_CONFIG[layoutType];
    // Ensure the selected layout is somewhat compatible with the current view count.
    // This prevents selecting a "quad" layout if only 1 view exists, for example.
    // The suggestedLayouts should ideally filter this, but as a safeguard:
    if (viewCount >= selectedConfig.minViews && viewCount <= selectedConfig.maxViews) {
       setCurrentLayout(layoutType);
    } else if (viewCount < selectedConfig.minViews) {
      // If current view count is too low for selected layout, try to find a more suitable one.
      // For simplicity, we can just stick to the current one or default to single.
      // Or, find the first suggested layout that fits the current viewCount.
      const fittingSuggestion = suggestedLayouts.find(sl => viewCount >= LAYOUT_CONFIG[sl.type].minViews && viewCount <= LAYOUT_CONFIG[sl.type].maxViews);
      if (fittingSuggestion) {
        setCurrentLayout(fittingSuggestion.type);
      } else {
        setCurrentLayout("single"); // Fallback
      }
    } else { // viewCount > selectedConfig.maxViews
        // e.g. 4 views, user selected "double-horizontal". This is okay.
        // The layout will apply, and the rendering component will use the itemGridConfig for the first N views.
         setCurrentLayout(layoutType);
    }

  }, [viewCount, suggestedLayouts]);

  const updateViewCount = useCallback((count: number) => {
    setViewCount(count);
    // Auto-select a suitable layout.
    // This heuristic can be improved.
    let newLayout = currentLayout;
    if (count === 1) newLayout = 'single';
    else if (count === 2) {
      if (!currentLayout.startsWith('double')) newLayout = 'double-horizontal';
    } else if (count === 3) {
      if (!currentLayout.startsWith('triple')) newLayout = 'triple-horizontal'; // Default for 3
    } else if (count >= 4) {
      if (currentLayout !== 'quad') newLayout = 'quad';
    }

    // Check if the auto-selected layout is valid for the new count
    const newLayoutConfig = LAYOUT_CONFIG[newLayout];
    if (count >= newLayoutConfig.minViews && count <= newLayoutConfig.maxViews) {
        setCurrentLayout(newLayout);
    } else {
        // If not, find the first valid suggestion for the new count
        const firstValidSuggestion = suggestedLayouts.find(sl => {
            const slConfig = LAYOUT_CONFIG[sl.type];
            return count >= slConfig.minViews && count <= slConfig.maxViews;
        });
        if (firstValidSuggestion) {
            setCurrentLayout(firstValidSuggestion.type);
        } else {
             // Fallback if no suggestion is directly suitable (e.g. count > max for all suggestions)
            // Try to find one where count >= minViews
            const broaderSuggestion = suggestedLayouts.find(sl => count >= LAYOUT_CONFIG[sl.type].minViews);
            if (broaderSuggestion) {
                setCurrentLayout(broaderSuggestion.type);
            } else {
                setCurrentLayout('single'); // Absolute fallback
            }
        }
    }

  }, [currentLayout, suggestedLayouts]); // Added suggestedLayouts to dependency array

  return {
    viewCount,
    updateViewCount,
    suggestedLayouts,
    currentLayout,
    selectLayout,
    activeLayoutConfig,
  };
};
