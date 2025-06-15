"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator, // Added Separator
} from "@/modules/ui/components/dropdown/menu";
import { Button } from "@/modules/ui/components/Button";
import { 
  Brush, 
  SquareStack, 
  Combine, 
  Rows, 
  PlusSquare, 
  LayoutDashboard,
  Paintbrush, // Icon for Paint Terrain
  Mountain,   // Icon for Sculpt Terrain
  Trees,      // Icon for Terrain Detail Submenu
  Sprout,     // Icon for Grass Brush
  Gem,        // Icon for Rocks Brush (placeholder)
  Palette,    // Icon for general Pinceles/Brushes
  Settings2,  // Icon for a generic sub-sub-menu item
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { LayoutSuggestion, LayoutType } from "@/modules/hooks/useViewportLayoutManager";
import type { SVGProps } from "react";

// Define types for a recursive menu structure
export type EditorToolType = "terrain-paint" | "terrain-sculpt" | "terrain-grass" | "terrain-rocks" | "units-place" | "elements-add"; // More specific tool types

interface BaseMenuItem {
  id: string; // Unique ID for the item, used as React key
  labelKey: string; // i18n key for the label
  icon?: React.ReactElement<SVGProps<SVGSVGElement>>;
  disabled?: boolean;
}

export interface ActionMenuItem extends BaseMenuItem {
  type: "item";
  action?: () => void; // Action to perform on click
}

export interface SubMenuTriggerItem extends BaseMenuItem {
  type: "submenu";
  items: NestedDropdownMenuItem[]; // Array of items for the sub-menu
}

export interface SeparatorMenuItem {
  type: "separator";
  id: string; // Unique ID for the separator
}

export type NestedDropdownMenuItem = ActionMenuItem | SubMenuTriggerItem | SeparatorMenuItem;

// Helper function to render nested menu items recursively
const renderNestedMenuItems = (
  items: NestedDropdownMenuItem[],
  t: (key: string) => string // Assuming t can handle any string key from its namespace
): React.ReactNode[] => {
  return items.map((item) => {
    if (item.type === "separator") {
      return <DropdownMenuSeparator key={item.id} />;
    }

    if (item.type === "submenu") {
      return (
        <DropdownMenuSub key={item.id}>
          <DropdownMenuSubTrigger disabled={item.disabled}>
            {item.icon && React.cloneElement(item.icon, { className: "mr-2 h-4 w-4" })}
            {t(item.labelKey)}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {renderNestedMenuItems(item.items, t)}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    }

    // item.type === "item"
    return (
      <DropdownMenuItem key={item.id} onClick={item.action} disabled={item.disabled}>
        {item.icon && React.cloneElement(item.icon, { className: "mr-2 h-4 w-4" })}
        {t(item.labelKey)}
      </DropdownMenuItem>
    );
  });
};


interface WorldEditorToolbarProps {
  onSelectTool?: (tool: EditorToolType) => void; // Updated to use more specific tool types
  onSelectViewportAction?: (action: "addView") => void;
  suggestedLayouts?: LayoutSuggestion[];
  onSelectLayout?: (layoutType: LayoutType) => void;
}

export const WorldEditorToolbar: React.FC<WorldEditorToolbarProps> = ({
  onSelectTool,
  onSelectViewportAction,
  suggestedLayouts = [],
  onSelectLayout,
}) => {
  const t = useTranslations("worldEditor.toolbar");

  // Define the structure for the "Brushes" dropdown menu
  const brushMenuItems: NestedDropdownMenuItem[] = [
    {
      id: "terrain-main",
      type: "submenu",
      labelKey: "terrainBrush", // Existing: "Terreno"
      icon: <SquareStack />,
      items: [
        {
          id: "terrain-paint",
          type: "item",
          labelKey: "terrainPaintBrush", // New: "Pintar Terreno"
          icon: <Paintbrush />,
          action: () => onSelectTool?.("terrain-paint"),
        },
        {
          id: "terrain-sculpt",
          type: "item",
          labelKey: "terrainSculptBrush", // New: "Esculpir Terreno"
          icon: <Mountain />,
          action: () => onSelectTool?.("terrain-sculpt"),
        },
        { type: "separator", id: "terrain-sep1" },
        {
          id: "terrain-details-submenu",
          type: "submenu",
          labelKey: "terrainDetailSubmenu", // New: "Detalles del Terreno"
          icon: <Trees />,
          items: [
            {
              id: "terrain-grass",
              type: "item",
              labelKey: "terrainGrassBrush", // New: "Pincel de Hierba"
              icon: <Sprout />,
              action: () => onSelectTool?.("terrain-grass"),
            },
            {
              id: "terrain-rocks",
              type: "item",
              labelKey: "terrainRocksBrush", // New: "Pincel de Rocas"
              icon: <Gem />, // Using Gem as a placeholder for rocks
              action: () => onSelectTool?.("terrain-rocks"),
            },
            { type: "separator", id: "terrain-detail-sep" },
            { // Example of a sub-sub-menu item
              id: "terrain-advanced-options",
              type: "submenu",
              labelKey: "advancedTerrainOptions", // New: "Opciones Avanzadas Terreno"
              icon: <Settings2 />,
              items: [
                {
                  id: "terrain-texture-settings",
                  type: "item",
                  labelKey: "textureSettings", // New: "Ajustes de Textura"
                  action: () => console.log("Texture settings selected"),
                }
              ]
            }
          ],
        },
      ],
    },
    { type: "separator", id: "brush-sep1" },
    {
      id: "units-main",
      type: "item",
      labelKey: "unitsBrush", // Existing: "Unidades"
      icon: <Combine />,
      action: () => onSelectTool?.("units-place"), // Example specific action
    },
    {
      id: "elements-main",
      type: "item",
      labelKey: "elementsBrush", // Existing: "Elementos"
      icon: <Brush />, // General brush icon for elements
      action: () => onSelectTool?.("elements-add"), // Example specific action
    },
  ];

  // Define the structure for the "Viewports" dropdown menu
  const viewportLayoutSubMenuItems: NestedDropdownMenuItem[] = suggestedLayouts.length > 0
    ? suggestedLayouts.map((layout) => ({
        id: `layout-${layout.type}`,
        type: "item",
        labelKey: layout.descriptionKey, // This is already an i18n key
        action: () => onSelectLayout?.(layout.type),
      }))
    : [
        {
          id: "no-layouts-available",
          type: "item",
          labelKey: "noLayoutsAvailable",
          disabled: true,
        },
      ];

  const viewportMenuItems: NestedDropdownMenuItem[] = [
    {
      id: "add-view",
      type: "item",
      labelKey: "addView",
      icon: <PlusSquare />,
      action: () => onSelectViewportAction?.("addView"),
    },
    {
      id: "adjust-layout-submenu",
      type: "submenu",
      labelKey: "adjustLayout",
      icon: <LayoutDashboard />,
      items: viewportLayoutSubMenuItems,
    },
  ];

  return (
    <div className="absolute hover:opacity-100 opacity-80 transition-all  left-0 right-0 z-50 flex items-center justify-between w-full h-16 px-4 bg-base-200 text-base-content shadow-md">
      <div className="flex items-center space-x-4 ">
        {/* Brushes Dropdown - Refactored */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Palette className="mr-2 h-4 w-4" /> {/* Changed icon to Palette */}
              {t("brushes")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {renderNestedMenuItems(brushMenuItems, t)}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Viewports Dropdown - Refactored */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Rows className="mr-2 h-4 w-4" /> {t("viewports")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {renderNestedMenuItems(viewportMenuItems, t)}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default WorldEditorToolbar;
