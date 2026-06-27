import { Board } from "./model/board.js";

export class Game {
    constructor(repository) {
        this.repository = repository;

        this.boardId = 1;
        this.board = null;
    }

    async loadBoard(boardId) {
        this.boardId = boardId;

        const sequence = await this.repository.load(boardId);
        this.board = new Board(sequence);
    }

    async nextBoard() {
        if (this.boardId >= 18656)
            return;

        await this.loadBoard(this.boardId + 1);
    }

    async previousBoard() {
        if (this.boardId <= 1)
            return;

        await this.loadBoard(this.boardId - 1);
    }
}
