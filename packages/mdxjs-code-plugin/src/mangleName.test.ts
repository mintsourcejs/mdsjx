import { describe, expect, it } from "vitest";
import { mangleNamedIdentifier, mangleNamespaceIdentifier } from "./mangleName.js";

describe("mangleNamedIdentifier should", () => {
    it("escape invalid chars", () => {
        expect(mangleNamedIdentifier("Button", "@mintsourcejs/mdxjs-react")).toBe("_Button_$64$mintsourcejs$47$mdxjs$45$react");
        expect(mangleNamedIdentifier("Button", "@mintsourcejs/mdxjs-react/Button")).toBe("_Button_$64$mintsourcejs$47$mdxjs$45$react$47$Button");
    });

    it("escape invalid chars in string names", () => {
        expect(mangleNamedIdentifier("a-b", "m")).toBe("_a$45$b_m");
    });

    it("escape any char that isn't valid in an identifier", () => {
        expect(mangleNamedIdentifier("Button", "npm:m+n")).toBe("_Button_npm$58$m$43$n");
    });
});

describe("mangleNamespaceIdentifier should", () => {
    it("escape invalid chars", () => {
        expect(mangleNamespaceIdentifier("@mintsourcejs/mdxjs-react")).toBe("namespace_$64$mintsourcejs$47$mdxjs$45$react");
    });
});