"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import type { Mesh } from "three";
import type { TransformSettings } from "../../../types";

export const useGizmoController = () => {
  const [targetObject, setTargetObject] = useState<Mesh | null>(null);
  const targetObjectRef = useRef<Mesh | null>(null); // To ensure setTargetObject is called once
  const [isGizmoDragging, setIsGizmoDragging] = useState(false); // New state for dragging

  const meshRefCallback = useCallback((node: Mesh | null) => {
    // Only set the target object if it hasn't been set yet
    if (node && !targetObjectRef.current) {
      setTargetObject(node);
      targetObjectRef.current = node; // Mark that we've set it
    }
  }, []); // Empty dependency array: this callback is stable

  const transformGizmoSettings = useMemo((): TransformSettings | null => {
    if (!targetObject) return null;
    return {
      target: targetObject,
      mode: "translate",
      space: "world",
      size: 1,
      snapTranslate: null,
      snapRotate: null,
      snapScale: null,
    };
  }, [targetObject]); // Depends only on the stable targetObject

  const handleGizmoChange = (updatedTransform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  }) => {
    console.log("Gizmo transformed object to:", updatedTransform);
    // targetObject is directly manipulated by TransformControls.
    // This callback is for any additional logic.
  };

  const handleGizmoDragChange = useCallback((dragging: boolean) => {
    setIsGizmoDragging(dragging);
  }, []); // Stable callback

  return {
    targetObject,
    meshRefCallback,
    transformGizmoSettings,
    handleGizmoChange,
    isGizmoDragging, // Expose dragging state
    handleGizmoDragChange, // Expose handler
  };
};
