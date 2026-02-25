import type MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token";

const ENV_MAP: Record<string, string> = {
    definition: "Definition",
    theorem: "Theorem",
    lemma: "Lemma",
    proof: "Proof",
};

export function mathEnvPlugin(md: MarkdownIt) {
    md.core.ruler.push("math-env-transform", (state) => {
        const tokens = state.tokens;
        const stack: { env: string; title?: string; openIndex: number }[] = [];

        for (let i = 0; i < tokens.length; i++) {
            const t = tokens[i];

            if (t.type === "container_open") {
                const match = t.info.match(/^(\w+)(?:\[(.+?)\])?$/);
                if (!match) continue;

                const env = match[1].toLowerCase();
                if (!(env in ENV_MAP)) continue;

                stack.push({
                    env,
                    title: match[2],
                    openIndex: i,
                });

                // replace container_open with Vue component open
                t.type = "html_block";
                t.content = `<${ENV_MAP[env]}${match[2] ? ` title="${match[2]}"` : ""}>\n`;
            }

            if (t.type === "container_close" && stack.length) {
                const last = stack.pop()!;
                t.type = "html_block";
                t.content = `</${ENV_MAP[last.env]}>\n`;
            }
        }
    });
}
