import { Line } from "./types";

export function renderLines(
    container: HTMLElement,
    lines: Line[],
    lineWidth: number
) {

    const originalNodes = Array.from(container.childNodes);

    container.innerHTML = "";
    container.style.display = "block";
    const computedAlign = getComputedStyle(container).textAlign;
    const align = computedAlign === "justify" ? "left" : computedAlign;
    container.style.textAlign = align;

    lines.forEach((line, idx) => {

        const div = document.createElement("div");
        div.style.display = "block";
        div.style.whiteSpace = "nowrap";
        div.style.boxSizing = "border-box";
        div.style.width = lineWidth + "px";
        div.style.textAlign = align;

        const isLast = idx === lines.length - 1;

        const glues = line.tokens.filter(t => t.isGlue);
        const totalStretch =
            glues.reduce((s, t) => s + t.stretch, 0);

        const extra =
            isLast || totalStretch === 0
                ? 0
                : (lineWidth - line.totalWidth) / totalStretch;

        for (const t of line.tokens) {

            if (t.node) {
                div.appendChild(t.node.cloneNode(true));
                continue;
            }

            const span = document.createElement("span");

            if (t.text)
                span.textContent = t.text;

            if (t.isGlue) {
                span.style.display = "inline-block";
                span.style.width =
                    t.width + t.stretch * extra + "px";
            }

            div.appendChild(span);
        }

        container.appendChild(div);
    });
}
