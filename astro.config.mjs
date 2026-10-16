import { defineConfig } from 'astro/config';

export default defineConfig({
  // À remplacer par l'adresse définitive une fois le projet Vercel créé.
  site: 'https://newborshian.github.io',
  output: 'static',
  build: {
    // Feuilles de style en fichiers séparés : compatible avec une CSP sans 'unsafe-inline'.
    inlineStylesheets: 'never',
  },
  vite: {
    // Scripts en fichiers séparés, jamais inlinés : la CSP n'autorise que script-src 'self'.
    build: { assetsInlineLimit: 0 },
  },
});
