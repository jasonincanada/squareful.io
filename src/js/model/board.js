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

    hideRandomPuzzle(extraSquareCount, random = Math.random) {
        const oneSquare = this.squares.find(square => square.size === 1);
        if (!oneSquare)
            return;

        const hiddenSquares = new Set(
            this.squares.filter(square => square === oneSquare || this.isNextTo(square, oneSquare))
        );

        for (let i = 0; i < extraSquareCount; i++) {
            const connectedSquares = this.squares.filter(square =>
                !hiddenSquares.has(square) &&
                [...hiddenSquares].some(hiddenSquare => this.isNextTo(square, hiddenSquare)));

            if (connectedSquares.length === 0)
                break;

            const square = connectedSquares[Math.floor(random() * connectedSquares.length)];
            hiddenSquares.add(square);
        }

        for (const square of hiddenSquares)
            square.visible = false;
    }

    isNextTo(square, other) {
        if (square === other)
            return false;

        const squareRight = square.col + square.size;
        const squareBottom = square.row + square.size;
        const otherRight = other.col + other.size;
        const otherBottom = other.row + other.size;

        return square.col < otherRight + 1 &&
            squareRight > other.col - 1 &&
            square.row < otherBottom + 1 &&
            squareBottom > other.row - 1;
    }

    showSquareAt(row, col, size) {
        const square = this.squares.find(s =>
            !s.visible &&
            s.row === row &&
            s.col === col &&
            s.size === size);

        if (!square)
            return false;

        square.visible = true;
        return true;
    }

    hasHiddenSquares() {
        return this.squares.some(square => !square.visible);
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
