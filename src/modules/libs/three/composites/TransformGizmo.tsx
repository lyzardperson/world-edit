"use client";

import { TransformControls as ThreeTransformControls } from "three-stdlib";
import { TransformControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import React, { useRef, ReactElement, useEffect } from "react";
import * as THREE from "three";

// Define a more specific type for TransformControls that includes custom events
type TransformControlsWithCustomEvents = ThreeTransformControls & {
  addEventListener(type: "dragging-changed", listener: (event: THREE.Event & { type: "dragging-changed"; value: boolean }) => void): void;
  removeEventListener(type: "dragging-changed", listener: (event: THREE.Event & { type: "dragging-changed"; value: boolean }) => void): void;
};

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
  onDraggingChanged,
  children,
}) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<ThreeTransformControls | null>(null);

  useEffect(() => {
    // Cast currentControls to our more specific type
    const currentControls = controlsRef.current as TransformControlsWithCustomEvents;
    if (currentControls && onDraggingChanged) {
      const draggingChangedListener = (event: THREE.Event & { type: "dragging-changed"; value: boolean }) => {
        onDraggingChanged(event.value);
      };
      // Calls should now type-check without casting the listener
      currentControls.addEventListener("dragging-changed", draggingChangedListener);
      return () => {
        currentControls.removeEventListener("dragging-changed", draggingChangedListener);
      };
    }
  }, [onDraggingChanged]);

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
    return null;
  }

  return (
    <TransformControls
      ref={controlsRef}
      object={settings.target}
      camera={camera}
      domElement={gl.domElement}
      onChange={handleControlsChange}
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
