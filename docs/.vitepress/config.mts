// .vitepress/config.mts
import { defineConfig } from "vitepress";
import { nav } from "./configs/nav.mts";
import { sidebar } from "./configs/sidebar.mts";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import { mathEnvPlugin } from "./plugins/math-envs";
import markdownItContainer from "markdown-it-container";
// import { headingNumberingPlugin } from "./plugins/heading-numbering";

export default defineConfig({
    title: "Perxenic Acid 的数学笔记",
    base: "/MathNotesBasingVitepress/",
    description: "Perxenic Acid 的数学笔记",
    ignoreDeadLinks: true,
    themeConfig: {
        nav,
        sidebar,
        socialLinks: [
            { icon: "github", link: "https://github.com/vuejs/vitepress" },
        ],
        search: {
            provider: "local",
        },
    },

    markdown: {
        math: true,
        config: (md) => {
            md.use(tabsMarkdownPlugin);
            md.use(markdownItContainer, "definition");
            md.use(markdownItContainer, "theorem");
            md.use(markdownItContainer, "lemma");
            md.use(markdownItContainer, "proof");
            md.use(markdownItContainer, "axiom");

            md.use(mathEnvPlugin); // transform container → Vue
            // md.use(headingNumberingPlugin); // modify headings
        },
        lineNumbers: true,
    },
});
