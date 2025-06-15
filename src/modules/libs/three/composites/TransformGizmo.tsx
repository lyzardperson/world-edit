"use client";

import { TransformControls as ThreeTransformControls } from "three-stdlib";
import { TransformControls } from "@react-three/drei";
import { useThree, ThreeEvent } from "@react-three/fiber";
import React, { useRef, ReactElement } from "react";
import * as THREE from "three";

export interface TransformSettings {
  target: THREE.Object3D | null;
  mode: "translate" | "rotate" | "scale";
  size?: number;
  space?: "world" | "local";
  snapTranslate?: number | null;
  snapRotate?: number | null;
  snapScale?: number | null;
}

interface TransformGizmoProps {
  /** Settings and the target object to manipulate. */
  settings: TransformSettings;
  /**
   * Called whenever the user manipulates the object.
   * Provides a fresh snapshot of position/rotation/scale.
   */
  onChange?: (updated: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  }) => void;
  /** Called when the gizmo's dragging state changes. */
  onDraggingChanged?: (dragging: boolean) => void;
  /** Child object to be controlled by the gizmo. */
  children?: ReactElement<THREE.Object3D>;
}

/**
 * Wraps Drei’s TransformControls to:
 *  1. Apply incoming settings (mode, snapping, space).
 *  2. Emit `onChange` with updated transform data.
 *  3. Emit `onDraggingChanged` when dragging state changes.
 */
export const TransformGizmo: React.FC<TransformGizmoProps> = ({
  settings,
  onChange: onGizmoChange,
  onDraggingChanged, // This is the callback prop from the parent
  children,
}) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<ThreeTransformControls | null>(null);

  // Handler for when the gizmo starts being dragged
  const handleGizmoPointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation(); // Prevent event from bubbling to OrbitControls
    if (onDraggingChanged) {
      onDraggingChanged(true); // Notify parent that dragging has started
    }
  };

  // Handler for when the gizmo stops being dragged
  const handleGizmoPointerUp = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation(); // Prevent event from bubbling to OrbitControls
    if (onDraggingChanged) {
      onDraggingChanged(false); // Notify parent that dragging has stopped
    }
  };

  const handleControlsChange = () => {
    if (onGizmoChange && settings.target) {
      const { position, rotation, scale } = settings.target;
      onGizmoChange({
        position: position.toArray() as [number, number, number],
        rotation: [rotation.x, rotation.y, rotation.z],
        scale: scale.toArray() as [number, number, number],
      });
    }
  };

  if (!settings.target) {
    return null; // Don't render gizmo if no target
  }

  return (
    <TransformControls
      ref={controlsRef}
      object={settings.target}
      camera={camera}
      domElement={gl.domElement}
      onChange={handleControlsChange}
      // Use pointer events to manage dragging state
      onPointerDown={handleGizmoPointerDown}
      onPointerUp={handleGizmoPointerUp}
      mode={settings.mode}
      size={settings.size}
      space={settings.space}
      translationSnap={settings.snapTranslate ?? undefined}
      rotationSnap={settings.snapRotate ?? undefined}
      scaleSnap={settings.snapScale ?? undefined}
    >
      {children}
    </TransformControls>
  );
};
