"use client";

import React from "react";
import { Environment, EnvironmentProps } from "@react-three/drei";

export const EnvironmentComponent: React.FC<EnvironmentProps> = (props) => (
  <Environment preset="studio" background {...props} />
);
