// src/ui/libs/three/composites/MenuView/MenuView.tsx
"use client";

import React, { useRef } from "react";
import type { RefObject } from "react";
import type { CameraSettings, CameraMode } from "../../types";
import { useCameraManager } from "./hooks/useCameraManager";
import { useGizmoController } from "./hooks/useGizmoController";
import { SceneContent } from "./components/SceneContent";
import { Toolbar } from "./components/Toolbar";
import { motion } from "framer-motion";
import { useViewportSize } from "@/modules/hooks/useViewportSize";
import type { LayoutSuggestion } from "@/modules/hooks/useViewportLayoutManager";

export interface MenuViewProps {
  /** Current camera settings */
  settings: CameraSettings;
  /** Which camera mode to use */
  cameraMode: CameraMode;
  /** Current gizmo mode */
  gizmoMode?: "translate" | "rotate" | "scale" | null;
  /** Whether to show the grid */
  showGrid?: boolean;
  /** Context menu handler */
  onContextMenu?: (event: React.MouseEvent) => void;
  className?: string;

  // Props for useDynamicCanvasSize
  gridContainerRef: RefObject<HTMLElement | null>;
  layoutConfig: LayoutSuggestion | null;
  viewIndex: number;
  gapRem?: number; // Optional, useDynamicCanvasSize has a default
  
  // Delayed resize trigger for toolbar actions
  delayedResizeTrigger?: {
    lastActionTimestamp: number;
    resizeTriggerCount: number;
  };
}

/**
 * MenuView
 *
 * Combines:
 * - A <Canvas> with shadows and antialias
 * - A perspective or orthographic camera (managed by useCameraManager)
 * - OrbitControls (via SceneContent)
 * - HDRI environment (via SceneContent)
 * - Default lights (via SceneContent)
 * - Optional grid (via SceneContent)
 * - TransformGizmo for a controllable object (managed by useGizmoController)
 *
 * Renders a floating toolbar for Save / Reset actions.
 */
export const MenuView: React.FC<MenuViewProps> = ({
  settings,
  cameraMode,
  gizmoMode = null,
  showGrid = true,
  onContextMenu,
  className,
  gridContainerRef, // Keep for backward compatibility but don't use
  layoutConfig,    // Keep for backward compatibility but don't use
  viewIndex,
  gapRem,
  delayedResizeTrigger,
}) => {
  const { cameraRef } = useCameraManager(settings, cameraMode);
  const {
    targetObject,
    meshRefCallback,
    isGizmoDragging,
    setGizmoContextMode,
    transformGizmoSettings,
    handleGizmoChange,
    handleGizmoDragChange,
  } = useGizmoController();

  // State for visual debugging
  const [showDebugBackground, setShowDebugBackground] = React.useState(false);

  // Use the new simplified viewport size hook
  const [viewportRef, viewportSize] = useViewportSize(delayedResizeTrigger);

  // Trigger debug background when delayedResizeTrigger changes
  React.useEffect(() => {
    if (delayedResizeTrigger && delayedResizeTrigger.resizeTriggerCount > 0) {
      console.log(`[MenuView ${viewIndex}] Delayed resize trigger detected, showing debug background`);
      setShowDebugBackground(true);
      
      // Remove debug background after 2 seconds
      const timeout = setTimeout(() => {
        setShowDebugBackground(false);
        console.log(`[MenuView ${viewIndex}] Debug background removed`);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [delayedResizeTrigger?.resizeTriggerCount, viewIndex]);

  // Log the viewport size for debugging
  React.useEffect(() => {
    console.log(`[MenuView ${viewIndex}] ===== VIEWPORT SIZE UPDATE =====`);
    console.log(`[MenuView ${viewIndex}] Viewport size:`, viewportSize);
    console.log(`[MenuView ${viewIndex}] Debug background active:`, showDebugBackground);
    console.log(`[MenuView ${viewIndex}] ===== END SIZE UPDATE =====`);
  }, [viewportSize.width, viewportSize.height, viewIndex, showDebugBackground]);

  React.useEffect(() => {
    if (setGizmoContextMode) {
      setGizmoContextMode(gizmoMode);
    }
  }, [gizmoMode, setGizmoContextMode]);

  return (
    <motion.div
      ref={viewportRef}
      className={`relative flex flex-col w-full h-full overflow-hidden ${className || ''}`}
      style={{
        backgroundColor: showDebugBackground ? '#ff0000' : undefined,
        transition: 'background-color 0.3s ease'
      }}
    >
      <Toolbar />
      <div className="flex-1 relative min-h-0 w-full overflow-hidden">
        <SceneContent
          cameraMode={cameraMode}
          cameraRef={cameraRef}
          showGrid={showGrid}
          targetObject={targetObject}
          meshRefCallback={meshRefCallback}
          isGizmoDragging={isGizmoDragging}
          transformGizmoSettings={transformGizmoSettings}
          handleGizmoChange={handleGizmoChange}
          onGizmoDragChange={handleGizmoDragChange}
          onContextMenu={onContextMenu}
          // Pass the measured viewport dimensions
          canvasWidth={viewportSize.width}
          canvasHeight={viewportSize.height}
          showDebugInfo={showDebugBackground}
        />
      </div>
    </motion.div>
  );
};
