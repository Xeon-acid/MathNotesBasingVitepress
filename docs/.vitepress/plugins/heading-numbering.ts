// heading-numbering.ts
import type MarkdownIt from "markdown-it";

export function headingNumberingPlugin(md: MarkdownIt) {
    md.core.ruler.push("heading-numbering", (state) => {
        const counters = [0, 0, 0, 0, 0, 0];

        for (let i = 0; i < state.tokens.length; i++) {
            const token = state.tokens[i];
            if (token.type !== "heading_open") continue;

            const level = Number(token.tag.slice(1));
            counters[level - 1]++;
            for (let j = level; j < 6; j++) counters[j] = 0;

            const number = counters.slice(0, level).join(".");

            const inline = state.tokens[i + 1];
            if (!inline || inline.type !== "inline") continue;

            inline.content = `${number} ${inline.content}`;
        }
    });
}
