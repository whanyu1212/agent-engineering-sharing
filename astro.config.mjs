import { defineConfig } from 'astro/config';

// SITE and BASE are populated by the GitHub Pages deploy workflow
// (actions/configure-pages exposes them). Locally they're undefined and
// Astro falls back to its defaults, so `pnpm dev` and `pnpm build` keep
// working without any extra env setup.
export default defineConfig({
  output: 'static',
  site: process.env.SITE,
  base: process.env.BASE,
});
