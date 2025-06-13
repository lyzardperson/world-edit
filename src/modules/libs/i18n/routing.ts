// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es', 'pt', 'ru', 'fr', 'de', 'it', 'ja', 'ko', 'zh', 'ar'],
  defaultLocale: 'en'
});
