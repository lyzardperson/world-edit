"use client";

import React from "react";
import { Grid, GridProps } from "@react-three/drei";

export const GridComponent: React.FC<GridProps> = (props) => (
  <Grid
    args={[20, 20]}
    cellSize={1}
    cellThickness={0.6}
    sectionSize={5}
    sectionThickness={1.2}
    fadeDistance={30}
    fadeStrength={1}
    followCamera={false}
    infiniteGrid
    {...props}
  />
);
