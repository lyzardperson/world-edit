"use client";

import React from "react";
import { Plus } from "lucide-react";
import { TabItem } from "./item";

interface NavbarProps {
  tabs: { id: string; label: string }[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onClose: (id: string) => void;
}

export function Navbar({
  tabs,
  activeId,
  onSelect,
  onAdd,
  onClose,
}: NavbarProps) {
  return (
    <div className="flex items-center border-b border-base-300 px-2">
      {tabs.map((tab) => (
        <TabItem
          key={tab.id}
          id={tab.id}
          label={tab.label}
          isActive={tab.id === activeId}
          onSelect={onSelect}
          onClose={onClose}
        />
      ))}
      <button
        onClick={onAdd}
        className="ml-auto p-1 rounded-full hover:bg-base-200"
        aria-label="Add workspace"
      >
        <Plus className="h-5 w-5 text-base-content/70 hover:text-base-content" />
      </button>
    </div>
  );
}
