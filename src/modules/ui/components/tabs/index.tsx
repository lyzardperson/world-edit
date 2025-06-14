"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TabsProps {
  /** the initially selected tab key */
  defaultValue: string;
  /** optional controlled value */
  value?: string;
  /** fires when a tab is selected */
  onValueChange?: (value: string) => void;
  /** wrapper class */
  className?: string;
  children: ReactNode;
}

interface TabsContextValue {
  selected: string;
  select: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

/**
 * Tabs root: provides context and handles controlled vs uncontrolled.
 */
export function Tabs({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
}: TabsProps) {
  const [internal, setInternal] = useState(defaultValue);
  const selected = value ?? internal;

  const select = useCallback(
    (val: string) => {
      if (value === undefined) {
        setInternal(val);
      }
      onValueChange?.(val);
    },
    [onValueChange, value]
  );

  const ctx = useMemo(
    () => ({
      selected,
      select,
    }),
    [selected, select]
  );

  return (
    <TabsContext.Provider value={ctx}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

/**
 * TabList: container for triggers.
 */
export function TabList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div role="tablist" className={className}>{children}</div>;
}

/**
 * TabTrigger: click to select a tab.
 */
export function TabTrigger({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabTrigger must be inside Tabs");

  const isSelected = ctx.selected === value;
  return (
    <button
      role="tab"
      aria-selected={isSelected}
      onClick={() => ctx.select(value)}
      className={`
        px-4 py-2 font-medium
        ${
          isSelected
            ? "border-b-2 border-primary text-primary"
            : "text-base-content/70 hover:text-base-content"
        }
        ${className || ""}
      `}
    >
      {children}
    </button>
  );
}

/**
 * TabContent: shows its children only when its `value` matches selected.
 * Uses Framer Motion for fade in/out.
 */
export function TabContent({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabContent must be inside Tabs");

  return (
    <AnimatePresence initial={false} mode="wait">
      {ctx.selected === value && (
        <motion.div
          key={value}
          role="tabpanel"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.15 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
