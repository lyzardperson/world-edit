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
  isGizmoDragging: boolean; // New prop
  onGizmoDragChange: (dragging: boolean) => void; // New prop
}

export const SceneContent: React.FC<SceneContentProps> = ({
  cameraMode,
  cameraRef,
  showGrid,
  targetObject, // Consumed directly
  meshRefCallback, // Used for the initial mesh
  transformGizmoSettings,
  handleGizmoChange,
  isGizmoDragging,
  onGizmoDragChange,
}) => {
  return (
    <Canvas>
      {cameraMode === "orthographic" ? (
        <DefaultOrthographicCamera ref={cameraRef as React.RefObject<OrthographicCamera>} />
      ) : (
        <DefaultPerspectiveCamera ref={cameraRef as React.RefObject<PerspectiveCamera>} />
      )}
      {/* OrbitControls are disabled when isGizmoDragging is true */}
      <Controls enabled={!isGizmoDragging} />
      <EnvironmentComponent />
      <Lights />
      {showGrid && <GridComponent />}

      {/* Render the target mesh. It will be created once and its ref captured. */}
      <mesh ref={meshRefCallback} name="controllableBox" visible={!!targetObject}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="royalblue" />
      </mesh>

      {/* 
        Conditionally render TransformGizmo if a targetObject exists and settings are available.
        TransformGizmo will operate on the targetObject obtained via transformGizmoSettings.
        The actual mesh is already in the scene.
        The children of TransformGizmo here is the visual representation of the object
        that TransformControls will attach to.
      */}
      {targetObject && transformGizmoSettings && (
        <TransformGizmo
          settings={transformGizmoSettings} // This contains the targetObject
          onChange={handleGizmoChange}
          onDraggingChanged={onGizmoDragChange}
        >
          {/* 
            The TransformControls component (inside TransformGizmo) will attach to 
            settings.target (which is targetObject).
            The child <primitive object={targetObject} /> ensures that the gizmo's transformations
            are applied to this specific instance in the React component tree,
            and that it's the 'thing' the user clicks on to interact with the gizmo.
          */}
          <primitive object={targetObject} />
        </TransformGizmo>
      )}
    </Canvas>
  );
};
