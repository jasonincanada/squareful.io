import { PuzzleRepository } from "./io/repository.js";
import { BoardRenderer } from "./render/renderer.js";
import { Game } from "./game.js";

const title = document.getElementById("board-title");
const svg = document.getElementById("board");
const firstButton = document.getElementById("first-board");
const nextButton = document.getElementById("next-board");
const previousButton = document.getElementById("previous-board");
const lastButton = document.getElementById("last-board");

const repo = new PuzzleRepository();
const game = new Game(repo);
const renderer = new BoardRenderer(svg);

async function renderCurrentBoard() {
    title.textContent = `Board #${game.boardId}`;
    renderer.render(game.board);

    previousButton.disabled = game.boardId <= 1;
    nextButton.disabled     = game.boardId >= 18656;
}

async function loadAndRender(boardId) {
    await game.loadBoard(boardId);
    renderCurrentBoard();
}

firstButton.addEventListener("click", async () => {
    await loadAndRender(1);
});

previousButton.addEventListener("click", async () => {
    await game.previousBoard();
    renderCurrentBoard();
});

nextButton.addEventListener("click", async () => {
    await game.nextBoard();
    renderCurrentBoard();
});

lastButton.addEventListener("click", async () => {
    await loadAndRender(18656);
});

svg.addEventListener("click", (event) => {
    if (event.button !== 0)
        return;

    const squareGroup = event.target.closest("g[data-square-index]");
    if (!squareGroup)
        return;

    game.board.hideSquareAt(Number(squareGroup.dataset.squareIndex));
    renderCurrentBoard();
});

await loadAndRender(1);
