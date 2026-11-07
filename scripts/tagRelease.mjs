// Creates a `<name>@<version>` git tag for each published package that doesn't have one yet, matching the
// tags lerna used to create. Versions that aren't live on npm yet, such as staged ones awaiting approval, are
// skipped. Run after publishing or approving a release, then push with `git push --follow-tags`.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";

const packagesDir = new URL("../packages/", import.meta.url);
const existingTags = new Set(execFileSync("git", ["tag"], { encoding: "utf8" }).split("\n"));

for (const dir of readdirSync(packagesDir)) {
    const { name, version, private: isPrivate } = JSON.parse(readFileSync(new URL(`${dir}/package.json`, packagesDir)));
    const tag = `${name}@${version}`;

    if (isPrivate || existingTags.has(tag)) {
        continue;
    }

    const { ok } = await fetch(`https://registry.npmjs.org/${name}/${version}`);

    if (ok) {
        execFileSync("git", ["tag", "-a", tag, "-m", tag]);
        console.log(`tagged ${tag}`);
    }
}
