"use client";

import React from "react";
import type { Mesh, PerspectiveCamera, OrthographicCamera } from "three";
import { Canvas } from "../../../components/Canvas";
import {
  DefaultPerspectiveCamera,
  DefaultOrthographicCamera,
} from "../../../components/Cameras";
import { Controls } from "../../../components/Controls";
import { EnvironmentComponent } from "../../../components/Environment";
import { Lights } from "../../../components/Lights";
import { GridComponent } from "../../../components/Grid";
import { TransformGizmo } from "../../TransformGizmo";
import type { CameraMode, TransformSettings } from "../../../types";

interface SceneContentProps {
  cameraMode: CameraMode;
  cameraRef: React.RefObject<PerspectiveCamera | OrthographicCamera | null>;
  showGrid?: boolean;
  targetObject: Mesh | null;
  meshRefCallback: (node: Mesh | null) => void;
  transformGizmoSettings: TransformSettings | null;
  handleGizmoChange: (updatedTransform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  }) => void;
  isGizmoDragging: boolean;
  onGizmoDragChange: (dragging: boolean) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  // New props for canvas sizing
  canvasWidth?: number;
  canvasHeight?: number;
  showDebugInfo?: boolean;
}

export const SceneContent: React.FC<SceneContentProps> = ({
  cameraMode,
  cameraRef,
  showGrid,
  targetObject,
  meshRefCallback,
  transformGizmoSettings,
  handleGizmoChange,
  isGizmoDragging,
  onGizmoDragChange,
  onContextMenu,
  canvasWidth,
  canvasHeight,
  showDebugInfo,
}) => {
  // Log canvas dimensions when they change
  React.useEffect(() => {
    if (canvasWidth && canvasHeight) {
      console.log(`[SceneContent] Received canvas dimensions:`, { canvasWidth, canvasHeight });
    }
  }, [canvasWidth, canvasHeight]);

  // Determine canvas style - use calculated dimensions if available, otherwise fall back to full size
  const canvasStyle: React.CSSProperties = {
    width: canvasWidth ? `${canvasWidth}px` : '100%',
    height: canvasHeight ? `${canvasHeight}px` : '100%',
    border: showDebugInfo ? '2px solid yellow' : undefined,
  };

  console.log(`[SceneContent] Applying canvas style:`, canvasStyle);

  return (
    <div className="w-full h-full relative">
      {showDebugInfo && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white p-2 text-xs z-10 rounded">
          Canvas: {canvasWidth}×{canvasHeight}
        </div>
      )}
      <Canvas 
        style={canvasStyle}
        onContextMenu={onContextMenu}
      >
        {cameraMode === "orthographic" ? (
          <DefaultOrthographicCamera
            ref={cameraRef as React.RefObject<OrthographicCamera>}
          />
        ) : (
          <DefaultPerspectiveCamera
            ref={cameraRef as React.RefObject<PerspectiveCamera>}
          />
        )}
        <Controls enabled={!isGizmoDragging} />
        <EnvironmentComponent />
        <Lights />
        {showGrid && <GridComponent />}
        <mesh
          ref={meshRefCallback}
          name="controllableBox"
          visible={!!targetObject}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="royalblue" />
        </mesh>
        {targetObject && transformGizmoSettings && (
          <TransformGizmo
            settings={transformGizmoSettings}
            onChange={handleGizmoChange}
            onDraggingChanged={onGizmoDragChange}
          />
        )}
      </Canvas>
    </div>
  );
};
