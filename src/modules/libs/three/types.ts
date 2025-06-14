import * as THREE from "three";

export type CameraMode = "perspective" | "orthographic";

export interface CameraSettings {
  position: [number, number, number];
  rotation: [number, number, number];
  zoom?: number;
}

export interface AnimateOptions {
  durationMs: number;
  easing?: (t: number) => number;
}


export type TransformMode = "translate" | "rotate" | "scale";
export type TransformSpace = "local" | "world";

export interface TransformSettings {
  /** The object to manipulate. */
  target: THREE.Object3D;
  /** Which gizmo mode is active. */
  mode: TransformMode;
  /** Use local or world space. */
  space: TransformSpace;
  /** Visual size of the gizmo. */
  size: number;
  /** Snapping increment for translation (or `null` to disable). */
  snapTranslate: number | null;
  /** Snapping increment for rotation (radians) (or `null` to disable). */
  snapRotate: number | null;
  /** Snapping increment for scale (or `null` to disable). */
  snapScale: number | null;
  /** Optional: current position, for external UI. */
  position?: [number, number, number];
  /** Optional: current rotation (Euler), for external UI. */
  rotation?: [number, number, number];
  /** Optional: current scale, for external UI. */
  scale?: [number, number, number];
}
