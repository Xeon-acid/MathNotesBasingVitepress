// nav.mts
import type { DefaultTheme } from "vitepress";

export const nav: DefaultTheme.NavItem[] = [
    { text: "首页", link: "/" },
    { 
        text: "群论", 
        link: "/group_theory/群的基本定义",
        activeMatch: "/group_theory/"
    }
];