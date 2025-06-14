"use client";

import React from "react";
import { OrbitControls, OrbitControlsProps } from "@react-three/drei";

export const Controls: React.FC<OrbitControlsProps> = (props) => (
  <OrbitControls
    enablePan
    enableRotate
    enableZoom
    panSpeed={1}
    rotateSpeed={0.7}
    zoomSpeed={0.6}
    {...props}
  />
);
