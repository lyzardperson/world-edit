"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Copy, Trash2, Zap } from "lucide-react";
import hotkeys from "hotkeys-js";
import { motion, AnimatePresence, Variants } from "framer-motion";

import { CameraSettings, CameraMode } from "@/modules/libs/three";
import { MenuView } from "@/modules/libs/three/composites/MenuView/MenuView";
import { WorldEditorToolbar, type EditorToolType } from "@/modules/editor/components/WorldEditorToolbar";
import type { MenuItem } from "@/modules/ui/components/context-menu/types";
import { useViewportLayoutManager, type LayoutSuggestion, type LayoutType } from "@/modules/hooks/useViewportLayoutManager";
import { WORKSPACES_MAX_CAMERAS } from "@/constants/workspaces";
import { VIEWPORT_RESIZE_DEBOUNCE_DELAY } from "@/constants/viewport";

import {
  useContextMenu,
  useRegisterContextMenu,
} from "@/modules/hooks/useContextMenu";

const viewItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { // Initial appearance animation
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeInOut" }
  },
  stableAfterVisible: { // New state to ensure layout settles
    opacity: 1,
    scale: 1,
    transition: { duration: 0.05, ease: "easeInOut" } // Short duration
  },
  thenBlink: { // Blink animation, runs after "visible"
    opacity: [1, 0.7, 1], // Keyframes: starts at 1 (from "visible"), dips to 0.7, returns to 1
    scale: 1, // Scale remains 1
    transition: {
      delay: 0.1, // Delay before blink starts, after stableAfterVisible
      opacity: {
        duration: 0.4, // Duration of the blink itself
        ease: "easeInOut",
        times: [0, 0.5, 1] // Timing for opacity keyframes [1, 0.7, 1]
      }
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

export default function WorldPage() {
  const t = useTranslations("contextMenu");
  const tToolbar = useTranslations("worldEditor.toolbar");
  const { openMenu } = useContextMenu();
  const [gizmoMode, setGizmoMode] = useState<"translate" | "rotate" | "scale" | null>(null);
  const [activeTool, setActiveTool] = useState<EditorToolType | null>(null);

  const defaultSettings: CameraSettings = {
    position: [5, 5, 5],
    rotation: [0, 0, 0],
    zoom: 30,
  };

  const [views, setViews] = useState<
    { id: string; settings: CameraSettings }[]
  >([{ id: `view-${Date.now()}`, settings: defaultSettings }]);

  // Ref for the grid container - this will be passed to MenuView if needed by useDynamicCanvasSize
  const gridContainerRef = useRef<HTMLDivElement>(null);
  
  // Delayed resize trigger state for toolbar actions
  const [delayedResizeTrigger, setDelayedResizeTrigger] = useState({
    lastActionTimestamp: 0,
    resizeTriggerCount: 0,
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); 

  const { 
    suggestedLayouts,
    selectLayout,
    activeLayoutConfig, // This will be passed to MenuView
    updateViewCount,
  } = useViewportLayoutManager(views.length);

  useEffect(() => {
    updateViewCount(views.length);
  }, [views.length, updateViewCount]);

  // Function to trigger delayed resize after toolbar actions
  const triggerDelayedResize = useCallback(() => {
    const currentTime = Date.now();
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      console.log('[Page] Cleared existing timeout');
    }
    
    // Log current state before update
    console.log('[Page] BEFORE delayed resize trigger:');
    console.log('  - Current delayedResizeTrigger:', delayedResizeTrigger);
    console.log('  - Current views count:', views.length);
    console.log('  - Current activeLayoutConfig:', activeLayoutConfig.type, activeLayoutConfig.containerGridClasses);
    
    // Update last action timestamp immediately
    const newTriggerState = {
      lastActionTimestamp: currentTime,
      resizeTriggerCount: delayedResizeTrigger.resizeTriggerCount, // Keep same count for now
    };
    
    setDelayedResizeTrigger(newTriggerState);
    
    console.log('[Page] DURING delayed resize trigger:');
    console.log('  - New trigger state set:', newTriggerState);
    console.log('  - Scheduling resize recalculation in', VIEWPORT_RESIZE_DEBOUNCE_DELAY, 'ms');
    
    // Set timeout for delayed resize trigger
    timeoutRef.current = setTimeout(() => {
      console.log('[Page] EXECUTING delayed resize after', VIEWPORT_RESIZE_DEBOUNCE_DELAY, 'ms');
      console.log('  - Previous resizeTriggerCount:', delayedResizeTrigger.resizeTriggerCount);
      
      setDelayedResizeTrigger(prev => {
        const finalState = {
          ...prev,
          resizeTriggerCount: prev.resizeTriggerCount + 1,
        };
        console.log('  - New resizeTriggerCount:', finalState.resizeTriggerCount);
        console.log('  - Final trigger state:', finalState);
        return finalState;
      });
    }, VIEWPORT_RESIZE_DEBOUNCE_DELAY);
    
  }, [delayedResizeTrigger, views.length, activeLayoutConfig]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const addMenuViewCb = useCallback(() => {
    if (views.length < WORKSPACES_MAX_CAMERAS) {
      setViews((prev) => {
        const last = prev[prev.length - 1];
        const clone = {
          id: `view-${Date.now()}`,
          settings: { ...last.settings },
        };
        return [...prev, clone];
      });
    }
  }, [views.length]);

  const assignHotkeyToViewCb = useCallback((viewId: string) => {
    console.log(`Assign hotkey to view ${viewId}`);
  }, []);

  const deleteViewCb = useCallback((viewId: string) => {
    setViews(prev => prev.filter(v => v.id !== viewId));
  }, []);

  const contextMenuRuleFn = useCallback((ctx: Record<string, any>) => {
    const viewId = ctx?.viewId as string | undefined;
    console.log("[ContextMenu Rule] Context received by page.tsx rule:", JSON.stringify(ctx));

    if (viewId) {
      const viewItems: MenuItem[] = [
        {
          key: "viewport-title",
          label: tToolbar("viewports"),
          disabled: true,
        },
        {
          key: `assign-hotkey-${viewId}`,
          label: t("assignHotkey"),
          icon: <Zap size={16} />,
          action: () => assignHotkeyToViewCb(viewId),
        },
        {
          key: `delete-view-${viewId}`,
          label: t("deleteView"),
          icon: <Trash2 size={16} color="red" />,
          action: () => deleteViewCb(viewId),
        },
      ];
      console.log("[ContextMenu Rule] Page.tsx rule returning view-specific items:", viewItems);
      return viewItems;
    } else {
      const cloneViewItem: MenuItem = {
        key: "clone-view",
        label: t("cloneView"),
        icon: <Copy size={16} />,
        action: addMenuViewCb,
        disabled: views.length >= WORKSPACES_MAX_CAMERAS,
      };
      console.log("[ContextMenu Rule] Page.tsx rule returning default items:", [cloneViewItem]);
      return [cloneViewItem];
    }
  }, [t, tToolbar, assignHotkeyToViewCb, deleteViewCb, addMenuViewCb, views.length]);

  useRegisterContextMenu(contextMenuRuleFn);

  const addMenuView = () => {
    if (views.length < WORKSPACES_MAX_CAMERAS) {
      setViews((prev) => {
        const last = prev[prev.length - 1];
        const clone = {
          id: `view-${Date.now()}`,
          settings: { ...last.settings },
        };
        return [...prev, clone];
      });
    }
  };

  const updateSettings = (id: string, newSettings: CameraSettings) => {
    setViews((prev) =>
      prev.map((v) => (v.id === id ? { ...v, settings: newSettings } : v))
    );
  };

  useEffect(() => {
    const keyMap = {
      "t": () => setGizmoMode(prev => prev === "translate" ? null : "translate"),
      "r": () => setGizmoMode(prev => prev === "rotate" ? null : "rotate"),
      "s": () => setGizmoMode(prev => prev === "scale" ? null : "scale"),
      "escape": () => setGizmoMode(null),
    };

    for (const key in keyMap) {
      hotkeys(key, (event) => {
        event.preventDefault();
        (keyMap[key as keyof typeof keyMap])();
      });
    }

    return () => {
      for (const key in keyMap) {
        hotkeys.unbind(key);
      }
    };
  }, []);

  const handleSelectTool = (tool: EditorToolType) => {
    setActiveTool(prevTool => prevTool === tool ? null : tool);
    console.log("Tool selected/toggled:", tool, "New active tool:", activeTool === tool ? null : tool);
    
    if (tool.startsWith("terrain-")) {
      setGizmoMode(null);
    }
  };

  const handleViewportAction = (action: "addView") => {
    console.log("Viewport action selected:", action);
    if (action === "addView") {
      console.log("Adding new view. Current views count:", views.length);
      addMenuView();
      console.log("After adding view, new views count should be:", views.length + 1);
      // Trigger delayed resize after adding view
      triggerDelayedResize();
    }
  };

  const handleSelectLayout = (layoutType: LayoutType) => {
    console.log("Layout selection triggered:", layoutType);
    selectLayout(layoutType);
    // Trigger delayed resize after layout change
    triggerDelayedResize();
  };

  // Add logging for layout changes
  useEffect(() => {
    console.log("Active layout config changed:", activeLayoutConfig);
    console.log("Grid container ref current:", gridContainerRef.current);
    if (gridContainerRef.current) {
      console.log("Grid container details:", {
        tagName: gridContainerRef.current.tagName,
        className: gridContainerRef.current.className,
        offsetWidth: gridContainerRef.current.offsetWidth,
        offsetHeight: gridContainerRef.current.offsetHeight,
        clientWidth: gridContainerRef.current.clientWidth,
        clientHeight: gridContainerRef.current.clientHeight,
        computedStyle: {
          width: getComputedStyle(gridContainerRef.current).width,
          height: getComputedStyle(gridContainerRef.current).height,
          display: getComputedStyle(gridContainerRef.current).display,
          gridTemplateColumns: getComputedStyle(gridContainerRef.current).gridTemplateColumns,
          gridTemplateRows: getComputedStyle(gridContainerRef.current).gridTemplateRows
        }
      });
    }
  }, [activeLayoutConfig]);

  return (
    <div className="relative w-full h-full flex flex-col">
      <WorldEditorToolbar 
        onSelectTool={handleSelectTool} 
        onSelectViewportAction={handleViewportAction} 
        suggestedLayouts={suggestedLayouts}
        onSelectLayout={handleSelectLayout}
      />
      <div 
        ref={gridContainerRef} // Assign ref here
        className={`grid ${activeLayoutConfig.containerGridClasses} gap-0.5 flex-grow w-full bg-muted overflow-hidden `}
      >
        <AnimatePresence initial={false}>
          {views.map(({ id, settings }, index) => (
            <motion.div
              key={id}
              layout 
              variants={viewItemVariants}
              initial="hidden"
              animate={["visible", "stableAfterVisible", "thenBlink"]}
              exit="exit"
              className={`relative bg-background h-full ${activeLayoutConfig.itemGridConfig[index]?.className || ''}`}
            >
              <MenuView
                settings={settings}
                cameraMode={"perspective" as CameraMode}
                gizmoMode={gizmoMode}
                gridContainerRef={gridContainerRef} 
                layoutConfig={activeLayoutConfig} 
                viewIndex={index}
                delayedResizeTrigger={delayedResizeTrigger}
                onContextMenu={(e) => { 
                  e.preventDefault();
                  e.stopPropagation();
                  const currentViewId = id; 
                  openMenu(e, { viewId: currentViewId }); 
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
