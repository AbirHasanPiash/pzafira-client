import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    target: 'es2020',
    cssCodeSplit: true,
    // Route chunks are small; anything above this is worth a second look.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        /**
         * Only the always-needed, rarely-changing core is pinned to a chunk of
         * its own, so it stays in the browser cache across deploys.
         *
         * Everything else is deliberately left to Rollup: it places each
         * dependency in the route chunk that imports it, so a library used by
         * one page (charts, date formatting, drag interactions) is downloaded
         * with that page instead of on first paint. A catch-all `vendor` chunk
         * would undo that and pull every dependency into the initial load.
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/scheduler/') ||
            id.includes('react-router')
          )
            return 'react'
        },
      },
    },
  },
})
