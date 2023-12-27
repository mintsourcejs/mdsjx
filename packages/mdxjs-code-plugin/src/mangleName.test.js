import { mangleNamedIdentifier } from "./mangleName.js";

describe("mangleNamedIdentifier should", () => {
    it("escape invalid chars", () => {
        expect(mangleNamedIdentifier("Button", "@mintsourcejs/mdxjs-react")).toBe("_Button_$64$mintsourcejs$47$mdxjs$45$react");
        expect(mangleNamedIdentifier("Button", "@mintsourcejs/mdxjs-react/Button")).toBe("_Button_$64$mintsourcejs$47$mdxjs$45$react$47$Button");
    });
});