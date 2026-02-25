import { renderTexParagraph } from "./texLayout";

/* wait for fonts to load */
async function waitFonts() {
    if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
    }
}

export async function applyTexLayout() {
    await waitFonts();

    const paragraphs = document.querySelectorAll(".VPDoc p");

    paragraphs.forEach((p) => {
        const el = p as HTMLElement;
        if (el.dataset.texified) return;
        el.dataset.texified = "true";

        const text = el.textContent || "";
        if (text.length < 80) return; // avoid tiny paragraphs

        const width = el.clientWidth || 600;

        renderTexParagraph(el, text, "16px CMU Serif, Noto Serif SC", width);
    });
}

/* responsive */
let timer: any;
window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        document
            .querySelectorAll(".VPDoc p")
            .forEach((p) => delete (p as HTMLElement).dataset.texified);
        applyTexLayout();
    }, 200);
});
