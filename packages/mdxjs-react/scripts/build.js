import * as esbuild from "esbuild";
import { cp, watch } from "node:fs/promises";

// Transpile each source file individually (no bundling) so dist mirrors src.
const options = {
    entryPoints: ["src/**/*.js"],
    outbase: "src",
    outdir: "dist",
    format: "esm",
    sourcemap: true,
    jsx: "transform",
    loader: { ".js": "jsx" },
    logLevel: "info",
};

// CSS modules are copied as-is for the consumer's bundler to process. esbuild's
// copy loader renames *.module.css, so this is done outside of esbuild.
const copyCss = () => cp("src", "dist", {
    recursive: true,
    filter: (src) => !src.endsWith(".js"),
});

if (process.argv.includes("--watch")) {
    const ctx = await esbuild.context(options);
    await copyCss();
    await ctx.watch();
    for await (const { filename } of watch("src", { recursive: true })) {
        if (filename?.endsWith(".css")) await copyCss();
    }
} else {
    await Promise.all([esbuild.build(options), copyCss()]);
}
