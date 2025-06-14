"use client";

import React from "react";
import { X } from "lucide-react";

interface TabItemProps {
  id: string;
  label: string;
  isActive: boolean;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

export function TabItem({
  id,
  label,
  isActive,
  onSelect,
  onClose,
}: TabItemProps) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => onSelect(id)}
      className={`flex items-center px-3 py-1 mr-1 rounded-t-md border-b-2 ${
        isActive
          ? "border-primary text-primary bg-base-100"
          : "border-transparent text-base-content/70 hover:text-base-content hover:border-base-300"
      }`}
    >
      <span className="truncate max-w-xs">{label}</span>
      <X
        className="ml-2 h-4 w-4 opacity-50 hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onClose(id);
        }}
      />
    </button>
  );
}
