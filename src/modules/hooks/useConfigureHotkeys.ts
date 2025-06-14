// src/ui/hooks/useConfiguredHotkeys.ts
import { useEffect } from "react";
import hotkeys from "hotkeys-js";

type HandlerMap = Record<string, () => void>;

// loads JSON at build-time or runtime
export async function loadKeymap(name: string) {
  return await import(`../../config/hotkeys/${name}.json`) as {
    description: string;
    bindings: Record<string,string>;
  };
}

/**
 * useConfiguredHotkeys
 *
 * @param keymapName  name of the JSON file (without .json)
 * @param handlers    map from action name in JSON to callback
 */
export function useConfiguredHotkeys(
  keymapName: string,
  handlers: HandlerMap
) {
  useEffect(() => {
    let bindingMap: Record<string,string> = {};
    let activeKeys: string[] = [];

    loadKeymap(keymapName).then(({ bindings }) => {
      bindingMap = bindings;
      // register each hotkey
      for (const [keyCombo, action] of Object.entries(bindings)) {
        const fn = handlers[action];
        if (typeof fn === "function") {
          hotkeys(keyCombo, (e) => {
            e.preventDefault();
            fn();
          });
          activeKeys.push(keyCombo);
        } else {
          console.warn(`No handler for action "${action}"`);
        }
      }
    });

    return () => {
      // unbind on cleanup
      activeKeys.forEach((combo) => hotkeys.unbind(combo));
    };
  }, [keymapName, handlers]);
}
