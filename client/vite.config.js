import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()
    ,nodePolyfills()
  ],define: {
    global: 'window', // Fixes simple-peer "global is not defined" or eval errors
  },
})
