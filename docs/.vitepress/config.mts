// .vitepress/config.mts
import { defineConfig } from "vitepress";
import { nav } from "./configs/nav.mts";
import { sidebar } from "./configs/sidebar.mts";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import { mathEnvPlugin } from "./plugins/math-envs";
import markdownItContainer from 'markdown-it-container';

export default defineConfig({
    title: "Perxenic Acid 的数学笔记",
    description: "Perxenic Acid 的数学笔记",
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
        config: (md) => {
            md.use(tabsMarkdownPlugin);
            
            // 使用简化版本
            md.use(markdownItContainer, 'definition');
            md.use(markdownItContainer, 'theorem');
            md.use(markdownItContainer, 'lemma');
            md.use(markdownItContainer, 'proof');
            
            md.use(mathEnvPlugin);
        },
        math: true,
        lineNumbers: true,
    },
});