// Prepend Astro's configured `base` to an internal path so links work
// whether the site is served at `/` (local dev, custom domain) or under
// a project sub-path like `/agent-engineering-sharing/` (GitHub Pages
// project site).
//
// Usage: <a href={url('/codeact/')}>...
//
// `import.meta.env.BASE_URL` is set by Astro at build time from the
// `base` option in astro.config.mjs. It always has a trailing slash, so
// we strip the leading `/` from `path` before joining.
export function url(path: string): string {
  const base = import.meta.env.BASE_URL;
  if (!path.startsWith('/')) return base + path;
  return base.replace(/\/$/, '') + path;
}
