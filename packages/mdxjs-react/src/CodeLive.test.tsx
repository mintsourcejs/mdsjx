// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import React, { type ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { CodeLive } from "./CodeLive.js";
import { MdxScopeProvider } from "./MdxScopeProvider.js";

import styles from "./CodeLive.module.css";

afterEach(cleanup);

/** the rendered output of the code, as opposed to the code shown in the editor. */
function preview(container: HTMLElement) {
    return within(container.getElementsByClassName(styles.codeExample!)[0] as HTMLElement);
}

const Button = ({ children }: { children?: ReactNode }) => <button className="scoped">{children}</button>;

describe("CodeLive should", () => {
    it("render a preview of the code", async () => {
        const { container } = render(<CodeLive code="<b>hello</b>" />);

        expect((await preview(container).findByText("hello")).tagName).toBe("B");
    });

    it("render components imported by the code from the document's scope", async () => {
        const { container } = render(
            <MdxScopeProvider value={{ m_Button: Button }}>
                <CodeLive code={'import { Button } from "./Button.js";\n\n<Button>click me</Button>'} scopeMapping={{ Button: "m_Button" }} />
            </MdxScopeProvider>
        );

        expect(await preview(container).findByText("click me", { selector: "button.scoped" })).toBeTruthy();
        expect(container.textContent).not.toContain("import");
    });

    it("support noInline code that calls render", async () => {
        const { container } = render(<CodeLive code={"const Greeting = () => <i>hi there</i>;\nrender(<Greeting />);"} noInline />);

        expect((await preview(container).findByText("hi there")).tagName).toBe("I");
    });

    it("show an error for code that doesn't compile", async () => {
        const { container } = render(<CodeLive code="<b>unclosed" />);

        await waitFor(() => expect(container.getElementsByClassName(styles.codeExample!)[0]?.querySelector("pre")?.textContent).toBeTruthy());
    });

    it("toggle the editor when the button is clicked", () => {
        const { container } = render(<CodeLive code="<b>hello</b>" />);
        const editor = container.getElementsByClassName(styles.collapse!)[0]!;

        expect(editor.classList.contains(styles.open!)).toBe(false);
        fireEvent.click(screen.getByRole("button"));
        expect(editor.classList.contains(styles.open!)).toBe(true);
        fireEvent.click(screen.getByRole("button"));
        expect(editor.classList.contains(styles.open!)).toBe(false);
    });
});
