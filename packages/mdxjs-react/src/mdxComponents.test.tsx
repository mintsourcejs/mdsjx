import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Code } from "./Code.js";
import { mdxComponents } from "./mdxComponents.js";

import codeLiveStyles from "./CodeLive.module.css";

describe("mdxComponents headings should", () => {
    it.each(["h1", "h2", "h3", "h4", "h5", "h6"] as const)("render %s with an anchor link to its id", (tag) => {
        const Heading = mdxComponents[tag];
        const html = renderToStaticMarkup(<Heading id="getting-started">Getting started</Heading>);

        expect(html).toMatch(new RegExp(`^<${tag} id="getting-started"`));
        expect(html).toContain('href="#getting-started"');
        expect(html).toContain("Getting started");
    });

    it("render content that isn't plain text", () => {
        const html = renderToStaticMarkup(
            <mdxComponents.h2 id="using-codelive">Using <code>CodeLive</code> with <a href="/x">links</a></mdxComponents.h2>
        );

        expect(html).toContain("Using <code>CodeLive</code> with <a href=\"/x\">links</a>");
    });

    it("render without an anchor link when there is no id", () => {
        const html = renderToStaticMarkup(<mdxComponents.h1>Title</mdxComponents.h1>);

        expect(html).not.toContain("href");
        expect(html).toContain("Title");
    });
});

describe("Code should", () => {
    it("render a code block's text", () => {
        expect(renderToStaticMarkup(<Code>{"const a = 1;\n"}</Code>)).toBe("<code>const a = 1;</code>");
    });

    it("render the text of content that isn't plain text", () => {
        expect(renderToStaticMarkup(<Code>const <b>a</b> = {1};</Code>)).toBe("<code>const a = 1;</code>");
    });

    it("render an empty code element without children", () => {
        expect(renderToStaticMarkup(<Code />)).toBe("<code></code>");
    });

    it("syntax highlight code with a language", () => {
        const html = renderToStaticMarkup(<Code className="language-js">{"const a = 1;"}</Code>);

        expect(html).toMatch(/^<pre class="prism-code language-js"/);
        expect(html).toMatch(/<span class="token keyword"[^>]*>const<\/span>/);
    });

    it("render a live code block when the meta includes live", () => {
        const html = renderToStaticMarkup(
            <Code className="language-jsx" data-meta="live" data-scope={'{"Button":"m_Button"}'}>{"<b>hi</b>"}</Code>
        );

        expect(html).toMatch(new RegExp(`^<div class="${codeLiveStyles.codeLive}"`));
    });
});
