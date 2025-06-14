"use client";

import React from "react";
import { Canvas as R3FCanvas, CanvasProps } from "@react-three/fiber";

export const Canvas: React.FC<CanvasProps> = (props) => (
  <R3FCanvas
    shadows
    gl={{ antialias: true }}
    camera={{ position: [5, 5, 5], fov: 50 }}
    {...props}
  >
    {props.children}
  </R3FCanvas>
);
