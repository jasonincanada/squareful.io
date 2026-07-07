import { Square } from "./square.js";

export class Board {
    static Size = 36;

    constructor(sequence) {
        if (sequence.length !== Board.Size)
            throw new Error(`Sequence must contain ${Board.Size} digits.`);

        this.squares = [];

        const levels = new Array(Board.Size).fill(0);

        for (const ch of sequence) {
            const size = Number(ch);
            const row = Math.min(...levels);
            const col = levels.indexOf(row);

            this.squares.push(new Square(row, col, size));

            for (let i = 0; i < size; i++)
                levels[col + i] += size;
        }
    }

    hideSquareAt(index) {
        this.squares[index].visible = false;
    }

    hideSquaresFromMask(mask) {
        for (const [index, square] of this.squares.entries())
            square.visible = (mask & (1n << BigInt(index))) === 0n;
    }

    hiddenSquareMask() {
        let mask = 0n;

        for (const [index, square] of this.squares.entries()) {
            if (!square.visible)
                mask |= 1n << BigInt(index);
        }

        return mask;
    }
}
