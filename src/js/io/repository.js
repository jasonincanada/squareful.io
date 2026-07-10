
// store this here so we don't have to wait for the fetch() call on the initial site load
const startingBoardSequence = "225777645468853638316485548886687777";

export class PuzzleRepository {
    boardFileFor(boardId) {
        const chunk = Math.floor((boardId - 1) / 100);
        return `boards/${chunk.toString().padStart(3, "0")}.txt`;
    }

    boardFileLineNumberFor(boardId) {
        return (boardId - 1) % 100;
    }

    async load(boardId) {
        if (boardId === 1)
            return startingBoardSequence;

        const fileName = this.boardFileFor(boardId);
        const lineNumber = this.boardFileLineNumberFor(boardId);

        const response = await fetch(fileName);

        if (!response.ok)
            throw new Error(`Could not load ${fileName}`);

        const text = await response.text();
        const lines = text.trim().split(/\r?\n/);

        return lines[lineNumber];
    }
}
