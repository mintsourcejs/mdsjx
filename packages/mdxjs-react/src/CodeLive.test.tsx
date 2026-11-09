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
                <CodeLive code="<Button>click me</Button>" scopeMapping={{ Button: "m_Button" }} />
            </MdxScopeProvider>
        );

        expect(await preview(container).findByText("click me", { selector: "button.scoped" })).toBeTruthy();
    });

    it("support noInline code that calls render", async () => {
        const { container } = render(<CodeLive code={"const Greeting = () => <i>hi there</i>;\nrender(<Greeting />);"} noInline />);

        expect((await preview(container).findByText("hi there")).tagName).toBe("I");
    });

    it("show an error for code that doesn't compile", async () => {
        const { container } = render(<CodeLive code="<b>unclosed" />);

        await waitFor(() => expect(container.getElementsByClassName(styles.codeExample!)[0]?.querySelector("pre")?.textContent).toBeTruthy());
    });

    it("open the editor by default", () => {
        const { container } = render(<CodeLive code="<b>hello</b>" />);
        const editor = container.getElementsByClassName(styles.collapse!)[0]!;

        expect(editor.classList.contains(styles.open!)).toBe(true);
        expect(screen.getByRole("button", { name: "Code editor" }).getAttribute("aria-expanded")).toBe("true");
    });

    it("toggle the editor when the button is clicked", () => {
        const { container } = render(<CodeLive code="<b>hello</b>" openDefault={false} />);
        const editor = container.getElementsByClassName(styles.collapse!)[0]!;

        expect(editor.classList.contains(styles.open!)).toBe(false);
        fireEvent.click(screen.getByRole("button", { name: "Code editor" }));
        expect(editor.classList.contains(styles.open!)).toBe(true);
        fireEvent.click(screen.getByRole("button", { name: "Code editor" }));
        expect(editor.classList.contains(styles.open!)).toBe(false);
    });

    it("expose the editor's state on the toggle button", () => {
        render(<CodeLive code="<b>hello</b>" openDefault={false} />);
        const toggle = screen.getByRole("button", { name: "Code editor" });

        expect(toggle.getAttribute("type")).toBe("button");
        expect(toggle.getAttribute("aria-expanded")).toBe("false");
        fireEvent.click(toggle);
        expect(toggle.getAttribute("aria-expanded")).toBe("true");
    });

    it("leave the editor when Escape is pressed", () => {
        const { container } = render(<CodeLive code="<b>hello</b>" />);
        const editor = container.querySelector<HTMLElement>("pre[aria-label='Code editor']")!;

        editor.focus();
        expect(document.activeElement).toBe(editor);
        fireEvent.keyDown(editor, { key: "Escape" });
        expect(document.activeElement).not.toBe(editor);
    });

    it("size tabs by the indent", () => {
        const { container } = render(<CodeLive code="<b>hello</b>" indent={4} />);

        expect(container.querySelector<HTMLElement>("pre[aria-label='Code editor']")!.style.tabSize).toBe("4");
    });

    it("disable the reset button until the code is edited", () => {
        render(<CodeLive code="<b>hello</b>" />);

        expect((screen.getByRole("button", { name: "Reset" }) as HTMLButtonElement).disabled).toBe(true);
    });
});
