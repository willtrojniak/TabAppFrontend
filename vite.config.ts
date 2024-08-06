import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import TanStackRouterVite from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    viteReact()
  ],
  server: {
    host: '127.0.0.1'
  }
})
