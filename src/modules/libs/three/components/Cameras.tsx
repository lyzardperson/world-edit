// src/ui/libs/three/components/Cameras.tsx
"use client";

import React from "react";
import * as THREE from 'three'
import { PerspectiveCamera, OrthographicCamera } from "@react-three/drei";
import type {
  PerspectiveCameraProps,
  OrthographicCameraProps,
} from "@react-three/drei";

// Forward ref to the underlying PerspectiveCamera instance
export const DefaultPerspectiveCamera = React.forwardRef<
  THREE.PerspectiveCamera,
  PerspectiveCameraProps
>((props, ref) => (
  <PerspectiveCamera
    makeDefault
    ref={ref}
    position={[5, 5, 5]}
    fov={50}
    {...props}
  />
));
DefaultPerspectiveCamera.displayName = "DefaultPerspectiveCamera";

// Forward ref to the underlying OrthographicCamera instance
export const DefaultOrthographicCamera = React.forwardRef<
  THREE.OrthographicCamera,
  OrthographicCameraProps
>((props, ref) => (
  <OrthographicCamera
    makeDefault
    ref={ref}
    position={[5, 5, 5]}
    zoom={50}
    near={0.1}
    far={1000}
    {...props}
  />
));
DefaultOrthographicCamera.displayName = "DefaultOrthographicCamera";
