// .vitepress/configs/sidebar.mts
import { DefaultTheme } from "vitepress";

export const sidebar: DefaultTheme.Sidebar = {
    "/documents/set_theory/": [
        {
            text: "朴素集合论",
            link: "/documents/set_theory/朴素集合论",
            items: [
                { 
                    text: "集合的基本概念", 
                    link: "/documents/set_theory/集合的基本概念" 
                },
            ]
        }
    ],
    
    "/documents/group_theory/": [
        {
            text: "群论基础",
            items: [
                { text: "群的基本定义", link: "/documents/group_theory/群的基本定义" },
                // 后续可以添加更多群论相关页面
            ]
        }
    ],
};