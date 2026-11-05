# mdxjs-code-plugin

An mdx-js plugin to support live code editing / preview functionality in MDX documents.

Here is a list of its major functions.

* Extract the import statements at the top of JavaScript and TypeScript code blocks. Imports that follow other code are not extracted, and type only imports are left out.
* Combine and include the imports at the top of mdx component.
* Add a `data-meta` property, allowing access to the meta string supported by markdown for code. (by default, mdx ignores this)
* Add a `data-scope` property with a comma-delimited value of identifiers imported by the code block.
* Add a `data-code-start` property with the offset of the code following the imports.
* Wrap the whole MDX Document with an `MdxScopeProvider` component (by default from `@mintsourcejs/mdxjs-react`) to provide access to any imported modules.
* Add an `id` to each heading, slugged from its text (using [rehype-slug](https://github.com/rehypejs/rehype-slug)), so headings can be linked to.

## Usage

### With Vite
```js
import mdx from '@mdx-js/rollup'
import { rehypeCodePlugin } from '@mintsourcejs/mdxjs-code-plugin';
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

## Options

`rehypeCodePlugin(options)` accepts an optional object:

| Option | Default | Description |
| --- | --- | --- |
| `meta` | `true` | Add the `data-meta` property to code blocks. |
| `slug` | `true` | Add an `id` to each heading. Pass `false` to turn this off, or an object of [rehype-slug options](https://github.com/rehypejs/rehype-slug#options), e.g. `{ prefix: "doc-" }`. |

Heading ids are generated from the heading's full text, including any inline code or links. Repeated headings get unique ids (`example`, `example-1`, ...), and headings that already have an `id` are left unchanged.

## Plugin order

The heading ids are added when `rehypeCodePlugin` runs, so any plugin that needs them, such as [rehype-autolink-headings](https://github.com/rehypejs/rehype-autolink-headings) or a table of contents plugin, must come after it:

```js
rehypePlugins: [
  rehypeCodePlugin(),
  rehypeAutolinkHeadings,
]
```

You don't need to add `rehype-slug` yourself. If you do, it's harmless: whichever runs second leaves the existing ids alone.

