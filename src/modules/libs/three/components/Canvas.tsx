"use client";

import React from "react";
import { Canvas as R3FCanvas, type CanvasProps as R3FCanvasProps } from "@react-three/fiber";

export interface CanvasProps extends R3FCanvasProps {
  style?: React.CSSProperties;
}

export const Canvas: React.FC<CanvasProps> = ({ style, ...props }) => {
  return (
    <div className="w-full h-full relative">
      <R3FCanvas
        shadows
        gl={{ antialias: true, ...props.gl }}
        {...props}
        style={style}
        className={`${props.className || ""}`}
      >
        {props.children}
      </R3FCanvas>
    </div>
  );
};
