import { useState, useCallback } from "react";
import type { TransformSettings } from "./types";

export function useTransform(initial: TransformSettings) {
  const [settings, setSettings] = useState<TransformSettings>(initial);

  const setMode = useCallback(
    (mode: TransformSettings["mode"]) => {
      setSettings(s => ({ ...s, mode }));
    },
    []
  );

  const setSnap = useCallback(
    (type: "translate" | "rotate" | "scale", value: number) => {
      setSettings(s => ({
        ...s,
        snapTranslate: type === "translate" ? value : s.snapTranslate,
        snapRotate: type === "rotate" ? value : s.snapRotate,
        snapScale: type === "scale" ? value : s.snapScale,
      }));
    },
    []
  );

  return { settings, setMode, setSnap, setSettings };
}
