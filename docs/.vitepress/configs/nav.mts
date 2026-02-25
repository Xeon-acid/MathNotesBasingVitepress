import type { DefaultTheme } from 'vitepress';

export const nav: DefaultTheme.NavItem[] = [
    { text: '首页', link: '/' },
    {
        text: '集合论与逻辑',
        items: [
            { text: '朴素集合论', link: '/documents/set_theory/朴素集合论' },
            { text: '集合的定义与表示', link: '/documents/set_theory/朴素集合论#集合的定义与表示' },
        ]
    },
    { 
        text: '群论', 
        items: [
            { text: '群论基础', link: '/documents/group_theory/群的基本定义' },
        ],
        activeMatch: '/group_theory/'
    },
];