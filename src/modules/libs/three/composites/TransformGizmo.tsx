// modules/libs/three/tools/transform/TransformGizmo.tsx
"use client";

import React, { useRef, useEffect } from "react";
import type { TransformControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { TransformSettings } from "../types";

interface TransformGizmoProps {
  /** Initial settings and target object to manipulate */
  settings: TransformSettings;
  /** Called whenever the object transforms */
  onChange?: (updated: TransformSettings) => void;
  /** Any children (usually the mesh you want to manipulate) */
  children: React.ReactNode;
}

/**
 * A wrapper around Drei's TransformControls that:
 *  - applies incoming settings
 *  - listens for objectChange events to report back world transforms
 */
export const TransformGizmo: React.FC<TransformGizmoProps> = ({
  settings,
  onChange,
  children,
}) => {
  const { camera, gl, scene } = useThree();
  const controlsRef = useRef<TransformControls | null>(null);

  // Apply settings (mode, snapping, etc.) whenever they change
  useEffect(() => {
    const ctrl = controlsRef.current;
    if (!ctrl) return;

    ctrl.setMode(settings.mode);
    ctrl.setSize(settings.size);
    ctrl.setSpace(settings.space);
    ctrl.setTranslationSnap(settings.snapTranslate ?? undefined);
    ctrl.setRotationSnap(settings.snapRotate ?? undefined);
    ctrl.setScaleSnap(settings.snapScale ?? undefined);
  }, [
    settings.mode,
    settings.size,
    settings.space,
    settings.snapTranslate,
    settings.snapRotate,
    settings.snapScale,
  ]);

  // Listen for object changes and propagate new transform
  useEffect(() => {
    const ctrl = controlsRef.current;
    if (!ctrl || !onChange) return;

    const handleChange = () => {
      const obj = settings.target;
      onChange({
        ...settings,
        position: [obj.position.x, obj.position.y, obj.position.z],
        rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
        scale: [obj.scale.x, obj.scale.y, obj.scale.z],
      });
    };

    ctrl.addEventListener("objectChange", handleChange);
    return () => {
      ctrl.removeEventListener("objectChange", handleChange);
    };
  }, [onChange, settings]);

  return (
    <TransformControls
      ref={controlsRef}
      object={settings.target}
      camera={camera}
      domElement={gl.domElement}
    >
      {children}
    </TransformControls>
  );
};
