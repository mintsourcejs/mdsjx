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

## Advanced Usage
If you want access to modules imported for the code block, you can use the `useMdxScope` hook. You can use this to write a custom `Code` component if you want to.

```jsx
export const Code = ({ children }) => {
    const locals = useMdxScope();

    return (
        <code>{children}</code>
    );
}
```