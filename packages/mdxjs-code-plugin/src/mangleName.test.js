import { mangleName } from "./mangleName.js";

describe("mangleName should", () => {
    it("escape invalid chars", () => {
        expect(mangleName("Button", "@mintsourcejs/mdxjs-react")).toBe("_Button_$64$mintsourcejs$47$mdxjs$45$react");
        expect(mangleName("Button", "@mintsourcejs/mdxjs-react/Button")).toBe("_Button_$64$mintsourcejs$47$mdxjs$45$react$47$Button");
    });
});