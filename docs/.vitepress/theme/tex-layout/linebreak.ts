import { Token, Line } from "./types";

export function texLineBreak(
    tokens: Token[],
    lineWidth: number
): Line[] {

    const n = tokens.length;

    const dp = new Array(n + 1).fill(Infinity);
    const prev = new Array(n + 1).fill(-1);

    dp[0] = 0;

    function canBreakAfter(j: number): boolean {
        if (j >= n - 1) return true;

        const t = tokens[j];

        // 不能在不可拆 token 内部断
        if (t.unbreakable) return false;

        return true;
    }

    const overfullPenalty = 1e9;

    for (let i = 0; i < n; i++) {

        if (dp[i] === Infinity) continue;

        let width = 0;
        let stretch = 0;
        let hasCandidate = false;

        for (let j = i; j < n; j++) {

            width += tokens[j].width;
            stretch += tokens[j].stretch;

            if (width > lineWidth) {
                // 无法找到合法断点时，强制生成一行，避免整段回退为单行
                if (!hasCandidate) {
                    const over = width - lineWidth;
                    const badness = overfullPenalty + over * over;
                    const cost = dp[i] + badness;
                    if (cost < dp[j + 1]) {
                        dp[j + 1] = cost;
                        prev[j + 1] = i;
                    }
                }
                break;
            }

            if (!canBreakAfter(j)) continue;

            const extra = lineWidth - width;

            let badness: number;

            if (stretch > 0) {
                badness = Math.pow(extra / stretch, 3);
            } else {
                if (extra === 0) {
                    badness = 0;
                } else {
                    badness = 1e6; // 允许断但极差
                }
            }

            const cost = dp[i] + badness;

            if (cost < dp[j + 1]) {
                dp[j + 1] = cost;
                prev[j + 1] = i;
            }

            hasCandidate = true;
        }
    }

    const lines: Line[] = [];

    let i = n;
    if (prev[i] === -1) {
        // fallback：强制单行
        return [{
            tokens,
            totalWidth: tokens.reduce((s, t) => s + t.width, 0)
        }];
    }

    while (i > 0) {
        const start = prev[i];
        const seg = tokens.slice(start, i);
        const total = seg.reduce((s, t) => s + t.width, 0);
        lines.push({ tokens: seg, totalWidth: total });
        i = start;
    }

    return lines.reverse();
}
