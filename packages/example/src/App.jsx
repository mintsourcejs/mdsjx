import { MDXProvider } from "@mdx-js/react";
import { mdxComponents } from "@mintsourcejs/mdxjs-react";
import './App.css'
import Test from './test.mdx';

function App() {
  return (
    <MDXProvider components={mdxComponents}>
      <div className="app">
        <div className="app-content">
          <Test />
        </div>
      </div>
    </MDXProvider>
  )
}

export default App
