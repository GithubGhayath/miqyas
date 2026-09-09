import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'fastly.picsum.photos' },
      { protocol: 'https', hostname: 'commondatastorage.googleapis.com' },
    ],
    // picsum.photos redirects to a signed fastly URL; Next's server-side image
    // optimizer gets a 403 fetching that upstream in this environment, so we
    // skip re-optimization for these placeholder images and let the browser
    // load them directly (they're already served pre-sized by picsum).
    unoptimized: true,
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
