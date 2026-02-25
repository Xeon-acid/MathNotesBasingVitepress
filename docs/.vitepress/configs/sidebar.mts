// .vitepress/configs/sidebar.mts
import { DefaultTheme } from "vitepress";

export const sidebar: DefaultTheme.Sidebar = {
    // 为群论目录配置侧边栏
    "/group_theory/": [
        {
            text: "群论基础",
            items: [
                { text: "群的基本定义", link: "/group_theory/群的基本定义" },
            ]
        }
    ],
};