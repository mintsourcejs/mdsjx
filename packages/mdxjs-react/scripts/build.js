import { spawn } from "node:child_process";
import { cp, watch } from "node:fs/promises";
import { createRequire } from "node:module";

const watchMode = process.argv.includes("--watch");

// CSS modules are copied as-is for the consumer's bundler to process.
const copyCss = () => cp("src", "dist", {
    recursive: true,
    filter: (src) => !/\.tsx?$/.test(src),
});

const tscBin = createRequire(import.meta.url).resolve("typescript/bin/tsc");
const tscArgs = watchMode ? ["-b", "--watch", "--preserveWatchOutput"] : ["-b"];
const tsc = spawn(process.execPath, [tscBin, ...tscArgs], { stdio: "inherit" });

await copyCss();

if (watchMode) {
    for await (const { filename } of watch("src", { recursive: true })) {
        if (filename?.endsWith(".css")) await copyCss();
    }
} else {
    tsc.on("exit", (code) => process.exit(code ?? 1));
}
