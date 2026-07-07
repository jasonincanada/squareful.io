import { PuzzleRepository } from "./io/repository.js";
import { BoardRenderer } from "./render/renderer.js";
import { Game } from "./game.js";

const title = document.getElementById("board-title");
const svg = document.getElementById("board");
const firstButton = document.getElementById("first-board");
const nextButton = document.getElementById("next-board");
const previousButton = document.getElementById("previous-board");
const lastButton = document.getElementById("last-board");
const boardNumberInput = document.getElementById("board-number");
const selectBoardButton = document.getElementById("select-board");
const randomPuzzleButton = document.getElementById("random-puzzle");
const getPuzzleUrlButton = document.getElementById("get-puzzle-url");
const helpButton = document.getElementById("help-button");
const helpDialog = document.getElementById("help-dialog");

const repo = new PuzzleRepository();
const game = new Game(repo);
const renderer = new BoardRenderer(svg);
const boardCount = 18656;
const puzzleHashPrefix = "#p=";
const minPreviewSize = 1;
const maxPreviewSize = 8;
const randomPuzzleExtraSquareCount = 4;

let previewSize = 1;
let previewSquare = null;

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

    if (!Number.isInteger(boardId) || boardId < 1 || boardId > boardCount || hiddenMask === null)
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

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function boardPointFromEvent(event) {
    const bounds = svg.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width * BoardRenderer.BoardSize;
    const y = (event.clientY - bounds.top) / bounds.height * BoardRenderer.BoardSize;

    return { x, y };
}

function previewSquareFromEvent(event) {
    if (!game.board.hasHiddenSquares())
        return null;

    const point = boardPointFromEvent(event);
    const size = previewSize;
    const col = clamp(Math.floor(point.x), 0, BoardRenderer.BoardSize - size);
    const row = clamp(Math.floor(point.y), 0, BoardRenderer.BoardSize - size);

    return { row, col, size };
}

function updatePreviewSquare(event) {
    previewSquare = previewSquareFromEvent(event);
    renderCurrentBoard();
}

async function renderCurrentBoard() {
    title.textContent = `Board #${game.boardId}`;

    if (previewSquare && !game.board.hasHiddenSquares())
        previewSquare = null;

    renderer.render(game.board, previewSquare);

    previousButton.disabled = game.boardId <= 1;
    nextButton.disabled     = game.boardId >= boardCount;
    boardNumberInput.value = game.boardId;
}

async function loadPuzzle(boardId, hiddenMask = 0n) {
    await game.loadBoard(boardId);
    game.board.hideSquaresFromMask(hiddenMask);
    previewSquare = null;
    renderCurrentBoard();
}

async function loadRandomPuzzle() {
    const boardId = Math.floor(Math.random() * boardCount) + 1;

    await game.loadBoard(boardId);
    game.board.hideRandomPuzzle(randomPuzzleExtraSquareCount);
    previewSquare = null;
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
    await loadPuzzle(boardCount);
});

selectBoardButton.addEventListener("click", async () => {
    const boardId = Number.parseInt(boardNumberInput.value, 10);

    if (!Number.isInteger(boardId) || boardId < 1 || boardId > boardCount) {
        boardNumberInput.value = game.boardId;
        return;
    }

    await loadPuzzle(boardId);
});

boardNumberInput.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter")
        return;

    event.preventDefault();
    selectBoardButton.click();
});

randomPuzzleButton.addEventListener("click", async () => {
    await loadRandomPuzzle();
});

svg.addEventListener("click", (event) => {
    if (event.button !== 0)
        return;

    const squareGroup = event.target.closest("g[data-square-index]");
    if (squareGroup) {
        game.board.hideSquareAt(Number(squareGroup.dataset.squareIndex));
        updatePreviewSquare(event);
        return;
    }

    if (previewSquare)
        game.board.showSquareAt(previewSquare.row, previewSquare.col, previewSquare.size);

    renderCurrentBoard();
});

svg.addEventListener("mousemove", (event) => {
    updatePreviewSquare(event);
});

svg.addEventListener("mouseleave", () => {
    previewSquare = null;
    renderCurrentBoard();
});

svg.addEventListener("wheel", (event) => {
    if (!game.board.hasHiddenSquares())
        return;

    event.preventDefault();

    const direction = event.deltaY < 0 ? 1 : -1;
    previewSize = clamp(previewSize + direction, minPreviewSize, maxPreviewSize);
    updatePreviewSquare(event);
}, { passive: false });

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

helpButton.addEventListener("click", () => {
    helpDialog.showModal();
});

helpDialog.addEventListener("click", (event) => {
    if (event.target === helpDialog)
        helpDialog.close();
});

const initialPuzzle = parsePuzzleHash(window.location.hash);
await loadPuzzle(initialPuzzle?.boardId ?? 1, initialPuzzle?.hiddenMask ?? 0n);
