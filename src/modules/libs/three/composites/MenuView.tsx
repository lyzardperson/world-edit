// src/ui/libs/three/composites/MenuView.tsx
"use client";

import React, { useRef, useEffect } from "react";
import { Canvas } from "../components/Canvas";
import {
  DefaultPerspectiveCamera,
  DefaultOrthographicCamera,
} from "../components/Cameras";
import { Controls } from "../components/Controls";
import { EnvironmentComponent } from "../components/Environment";
import { Lights } from "../components/Lights";
import { GridComponent } from "../components/Grid";
import type { CameraSettings, CameraMode } from "../types";
import { Button } from "@/modules/ui/components/Button";

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
 * - A perspective or orthographic camera (forwarded via ref)
 * - OrbitControls
 * - HDRI environment
 * - Default lights
 * - Optional grid
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
  // Ref to whichever camera is rendered
  const cameraRef = useRef<any>(null);

  // When settings or mode change, apply them to the camera
  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;

    const [x, y, z] = settings.position;
    cam.position.set(x, y, z);

    const [rx, ry, rz] = settings.rotation;
    cam.rotation.set(rx, ry, rz);

    if (cameraMode === "orthographic" && settings.zoom != null) {
      cam.zoom = settings.zoom;
      cam.updateProjectionMatrix();
    }
  }, [settings, cameraMode]);

  // Helper to read back current camera state
  const captureCurrentSettings = (): CameraSettings | null => {
    const cam = cameraRef.current;
    if (!cam) return null;

    const position = cam.position.toArray() as [number, number, number];
    const rotation = cam.rotation.toArray() as [number, number, number];
    const zoom =
      cameraMode === "orthographic" ? (cam as any).zoom : undefined;

    return { position, rotation, zoom };
  };

  return (
    <div className="relative w-full h-full">
      <Canvas>
        {cameraMode === "orthographic" ? (
          <DefaultOrthographicCamera ref={cameraRef} />
        ) : (
          <DefaultPerspectiveCamera ref={cameraRef} />
        )}
        <Controls />
        <EnvironmentComponent />
        <Lights />
        {showGrid && <GridComponent />}
        {/* TODO: insert your meshes and animation hooks here */}
      </Canvas>

      {/* Floating toolbar in top-right corner */}
      <div className="absolute top-4 right-4 flex gap-2 bg-background/80 backdrop-blur-md p-2 rounded shadow-lg z-10">
        <Button
          size="sm"
          onClick={() => {
            const current = captureCurrentSettings();
            if (current && onSaveSettings) onSaveSettings(current);
          }}
        >
          Save
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onResetSettings?.()}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};
