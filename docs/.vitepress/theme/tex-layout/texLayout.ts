/* TeX-like paragraph layout with CJK glue (no visible characters) */

export interface Token {
    text: string;
    width: number;
    isGlue: boolean;
    stretch: number;
}

export interface Line {
    tokens: Token[];
    totalWidth: number;
}

/**
 * 将文本拆分为字符与胶水标记的混合数组
 * - 普通字符保持原样
 * - 每个 CJK 字符后插入一个胶水对象（零宽度，stretch = 0.3）
 * - 英文空格本身就是字符，将在 measureTokens 中被标记为胶水
 */
export function tokenize(
    text: string,
): (string | { type: "glue"; stretch: number })[] {
    const out: (string | { type: "glue"; stretch: number })[] = [];
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        out.push(ch);
        // 在每个 CJK 字符后插入一个零宽度胶水
        if (/[\u4E00-\u9FFF]/.test(ch)) {
            out.push({ type: "glue", stretch: 0.3 });
        }
    }
    return out;
}

/**
 * 测量每个 token 的宽度和胶水属性
 * - 字符 token 用 Canvas 测量宽度，空格同时标记为胶水
 * - 胶水对象宽度为 0，并保留其 stretch 值
 */
export function measureTokens(
    tokens: (string | { type: "glue"; stretch: number })[],
    font: string,
): Token[] {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.font = font;

    return tokens.map((t) => {
        if (typeof t === "string") {
            // 普通字符（包括空格）
            return {
                text: t,
                width: ctx.measureText(t).width,
                isGlue: t === " ", // 只有空格是字符型胶水
                stretch: t === " " ? 1.0 : 0,
            };
        } else {
            // 插入的零宽度胶水
            return {
                text: "", // 无内容，不会污染复制
                width: 0,
                isGlue: true,
                stretch: t.stretch,
            };
        }
    });
}

/**
 * Knuth–Plass 动态规划换行（考虑单词边界和标点禁则）
 */
export function texLineBreak(tokens: Token[], lineWidth: number): Line[] {
    const n = tokens.length;
    const dp = new Array(n + 1).fill(Infinity);
    const prev = new Array(n + 1).fill(-1);
    dp[0] = 0;

    // 定义标点禁则集合
    const prohibitedEnd = new Set([
        "(",
        "（",
        "[",
        "【",
        "{",
        "“",
        "‘", // 不能出现在行末
    ]);
    const prohibitedStart = new Set([
        ")",
        "）",
        "]",
        "】",
        "}",
        "”",
        "’",
        ",",
        "，",
        ".",
        "。",
        "!",
        "！",
        "?",
        "？",
        ";",
        "；",
        ":",
        "：",
    ]);

    // 辅助函数：判断是否可以在 token i 之后换行（基于单词边界）
    function canBreakAfter(i: number): boolean {
        // 只有 glue token 之后允许换行
        // i 是上一行最后一个 token 的索引
        // 如果 i 超出范围，返回 true
        if (i < 0 || i >= n) return true;
        return tokens[i].isGlue;
    }

    // 辅助函数：检查在 token i 之后换行是否符合标点禁则
    function checkPunctuationAfter(i: number): boolean {
        // i 是上一行最后一个 token 的索引
        // 需要检查：
        // 1. 上一行的最后一个 token（即 tokens[i]）不能是禁止出现在行末的标点
        // 2. 下一行的第一个 token（即 tokens[i+1]）不能是禁止出现在行首的标点
        if (i >= n - 1) return true; // 最后一行之后没有内容，忽略

        const lastToken = tokens[i];
        const nextToken = tokens[i + 1];

        // 检查行末标点：如果 lastToken 的文本是禁止在行末的标点，则不允许在此换行
        if (lastToken.text && prohibitedEnd.has(lastToken.text)) {
            return false;
        }

        // 检查行首标点：如果 nextToken 的文本是禁止在行首的标点，则不允许在此换行
        if (nextToken.text && prohibitedStart.has(nextToken.text)) {
            return false;
        }

        return true;
    }

    for (let i = 0; i < n; i++) {
        // i 是行的起始 token 索引
        let w = 0;
        let stretch = 0;

        for (let j = i; j < n; j++) {
            w += tokens[j].width;
            stretch += tokens[j].stretch;

            if (w > lineWidth) break;

            // 检查在 j 之后换行是否允许且符合标点禁则
            // 注意：如果 j 是最后一个 token，则后面没有内容，不需要检查（最后一行）
            if (j < n - 1 && (!canBreakAfter(j) || !checkPunctuationAfter(j))) {
                continue; // 不允许在此换行，跳过这个 j 作为行结束
            }

            const extra = lineWidth - w;
            const badness =
                stretch > 0 ? Math.pow(extra / stretch, 3) : Infinity;
            const cost = dp[i] + badness;

            if (cost < dp[j + 1]) {
                dp[j + 1] = cost;
                prev[j + 1] = i;
            }
        }
    }

    // 回溯构建 lines（与原来相同）
    const lines: Line[] = [];
    for (let i = n; i > 0; i = prev[i]) {
        const seg = tokens.slice(prev[i], i);
        const total = seg.reduce((s, t) => s + t.width, 0);
        lines.push({ tokens: seg, totalWidth: total });
    }

    return lines.reverse();
}

/**
 * 渲染段落，胶水用空 <span> 实现弹性间距
 */
export function renderTexParagraph(
    container: HTMLElement,
    text: string,
    font: string,
    lineWidth: number,
) {
    container.innerHTML = "";
    container.style.whiteSpace = "normal";

    const raw = tokenize(text);
    const tokens = measureTokens(raw, font);
    const lines = texLineBreak(tokens, lineWidth);

    lines.forEach((line, idx) => {
        const div = document.createElement("div");
        div.className = "tex-line";
        div.style.whiteSpace = "nowrap";

        const isLast = idx === lines.length - 1;
        const glues = line.tokens.filter((t) => t.isGlue);
        const totalStretch = glues.reduce((s, t) => s + t.stretch, 0);
        const extra =
            isLast || totalStretch === 0
                ? 0
                : (lineWidth - line.totalWidth) / totalStretch;

        for (const t of line.tokens) {
            const span = document.createElement("span");
            if (t.text) {
                span.textContent = t.text; // 字符（含空格）
            }
            if (t.isGlue) {
                span.style.display = "inline-block";
                span.style.width = t.width + t.stretch * extra + "px";
            }
            div.appendChild(span);
        }

        container.appendChild(div);
    });
}
