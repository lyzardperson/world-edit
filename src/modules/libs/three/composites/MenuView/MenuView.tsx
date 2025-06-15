// src/ui/libs/three/composites/MenuView/MenuView.tsx
"use client";

import React from "react";
import type { CameraSettings, CameraMode } from "../../types"; // Adjusted path
import { useCameraManager } from "./hooks/useCameraManager"; // Adjusted path
import { useGizmoController } from "./hooks/useGizmoController"; // Adjusted path
import { SceneContent } from "./components/SceneContent"; // Adjusted path
import { Toolbar } from "./components/Toolbar"; // Adjusted path

export interface MenuViewProps {
  /** Current camera settings */
  settings: CameraSettings;
  /** Which camera mode to use */
  cameraMode: CameraMode;
  /** Whether to show the grid */
  showGrid?: boolean;
  /** Called with the current settings when "Save" is clicked */
  onSaveSettings?: (settings: CameraSettings) => void;
  /** Called when "Reset" is clicked */
  onResetSettings?: () => void;
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
  showGrid = true,
  onSaveSettings,
  onResetSettings,
}) => {
  const { cameraRef, captureCurrentSettings } = useCameraManager(
    settings,
    cameraMode
  );
  const {
    targetObject,
    meshRefCallback,
    transformGizmoSettings,
    handleGizmoChange,
    isGizmoDragging, // Added
    handleGizmoDragChange, // Added
  } = useGizmoController();

  return (
    <div className="relative w-full h-full">
      <SceneContent
        cameraMode={cameraMode}
        cameraRef={cameraRef}
        showGrid={showGrid}
        targetObject={targetObject}
        meshRefCallback={meshRefCallback}
        transformGizmoSettings={transformGizmoSettings}
        handleGizmoChange={handleGizmoChange}
        isGizmoDragging={isGizmoDragging} // Pass down
        onGizmoDragChange={handleGizmoDragChange} // Pass down
      />
      <Toolbar
        onSaveSettings={onSaveSettings}
        onResetSettings={onResetSettings}
        captureCurrentSettings={captureCurrentSettings}
      />
    </div>
  );
};
