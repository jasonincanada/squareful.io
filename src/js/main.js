import { PuzzleRepository } from "./io/repository.js";
import { BoardRenderer } from "./render/renderer.js";
import { Game } from "./game.js";

const title = document.getElementById("board-title");
const svg = document.getElementById("board");
const firstButton = document.getElementById("first-board");
const nextButton = document.getElementById("next-board");
const previousButton = document.getElementById("previous-board");
const lastButton = document.getElementById("last-board");
const getPuzzleUrlButton = document.getElementById("get-puzzle-url");

const repo = new PuzzleRepository();
const game = new Game(repo);
const renderer = new BoardRenderer(svg);
const puzzleHashPrefix = "#p=";

function parseBase36BigInt(text) {
    let value = 0n;

    for (const ch of text.toLowerCase()) {
        const digit = Number.parseInt(ch, 36);
        if (Number.isNaN(digit))
            return null;

        value = value * 36n + BigInt(digit);
    }

    return value;
}

function parsePuzzleHash(hash) {
    if (!hash.startsWith(puzzleHashPrefix))
        return null;

    const [boardIdText, hiddenMaskText = "0"] = hash
        .slice(puzzleHashPrefix.length)
        .split(".");

    const boardId = Number.parseInt(boardIdText, 36);
    const hiddenMask = parseBase36BigInt(hiddenMaskText);

    if (!Number.isInteger(boardId) || boardId < 1 || boardId > 18656 || hiddenMask === null)
        return null;

    return { boardId, hiddenMask };
}

function puzzleUrl() {
    const url = new URL(window.location.href);
    const boardIdText = game.boardId.toString(36);
    const hiddenMaskText = game.board.hiddenSquareMask().toString(36);

    url.hash = `${puzzleHashPrefix}${boardIdText}.${hiddenMaskText}`;
    return url.toString();
}

async function renderCurrentBoard() {
    title.textContent = `Board #${game.boardId}`;
    renderer.render(game.board);

    previousButton.disabled = game.boardId <= 1;
    nextButton.disabled     = game.boardId >= 18656;
}

async function loadPuzzle(boardId, hiddenMask = 0n) {
    await game.loadBoard(boardId);
    game.board.hideSquaresFromMask(hiddenMask);
    renderCurrentBoard();
}

firstButton.addEventListener("click", async () => {
    await loadPuzzle(1);
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
    await loadPuzzle(18656);
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

getPuzzleUrlButton.addEventListener("click", async () => {
    const url = puzzleUrl();

    if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(url);

            getPuzzleUrlButton.textContent = "Copied!";
            setTimeout(() => {
                getPuzzleUrlButton.textContent = "Get puzzle URL";
            }, 1200);

            return;
        }
        catch {
            // Fall back to a prompt below when clipboard access is blocked.
        }
    }

    window.prompt("Puzzle URL", url);
});

const initialPuzzle = parsePuzzleHash(window.location.hash);
await loadPuzzle(initialPuzzle?.boardId ?? 1, initialPuzzle?.hiddenMask ?? 0n);
