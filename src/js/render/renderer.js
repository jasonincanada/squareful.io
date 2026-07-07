import { colorForSize } from "./colors.js";

const SVG = "http://www.w3.org/2000/svg";

export class BoardRenderer {
    static BoardSize = 36;

    constructor(svg) {
        this.svg = svg;
    }

    render(board, previewSquare = null) {
        this.svg.replaceChildren();

        for (const [index, square] of board.squares.entries()) {
            if (!square.visible)
                continue;

            const group = document.createElementNS(SVG, "g");
            group.dataset.squareIndex = index;
            group.style.cursor = "pointer";

            const rect = document.createElementNS(SVG, "rect");
            rect.setAttribute("x", square.col);
            rect.setAttribute("y", square.row);
            rect.setAttribute("width", square.size);
            rect.setAttribute("height", square.size);
            rect.setAttribute("fill", colorForSize(square.size));
            rect.setAttribute("stroke", "black");
            rect.setAttribute("stroke-width", "0.05");

            const text = document.createElementNS(SVG, "text");
            text.textContent = square.size;

            text.setAttribute("x", square.col + square.size / 2);
            text.setAttribute("y", square.row + square.size / 2);

            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dominant-baseline", "central");

            text.setAttribute("font-size", 0.8);
            text.setAttribute("font-family", "sans-serif");
            text.setAttribute("pointer-events", "none");

            group.append(rect, text);
            this.svg.appendChild(group);
        }

        if (previewSquare)
            this.renderPreviewSquare(previewSquare);
    }

    renderPreviewSquare(square) {
        const group = document.createElementNS(SVG, "g");
        group.setAttribute("pointer-events", "none");

        const rect = document.createElementNS(SVG, "rect");
        rect.setAttribute("x", square.col);
        rect.setAttribute("y", square.row);
        rect.setAttribute("width", square.size);
        rect.setAttribute("height", square.size);
        rect.setAttribute("fill", colorForSize(square.size));
        rect.setAttribute("fill-opacity", "0.45");
        rect.setAttribute("stroke", "white");
        rect.setAttribute("stroke-width", "0.12");
        rect.setAttribute("stroke-dasharray", "0.35 0.2");

        const text = document.createElementNS(SVG, "text");
        text.textContent = square.size;
        text.setAttribute("x", square.col + square.size / 2);
        text.setAttribute("y", square.row + square.size / 2);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "central");
        text.setAttribute("font-size", 0.8);
        text.setAttribute("font-family", "sans-serif");
        text.setAttribute("fill", "white");

        group.append(rect, text);
        this.svg.appendChild(group);
    }
}
