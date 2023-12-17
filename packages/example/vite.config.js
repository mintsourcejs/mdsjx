import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import { rehypeCodePlugin } from '@mintsourcejs/mdxjs-code-plugin';
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mdx({
    providerImportSource: "@mdx-js/react",
    rehypePlugins: [
      rehypeCodePlugin(),
    ]
  })],
})
