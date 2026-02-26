export interface Token {
    node: Node | null;   // 原始节点（null 表示字符）
    text: string;        // 文本内容
    width: number;
    isGlue: boolean;
    stretch: number;
    unbreakable: boolean;
}

export interface Line {
    tokens: Token[];
    totalWidth: number;
}