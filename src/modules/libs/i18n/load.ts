import fs from "fs";
import path from "path";
import type { Messages } from "next-intl";

// Recursively read all .json files under `dir` and return an object:
// { locale: { namespace: Record<string,string> } }
export function loadAllMessages(
  baseDir = path.resolve(process.cwd(), "messages")
): Record<string, Messages> {
  const locales = fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const result: Record<string, Messages> = {};

  for (const locale of locales) {
    const localeDir = path.join(baseDir, locale);
    result[locale] = {};

    // read every .json file in that locale folder
    const files = fs.readdirSync(localeDir).filter(f => f.endsWith(".json"));
    for (const file of files) {
      const namespace = path.basename(file, ".json");
      const filePath = path.join(localeDir, file);
      const fileContents = fs.readFileSync(filePath, "utf-8");
      result[locale][namespace] = JSON.parse(fileContents);
    }
  }

  return result;
}
