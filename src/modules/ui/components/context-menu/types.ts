import React from "react";

/** Arbitrary context object passed when opening the menu */
export type Context = Record<string, unknown>;

/** A single menu entry (leaf or parent). */
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  action?: () => void;
  disabled?: boolean;
  /** If present, renders a submenu */
  subItems?: MenuItem[];
}

/** Bulk-registered “command” shorthand. */
export interface Command {
  key: string;
  action: () => void;
  keywords?: string[];
  disabled?: boolean;
}

/** The shape of our context-menu context. */
export interface MenuContextType {
  /** Register a rule fn that returns MenuItems for a given ctx */
  registerRule: (ruleFn: (ctx: Context) => MenuItem[]) => () => void;
  /** Open menu at mouse event, passing arbitrary ctx flags */
  openMenu: (e: React.MouseEvent, ctx?: Context) => void;
  /** Close any open menu */
  closeMenu: () => void;
}
