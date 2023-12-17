# mdxjs-code-plugin

An mdx-js plugin to support live code editing / preview functionality in MDX documents.

Here is a list of its major functions.

* Extract import statements from any code block.
* Combine and include the imports at the top of mdx component.
* Add a `data-meta` property, allowing access to the meta string supported by markdown for code. (by default, mdx ignores this)
* Add a `data-scope` property with a comma-delimited value of identifiers imported by the code block.
* Wrap the whole MDX Document with an `MdxScopeProvider` component (by default from `@mintsourcejs/mdxjs-react`) to provide access to any imported modules.

## Usage

### With Vite
```js
import mdx from '@mdx-js/rollup'
import { rehypeCodePlugin } from '@mintsourcejs/mdxjs-code--plugin';
import react from '@vitejs/plugin-react'
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
```

### With webpack (including react-refresh)
```js
import { rehypeCodePlugin } from '@mintsourcejs/mdxjs-code-plugin';

// the webpack rule for .mdx files
{
    test: /\.mdx?$/,
    exclude: /node_modules/,
    use: [{
        loader: "babel-loader",
        options: {
            plugins: "react-refresh/babel"
        }
    }, {
        loader: "@mdx-js/loader",
        options: {
            providerImportSource: "@mdx-js/react",
            rehypePlugins: [
                rehypeCodePlugin()
            ]
        }
    }]
}
```
