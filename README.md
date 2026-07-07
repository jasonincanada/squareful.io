# squareful.io

Squareful is a square tiling puzzle.

A board is a 36 by 36 square tiled with **one 1x1 square**, **two 2x2 squares**, **three 3x3 squares**, and so on up to **eight 8x8 squares**. Some squares are hidden, leaving dark gaps on the board. The puzzle is to deduce which squares are missing and where they belong.

The old version of this project is here: https://github.com/jasonincanada/squareful

That one is built with Blazor, which I abandoned because it is overkill for this project. This version is written in plain JavaScript, with no framework or build step.

## Example Puzzles

The app can generate a random puzzle by choosing a board, hiding the 1x1 square, hiding the squares around it, and then growing that missing area into one larger connected gap.

You can also share specific puzzles by URL. For example:

* http://127.0.0.1:5500/#p=1.fxszk
* http://127.0.0.1:5500/#p=e0y.4tl5b75

The second example is based on the example puzzle from the old repo: https://github.com/jasonincanada/squareful#example

## Current Features

* Load puzzle boards from static text files.
* Render boards as SVG.
* Color squares according to their size.
* Navigate with First, Previous, Next, and Last board controls.
* Select a board directly by number.
* Generate a random puzzle with one connected missing region.
* Hide visible squares by left-clicking them.
* Preview a tentative square over hidden areas.
* Change the preview size with the mouse wheel.
* Place a hidden square by left-clicking the matching empty position.
* Encode the current board and hidden squares into a short shareable URL.
* Show in-app instructions from the Help button.

## How to Play

1. Choose a board with the navigation buttons, the board number field, or Random Puzzle.
2. Look at the dark gap and deduce which hidden squares belong there.
3. Move the mouse over the board to preview a tentative square.
4. Use the mouse wheel to change the tentative square size from 1 to 8.
5. Left-click the correct empty position to place the hidden square.
6. Use Get Puzzle URL to copy a shareable link for the current puzzle state.

You can also left-click any visible square to hide it and create your own puzzle.

## Running the Project

The project is a completely static web application. There is no server-side code or build step.

1. Open the `src` folder in Visual Studio Code.
2. Open `index.html`.
3. Click **Go Live** in the lower-right corner of VS Code.
4. Your browser will open automatically.
5. Any changes you save will automatically refresh the browser.

## Project Structure

```text
src/
|
|-- boards/        Puzzle data files
|-- css/           Stylesheets
|-- images/        Static images
|
|-- js/
|   |-- io/        Loading puzzle data
|   |-- model/     Board and Square domain model
|   |-- render/    SVG rendering
|   |-- game.js    Current game state
|   `-- main.js    Application entry point
|
`-- index.html
```

## Prerequisites

* Visual Studio Code
* Live Server extension by Ritwick Dey

## Architecture

The application is intentionally split into a few simple layers:

* **PuzzleRepository** loads board sequences from text files.
* **Game** owns the current board being viewed.
* **Board** and **Square** represent the puzzle model.
* **BoardRenderer** converts the model into SVG.
* `main.js` wires the UI, mouse interaction, URL encoding, and help dialog together.

## Planned Features

- [x] Puzzle editor
  - [x] Click squares to hide them
- [x] Tile placement tools
  - [x] Mouse-wheel square size selection
  - [x] Hover preview
  - [x] Click to place matching hidden squares
- [x] Random puzzle generator
  - [x] Hide the 1x1 square and surrounding squares
  - [x] Grow the missing area as one connected gap
- [x] URL encoding of complete puzzle state for easy sharing
- [x] In-app help dialog
- [ ] Click on a square to find all boards with that square there
