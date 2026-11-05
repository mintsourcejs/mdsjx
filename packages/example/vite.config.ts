import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import { rehypeCodePlugin } from '@mintsourcejs/mdxjs-code-plugin';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mdx({
    providerImportSource: "@mdx-js/react",
    rehypePlugins: [
      rehypeCodePlugin(),
    ]
  })],
  resolve: {
    alias: {
      "module-a": fileURLToPath(new URL("./src/module-a", import.meta.url)),
      "module-b": fileURLToPath(new URL("./src/module-b", import.meta.url))
    }
  }
})
