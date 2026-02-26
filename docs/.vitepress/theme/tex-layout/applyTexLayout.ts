import { buildTokens } from "./tokenize";
import { texLineBreak } from "./linebreak";
import { renderLines } from "./render";

async function waitForLayoutReady() {
    if (document.fonts?.ready) {
        await document.fonts.ready;
    }
    if (window.MathJax?.typesetPromise) {
        await window.MathJax.typesetPromise();
    }
    await new Promise(requestAnimationFrame);
}

function getContentWidth(el: HTMLElement): number {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const paddingLeft = parseFloat(style.paddingLeft) || 0;
    const paddingRight = parseFloat(style.paddingRight) || 0;
    const borderLeft = parseFloat(style.borderLeftWidth) || 0;
    const borderRight = parseFloat(style.borderRightWidth) || 0;
    return rect.width - paddingLeft - paddingRight - borderLeft - borderRight;
}

export async function applyTexLayout() {

    await waitForLayoutReady();

    const paragraphs = document.querySelectorAll(".VPDoc .vp-doc p");

    for (const p of paragraphs) {

        const el = p as HTMLElement;

        if (el.dataset.texified) continue;
        if (el.querySelector("mjx-container")) {
            // 允许包含数学，但不允许只含数学
        }

        const width = getContentWidth(el);
        if (width <= 0) continue;

        const font = getComputedStyle(el).font;

        const tokens = buildTokens(el, font);
        if (tokens.length < 20) continue;

        const lines = texLineBreak(tokens, width);

        renderLines(el, lines, width);

        el.dataset.texified = "true";
    }
}
