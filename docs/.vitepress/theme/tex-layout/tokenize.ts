import { Token } from "./types";

const CJK_REGEX =
    /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\u3000-\u303F\uFF00-\uFFEF]/;

function isCjkChar(ch: string): boolean {
    return CJK_REGEX.test(ch);
}

function isCollapsibleSpace(ch: string): boolean {
    return ch === " " || ch === "\n" || ch === "\t" || ch === "\r" || ch === "\f";
}

function isSpaceToken(t: Token): boolean {
    return t.isGlue && t.text === " ";
}

export function buildTokens(
    container: HTMLElement,
    font: string
): Token[] {

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.font = font;

    const children = Array.from(container.childNodes);
    const style = getComputedStyle(container);

    const letterSpacing = parseFloat(style.letterSpacing) || 0;
    const wordSpacing = parseFloat(style.wordSpacing) || 0;

    const countSpaces = (text: string) => {
        let count = 0;
        for (const ch of text) {
            if (ch === " ") count++;
        }
        return count;
    };

    const measureText = (text: string) => {
        if (text.length === 0) return 0;
        let width = ctx.measureText(text).width;
        if (letterSpacing && text.length > 1)
            width += letterSpacing * (text.length - 1);
        if (wordSpacing)
            width += wordSpacing * countSpaces(text);
        return width;
    };

    const spaceWidth = measureText(" ");

    const tokens: Token[] = [];

    const measureElement = (el: HTMLElement): number => {
        const clone = el.cloneNode(true) as HTMLElement;
        clone.style.position = "absolute";
        clone.style.visibility = "hidden";
        clone.style.whiteSpace = "nowrap";
        clone.style.left = "-99999px";
        clone.style.top = "0";
        clone.style.pointerEvents = "none";
        container.appendChild(clone);
        const rect = clone.getBoundingClientRect();
        const cloneStyle = getComputedStyle(clone);
        const marginLeft = parseFloat(cloneStyle.marginLeft) || 0;
        const marginRight = parseFloat(cloneStyle.marginRight) || 0;
        clone.remove();
        return rect.width + marginLeft + marginRight;
    };

    const pushSpace = () => {
        const prev = tokens[tokens.length - 1];
        if (!prev) return;
        if (prev.isGlue && prev.text === " ") return;
        tokens.push({
            node: null,
            text: " ",
            width: spaceWidth,
            isGlue: true,
            stretch: 1,
            unbreakable: false
        });
    };

    for (const child of children) {

        // MathJax 盒子
        if (
            child.nodeType === Node.ELEMENT_NODE &&
            (child as HTMLElement).tagName === "MJX-CONTAINER"
        ) {
            const el = child as HTMLElement;

            tokens.push({
                node: el,
                text: "",
                width: measureElement(el),
                isGlue: false,
                stretch: 0,
                unbreakable: true
            });
            continue;
        }

        // 其他 inline 元素
        if (child.nodeType === Node.ELEMENT_NODE) {
            const el = child as HTMLElement;

            tokens.push({
                node: el,
                text: "",
                width: measureElement(el),
                isGlue: false,
                stretch: 0,
                unbreakable: true
            });
            continue;
        }

        // 文本节点
        if (child.nodeType === Node.TEXT_NODE) {

            const text = child.nodeValue || "";
            const chars = Array.from(text);

            for (let i = 0; i < chars.length; i++) {

                const ch = chars[i];

                // 折叠空白
                if (isCollapsibleSpace(ch)) {
                    while (i + 1 < chars.length &&
                        isCollapsibleSpace(chars[i + 1])) {
                        i++;
                    }
                    pushSpace();
                    continue;
                }

                // CJK
                if (isCjkChar(ch)) {

                    tokens.push({
                        node: null,
                        text: ch,
                        width: measureText(ch),
                        isGlue: false,
                        stretch: 0,
                        unbreakable: false
                    });

                    // 插入弱 glue
                    tokens.push({
                        node: null,
                        text: "",
                        width: 0,
                        isGlue: true,
                        stretch: 0.2,
                        unbreakable: false
                    });

                    continue;
                }

                // 普通字符
                tokens.push({
                    node: null,
                    text: ch,
                    width: measureText(ch),
                    isGlue: false,
                    stretch: 0,
                    unbreakable: false
                });
            }
        }
    }

    // 去掉首尾空白 glue
    while (tokens.length &&
        tokens[0].isGlue &&
        tokens[0].text === " ") {
        tokens.shift();
    }
    while (tokens.length &&
        tokens[tokens.length - 1].isGlue &&
        tokens[tokens.length - 1].text === " ") {
        tokens.pop();
    }

    // 去掉紧邻空格的 CJK glue（避免双重间距）
    for (let i = 1; i < tokens.length; i++) {
        if (isSpaceToken(tokens[i])) {
            const prev = tokens[i - 1];
            if (prev.isGlue && prev.text === "") {
                tokens.splice(i - 1, 1);
                i--;
            }
        }
    }

    // 调整中西文之间的空格（减少拉伸）
    const findPrevNonGlue = (idx: number) => {
        for (let i = idx - 1; i >= 0; i--) {
            if (!tokens[i].isGlue) return tokens[i];
        }
        return null;
    };
    const findNextNonGlue = (idx: number) => {
        for (let i = idx + 1; i < tokens.length; i++) {
            if (!tokens[i].isGlue) return tokens[i];
        }
        return null;
    };
    const isCjkToken = (t: Token) =>
        t.node === null &&
        t.text.length === 1 &&
        isCjkChar(t.text);

    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (!isSpaceToken(t)) continue;

        const prev = findPrevNonGlue(i);
        const next = findNextNonGlue(i);

        if (!prev || !next) continue;

        const prevIsCjk = isCjkToken(prev);
        const nextIsCjk = isCjkToken(next);

        if (prevIsCjk !== nextIsCjk) {
            t.width = spaceWidth * 0.5;
            t.stretch = 0.2;
        }
    }

    return tokens;
}
