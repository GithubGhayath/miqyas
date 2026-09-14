import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Set by the GitHub Actions deploy workflow to '/<repo-name>' for a project
// page (https://<owner>.github.io/<repo-name>/), or left empty for a
// user/org page (https://<owner>.github.io/) or any non-GitHub-Pages host.
// Empty in local dev, so `npm run dev`/`next start` are unaffected.
const basePath = process.env.NEXT_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  // Static export for GitHub Pages: no Node server, so the proxy/middleware
  // that used to pick a locale for `/` is gone (see the removed
  // src/proxy.ts and the new src/app/page.tsx that replaces its one job).
  output: 'export',
  basePath,
  // `next/image` does NOT auto-prefix a local `src` with `basePath` (see
  // node_modules/next/dist/docs/.../basePath.md, "Images" section) — that's
  // only automatic for next/link and next/router. Every local image src is
  // built with the `withBasePath()` helper (src/lib/basePath.ts) instead,
  // which reads this inlined value. `env` (unlike a plain NEXT_PUBLIC_ var)
  // is always baked into the client bundle regardless of prefix.
  env: {
    BASE_PATH: basePath,
  },
  // GitHub Pages has no server-side rewrite step, so a route needs to be a
  // real directory with an index.html inside it (`/en/index.html`, reached
  // via the URL `/en/`) rather than a sibling `en.html` file.
  trailingSlash: true,
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
    // Also required unconditionally for static export, which has no server
    // to run the Image Optimization API in the first place.
    unoptimized: true,
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
