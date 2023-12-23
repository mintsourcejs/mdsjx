import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import { rehypeCodePlugin } from '@mintsourcejs/mdxjs-code-plugin';
import path from 'node:path';
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
      "module-a": path.resolve(__dirname, "./src/module-a"),
      "module-b": path.resolve(__dirname, "./src/module-b")
    }
  }
})
