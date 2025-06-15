"use client";

import React from "react";
import { Button } from "@/modules/ui/components/Button";
import type { CameraSettings } from "../../../types";

interface ToolbarProps {
  onSaveSettings?: (settings: CameraSettings) => void;
  onResetSettings?: () => void;
  captureCurrentSettings: () => CameraSettings | null;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onSaveSettings,
  onResetSettings,
  captureCurrentSettings,
}) => {
  return (
    <div className="absolute top-4 right-4 flex gap-2 bg-background/80 backdrop-blur-md p-2 rounded shadow-lg z-10">
      <Button
        size="sm"
        onClick={() => {
          const current = captureCurrentSettings();
          if (current && onSaveSettings) onSaveSettings(current);
        }}
      >
        Save
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onResetSettings?.()}
      >
        Reset
      </Button>
    </div>
  );
};
