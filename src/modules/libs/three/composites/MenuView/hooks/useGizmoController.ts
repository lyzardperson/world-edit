"use client";

import { useState, useMemo, useCallback } from "react";
import type { Mesh } from "three";
import type { TransformSettings } from "../../../types";

export const useGizmoController = () => {
  const [targetObject, setTargetObject] = useState<Mesh | null>(null);
  const [isGizmoDragging, setIsGizmoDragging] = useState(false);
  const [gizmoMode, setGizmoMode] = useState<"translate" | "rotate" | "scale" | null>("translate"); // Estado para el modo

  const meshRefCallback = useCallback((node: Mesh | null) => {
    setTargetObject(node); // Always update targetObject if the mesh node changes or on initial mount
  }, []); // setTargetObject is stable, so empty dependency array is fine

  const transformGizmoSettings = useMemo((): TransformSettings | null => {
    if (!targetObject) return null;
    return {
      target: targetObject,
      mode: gizmoMode || "translate", // Usar el estado del modo
      space: "world",
      size: 1,
      snapTranslate: null,
      snapRotate: null,
      snapScale: null,
    };
  }, [targetObject, gizmoMode]); // Depends on targetObject and gizmoMode

  const handleGizmoChange = (updatedTransform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  }) => {
    // targetObject is directly manipulated by TransformControls.
    // This callback is for any additional logic.
  };

  const handleGizmoDragChange = useCallback((dragging: boolean) => {
    setIsGizmoDragging(dragging);
  }, []);

  // Función para cambiar el modo del Gizmo desde fuera del hook
  const setGizmoContextMode = useCallback((mode: "translate" | "rotate" | "scale" | null) => {
    setGizmoMode(mode);
  }, []);

  return {
    targetObject,
    meshRefCallback,
    transformGizmoSettings,
    handleGizmoChange,
    isGizmoDragging,
    handleGizmoDragChange,
    gizmoMode, // Exponer el modo actual
    setGizmoContextMode, // Exponer la función para cambiar el modo
  };
};
