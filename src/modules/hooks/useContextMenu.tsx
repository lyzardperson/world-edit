import { useContext, useEffect } from "react";
import { ContextMenuContext } from "../ui/components/context-menu/context";
import { Command, MenuItem } from "../ui/components/context-menu/types";

/**
 * Hook to open the shared context-menu.
 */
export function useContextMenu() {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) throw new Error("useContextMenu must be inside ContextMenuProvider");
  return { openMenu: ctx.openMenu };
}

/**
 * Register a rule function that returns MenuItems based on ctx.
 */
export function useRegisterContextMenu(ruleFn: (ctx: Record<string, any>) => MenuItem[]) {
  const ctx = useContext(ContextMenuContext)!;
  useEffect(() => ctx.registerRule(ruleFn), [ctx, ruleFn]);
}

/**
 * Bulk-register an array of string-based commands.
 */
export function useRegisterCommands(commands: Command[]) {
  const ctx = useContext(ContextMenuContext)!;
  useEffect(() => {
    const ruleFn = () => commands.map(cmd => ({
      key: cmd.key,
      label: cmd.key,
      action: cmd.action,
      disabled: cmd.disabled,
      data: { keywords: [cmd.key, ...(cmd.keywords ?? [])] },
    }));
    return ctx.registerRule(ruleFn);
  }, [ctx, commands]);
}
