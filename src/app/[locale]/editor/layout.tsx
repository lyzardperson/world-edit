// src/modules/ui/components/EditorLayout.tsx
"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Layout as LayoutIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { useContextMenu, useRegisterContextMenu } from "@/modules/hooks/useContextMenu";
import { Layout as UILayout } from "@/modules/ui/components/Layout";
import { Navbar } from "@/modules/ui/components/tabs/navbar";
import { Context } from "@/modules/ui/components/context-menu/types";

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("contextMenu");
  const { openMenu } = useContextMenu();

  // --- Tabs state + ref for up-to-date submenu ---
  const [tabs, setTabs] = useState<{ id: string; label: string }[]>([
    { id: "workspace-1", label: "Workspace 1" },
    { id: "workspace-2", label: "Workspace 2" },
  ]);
  const [activeId, setActiveId] = useState(tabs[0].id);
  const tabsRef = useRef(tabs);
  useEffect(() => {
    tabsRef.current = tabs;
  }, [tabs]);

  // Add-tab handler (stable)
  const addTab = useCallback(() => {
    const nextIndex = tabsRef.current.length + 1;
    const id = `workspace-${Date.now()}`;
    setTabs(prev => [...prev, { id, label: `Workspace ${nextIndex}` }]);
    setActiveId(id);
  }, []);

  // Close-tab handler
  const closeTab = useCallback((id: string) => {
    setTabs(prev => prev.filter(t => t.id !== id));
    if (id === activeId) {
      const idx = tabsRef.current.findIndex(t => t.id === id);
      const fallback =
        tabsRef.current[idx - 1]?.id ??
        tabsRef.current[idx + 1]?.id ??
        tabsRef.current[0]?.id;
      fallback && setActiveId(fallback);
    }
  }, [activeId]);

  // --- Register exactly one background rule on mount ---
  useRegisterContextMenu(
    useCallback((ctx: Context) => {
      // only show on true “background” clicks
      if (!ctx.background) return [];

      return [
        {
          key: "addView",
          icon: <Plus className="h-4 w-4" />,
          label: t("addView"),
          action: addTab,
        },
        {
          key: "moveToTab",
          icon: <LayoutIcon className="h-4 w-4" />,
          label: t("moveToTab"),
          subItems: tabsRef.current.map(tab => ({
            key: `move-${tab.id}`,
            label: tab.label,
            action: () => {
              /* your “move to tab” logic here */
              setActiveId(tab.id);
            },
          })),
        },
      ];
    }, [addTab, t])
  );

  return (
    <UILayout>
      <motion.div
        className="flex flex-col h-full bg-base-100"
        // only fire our background rule when background: true
        onContextMenu={e => openMenu(e, { background: true })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Tabs bar */}
        <Navbar
          tabs={tabs}
          activeId={activeId}
          onSelect={setActiveId}
          onAdd={addTab}
          onClose={closeTab}
        />

        {/* Active workspace area */}
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </motion.div>
    </UILayout>
  );
}
