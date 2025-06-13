import type { NextConfig } from 'next';
import initializeBundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from "next-intl/plugin";

// https://www.npmjs.com/package/@next/bundle-analyzer
const withBundleAnalyzer = initializeBundleAnalyzer({
    enabled: process.env.BUNDLE_ANALYZER_ENABLED === 'true'
});

const withNextIntl = createNextIntlPlugin();

// https://nextjs.org/docs/pages/api-reference/next-config-js
const nextConfig: NextConfig = {
    output: 'standalone'
};

// Compose plugins
export default withNextIntl(withBundleAnalyzer(nextConfig));