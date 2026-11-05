# mdxjs-react

This package compliments the [@mintsourcejs/mdsjx-code-plugin](../mdxjs-code-plugin/README.md) package and @mdx-js/react to provide live editing / running examples in code blocks.

## Basic Usage
```jsx
import { MDXProvider } from "@mdx-js/react";
import { mdxComponents } from "@mintsourcejs/mdxjs-react";

export function App() {
  return (
    <MDXProvider components={mdxComponents}>
      <div className="app">
        {/* ... */}
      </div>
    </MDXProvider>
  )
}
```

To make things simple, the `@mintsourcejs/mdxjs-react` plugin exports `mdxComponents` that can simply be passed to the `MDXProvider` to wire up the custom components for use in MDX documents.

The heading components (`h1` to `h6`) render an anchor link to the heading's `id`. The ids are added by `@mintsourcejs/mdxjs-code-plugin`; a heading without an `id` is rendered without the link.

## Advanced Usage
If you want access to modules imported for the code block, you can use the `useMdxScope` hook. Pass it the code block's `data-scope` property, which maps each name imported by the code block to the module in the document's scope. You can use this to write a custom `Code` component if you want to. If it renders `CodeLive`, strip the imports from the code first: the code block's `data-code-start` property is the offset of the code following them.

```jsx
export const Code = ({ children, "data-scope": dataScope }) => {
    const locals = useMdxScope(dataScope && JSON.parse(dataScope));

    return (
        <code>{children}</code>
    );
}
```