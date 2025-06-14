"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MenuItem } from "./types";
import { ChevronRight } from "lucide-react";

interface Props {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}

export default function ContextMenu({ x, y, items, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [openSubmenuKey, setOpenSubmenuKey] = useState<string | null>(null);

  // Clamp to viewport
  useEffect(() => {
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    let nx = x, ny = y;
    if (x + width > window.innerWidth) nx = window.innerWidth - width - 8;
    if (y + height > window.innerHeight) ny = window.innerHeight - height - 8;
    ref.current.style.left = `${nx}px`;
    ref.current.style.top = `${ny}px`;
  }, [x, y]);

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        className="fixed z-50 bg-base-100 border rounded shadow-lg py-1 text-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.15 }}
        style={{ left: x, top: y }}
        onClick={e => e.stopPropagation()}
        onContextMenu={e => e.preventDefault()}
      >
        {items.map(item => {
          const hasSub = Array.isArray(item.subItems) && item.subItems.length > 0;
          return (
            <div
              key={item.key}
              className="relative"
              onMouseEnter={() => hasSub && setOpenSubmenuKey(item.key)}
              onMouseLeave={() => hasSub && setOpenSubmenuKey(null)}
            >
              <motion.button
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled && item.action) item.action();
                  onClose();
                }}
                whileHover={!item.disabled ? { backgroundColor: "rgba(0,0,0,0.05)", scale: 1.02 } : {}}
                whileTap={!item.disabled ? { scale: 0.98 } : {}}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-left ${
                  item.disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {item.icon && <span className="flex-none">{item.icon}</span>}
                <span className="flex-grow">{item.label}</span>
                {hasSub && <ChevronRight className="h-4 w-4 ml-auto" />}
              </motion.button>

              {hasSub && openSubmenuKey === item.key && (
                <motion.div
                  className="absolute left-full top-0 ml-1 bg-base-100 border rounded shadow-lg py-1 text-sm"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.1 }}
                >
                  {item.subItems!.map(sub => (
                    <motion.button
                      key={sub.key}
                      disabled={sub.disabled}
                      onClick={() => {
                        if (!sub.disabled && sub.action) sub.action();
                        onClose();
                      }}
                      whileHover={!sub.disabled ? { backgroundColor: "rgba(0,0,0,0.05)", scale: 1.02 } : {}}
                      whileTap={!sub.disabled ? { scale: 0.98 } : {}}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-left ${
                        sub.disabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {sub.icon && <span className="flex-none">{sub.icon}</span>}
                      <span className="flex-grow">{sub.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}
