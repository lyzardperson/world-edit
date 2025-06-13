import createMiddleware from 'next-intl/middleware';
import { routing } from './modules/libs/i18n/routing';

export default createMiddleware({
  // A list of all locales that are supported
  locales: routing.locales,
  
  // Used when no locale matches
  defaultLocale: routing.defaultLocale,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(es|en|pt|ru|fr|de|it|ja|ko|zh)/:path*']
}; 