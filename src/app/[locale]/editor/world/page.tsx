"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Copy } from "lucide-react";

import { CameraSettings } from "@/modules/libs/three";
import { MenuView } from "@/modules/libs/three/composites/MenuView";

import {
  useContextMenu,
  useRegisterContextMenu,
} from "@/modules/hooks/useContextMenu";

export default function WorldPage() {
  const t = useTranslations("contextMenu");
  const { openMenu } = useContextMenu();

  // 1) Default camera settings
  const defaultSettings: CameraSettings = {
    position: [5, 5, 5],
    rotation: [0, 0, 0],
    zoom: 30,
  };

  // 2) Maintain a list of view instances
  const [views, setViews] = useState<
    { id: string; settings: CameraSettings }[]
  >([{ id: `view-${Date.now()}`, settings: defaultSettings }]);

  // Helper: add a new view cloned from the last one
  const addMenuView = () => {
    setViews((prev) => {
      const last = prev[prev.length - 1];
      const clone = {
        id: `view-${Date.now()}`,
        settings: { ...last.settings },
      };
      return [...prev, clone];
    });
  };

  // Helper: update a specific view’s settings
  const updateSettings = (id: string, newSettings: CameraSettings) => {
    setViews((prev) =>
      prev.map((v) => (v.id === id ? { ...v, settings: newSettings } : v))
    );
  };

  // 3) Register a context-menu rule scoped to this page
  useRegisterContextMenu((ctx) => {
    // Our flag: openMenu(e, { worldPage: true })
    if (!ctx.worldPage) return [];
    return [
      {
        key: "clone-view",
        icon: <Copy className="h-4 w-4" />,
        label: t("cloneView"),
        action: addMenuView,
      },
    ];
  });

  return (
    <div className="h-full bg-base-100">
      <h2 className="text-xl font-semibold mb-2 text-base-content">
        {t("worldEditorTitle")}
      </h2>

      {/* 
        4) our 3D canvas container: 
        — catches right-click to open the menu
      */}
      <div
        className="h-[calc(100%-2rem)] bg-base-200 border-2 border-dashed border-base-300 rounded-lg overflow-hidden relative"
        onContextMenu={(e) => openMenu(e, { worldPage: true })}
      >
        {views.map(({ id, settings }) => (
          <MenuView
            key={id}
            settings={settings}
            cameraMode="perspective"
            showGrid={true}
            onSaveSettings={(newSettings) => {
              console.log("Saved settings for", id, newSettings);
              updateSettings(id, newSettings);
            }}
            onResetSettings={() => {
              updateSettings(id, defaultSettings);
            }}
          />
        ))}
      </div>
    </div>
  );
}
