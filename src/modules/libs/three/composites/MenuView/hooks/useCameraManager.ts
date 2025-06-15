"use client";

import { useRef, useEffect } from "react";
import type { Camera, PerspectiveCamera, OrthographicCamera } from "three";
import type { CameraSettings, CameraMode } from "../../../types";

export const useCameraManager = (
  initialSettings: CameraSettings,
  cameraMode: CameraMode
) => {
  const cameraRef = useRef<PerspectiveCamera | OrthographicCamera | null>(null);

  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;

    const [x, y, z] = initialSettings.position;
    cam.position.set(x, y, z);

    const [rx, ry, rz] = initialSettings.rotation;
    cam.rotation.set(rx, ry, rz);

    if (cameraMode === "orthographic" && initialSettings.zoom != null) {
      // Type guard to ensure cam is OrthographicCamera before accessing zoom
      if ('isOrthographicCamera' in cam && cam.isOrthographicCamera) {
        cam.zoom = initialSettings.zoom;
      }
    }
    cam.updateProjectionMatrix();
  }, [initialSettings, cameraMode]);

  const captureCurrentSettings = (): CameraSettings | null => {
    const cam = cameraRef.current;
    if (!cam) return null;

    const position = cam.position.toArray() as [number, number, number];
    const rotation = cam.rotation.toArray() as [number, number, number];
    
    let zoom: number | undefined = undefined;
    if (cameraMode === "orthographic") {
      // Type guard to ensure cam is OrthographicCamera before accessing zoom
      if ('isOrthographicCamera' in cam && cam.isOrthographicCamera) {
        zoom = cam.zoom;
      }
    }

    return { position, rotation, zoom };
  };

  return { cameraRef, captureCurrentSettings };
};
