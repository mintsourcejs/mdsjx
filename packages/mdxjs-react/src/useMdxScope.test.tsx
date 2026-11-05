// @vitest-environment happy-dom
import { cleanup, renderHook } from "@testing-library/react";
import React, { type ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";
import type { MdxScope } from "./MdxScopeContext.js";
import { MdxScopeProvider } from "./MdxScopeProvider.js";
import { useMdxScope, type ScopeMapping } from "./useMdxScope.js";

afterEach(cleanup);

function withScope(value: MdxScope) {
    return function Wrapper({ children }: { children: ReactNode }) {
        return <MdxScopeProvider value={value}>{children}</MdxScopeProvider>;
    };
}

describe("useMdxScope should", () => {
    it("resolve each local name to its value in the provider's scope", () => {
        const Button = () => null;
        const { result } = renderHook(() => useMdxScope({ Button: "m_Button", answer: "m_answer" }), {
            wrapper: withScope({ m_Button: Button, m_answer: 42, m_unused: "x" }),
        });

        expect(result.current).toEqual({ Button, answer: 42 });
    });

    it.each([undefined, null])("return an empty scope when the mapping is %s", (mapping) => {
        const { result } = renderHook(() => useMdxScope(mapping), { wrapper: withScope({ m_Button: "x" }) });

        expect(result.current).toEqual({});
    });

    it("resolve to undefined, rather than throw, outside of a provider", () => {
        const { result } = renderHook(() => useMdxScope({ Button: "m_Button" }));

        expect(result.current).toEqual({ Button: undefined });
    });

    it("return the same scope across renders while its inputs are unchanged", () => {
        const mapping: ScopeMapping = { Button: "m_Button" };
        const { result, rerender } = renderHook(() => useMdxScope(mapping), { wrapper: withScope({ m_Button: "x" }) });
        const first = result.current;

        rerender();

        expect(result.current).toBe(first);
    });
});
