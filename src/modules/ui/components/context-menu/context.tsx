"use client";

import React from "react";
import type { MenuContextType } from "./types";

/**
 * Our shared ContextMenu context.
 */
export const ContextMenuContext = React.createContext<MenuContextType | null>(null);
