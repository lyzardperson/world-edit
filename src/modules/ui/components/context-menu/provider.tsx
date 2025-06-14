// src/modules/ui/context-menu/ContextMenuProvider.tsx
"use client";

import React, { useRef, useState, useCallback, ReactNode } from "react";
import type { MenuItem, Context } from "./types";
import { ContextMenuContext } from "./context";
import ContextMenu from ".";

interface MenuState {
  x: number;
  y: number;
  items: MenuItem[];
}

export function ContextMenuProvider({ children }: { children: ReactNode }) {
  const rulesRef = useRef<Array<(ctx: Context) => MenuItem[]>>([]);
  const [menuState, setMenuState] = useState<MenuState | null>(null);

  const registerRule = useCallback((rule: (ctx: Context) => MenuItem[]) => {
    rulesRef.current.push(rule);
    const idx = rulesRef.current.length - 1;
    return () => {
      rulesRef.current.splice(idx, 1);
    };
  }, []);

  const openMenu = useCallback(
    (e: React.MouseEvent, ctx: Context = {}) => {
      e.preventDefault();
      const raw = rulesRef.current.flatMap(r => r(ctx));
      const seen = new Set<string>();
      const items = raw.filter(item => {
        if (seen.has(item.key)) return false;
        seen.add(item.key);
        return true;
      });
      if (items.length) {
        setMenuState({ x: e.clientX, y: e.clientY, items });
      }
    },
    []
  );

  const closeMenu = useCallback(() => setMenuState(null), []);

  return (
    <>
      <ContextMenuContext.Provider value={{ registerRule, openMenu, closeMenu }}>
        {children}
      </ContextMenuContext.Provider>

      {menuState && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={closeMenu}
          />
          <ContextMenu
            x={menuState.x}
            y={menuState.y}
            items={menuState.items}
            onClose={closeMenu}
          />
        </>
      )}
    </>
  );
}
