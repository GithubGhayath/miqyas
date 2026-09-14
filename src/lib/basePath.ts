// Next.js does not auto-prefix a local next/image `src` with `basePath` (it
// only does that for next/link and next/router) — see next.config.ts. Every
// local image path must be run through this helper so it still resolves
// once the site is deployed under a GitHub Pages project path (`/miqyas/…`)
// rather than the domain root.
export function withBasePath(path: string): string {
  return `${process.env.BASE_PATH ?? ''}${path}`;
}
