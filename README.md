# squareful.io

Squareful is a square tiling puzzle.

A board consists of a 36×36 square tiled with one 1×1 square, two 2×2 squares, three 3×3 squares, and so on up to eight 8×8 squares.  Some of them are removed, leaving blank areas on the board, and the puzzle is to deduce which squares are missing, and how to arrange them in the blank areas.

The old version of this project is here: https://github.com/jasonincanada/squareful

That one is built with Blazor which I've abandonded because it's overkill.  This project is written in plain JavaScript to the extent possible, no frameworks.

## Current Features

* Load puzzle boards from static text files
* Render boards as SVG
* Color squares according to their size
* Navigate between boards using **Previous Board** and **Next Board**

## Running the Project

The project is a completely static web application. There is no server-side code or build step.

1. Open the `src` folder in Visual Studio Code.
2. Open `index.html`.
3. Click **Go Live** in the lower-right corner of VS Code.
4. Your browser will open automatically.
5. Any changes you save will automatically refresh the browser.

## Project Structure

```
src/
│
├── boards/        Puzzle data files
├── css/           Stylesheets
├── images/        Static images
│
├── js/
│   ├── io/        Loading puzzle data
│   ├── model/     Board and Square domain model
│   ├── render/    SVG rendering
│   ├── game.js    Current game state
│   └── main.js    Application entry point
│
└── index.html
```

### Prerequisites

* Visual Studio Code

### Setup

Install the **Live Server** extension by **Ritwick Dey**.
## Architecture

The application is intentionally split into a few simple layers:

* **PuzzleRepository** loads board sequences from text files.
* **Game** owns the current board being viewed.
* **Board** and **Square** represent the puzzle model.
* **BoardRenderer** converts the model into SVG.
* `main.js` wires everything together.

## Planned Features

* Puzzle editor
    * Click squares to remove them
* Tile placement tools
    * Mouse-wheel square size selection
    * Hover preview
* URL encoding of complete puzzle state for easy sharing
