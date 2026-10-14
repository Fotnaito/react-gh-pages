import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Required so assets load correctly on GitHub Pages project sites
  // (https://<user>.github.io/<repo>/). If deploying to a user/org page
  // (<user>.github.io), change this to '/'.
  base: '/react-gh-pages/',
})
