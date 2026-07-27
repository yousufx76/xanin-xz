import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'
import prerender from '@prerenderer/rollup-plugin'
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer'

const routesToPrerender = [
  '/',
  '/about',
  '/works',
  '/cv',
  '/reviews',
  '/events',
  '/contact',
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://xaninxz.com',
      dynamicRoutes: routesToPrerender
    }),
    // Only run prerendering during production build, not dev server
    process.env.NODE_ENV === 'production' &&
      prerender({
        routes: routesToPrerender,
        renderer: new PuppeteerRenderer({
          renderAfterDocumentEvent: 'render-event', // optional, see note below
        }),
      }),
  ].filter(Boolean),
})