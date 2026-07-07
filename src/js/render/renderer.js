import { colorForSize } from "./colors.js";

const SVG = "http://www.w3.org/2000/svg";

export class BoardRenderer {
    constructor(svg) {
        this.svg = svg;
    }

    render(board) {
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
    }
}
