const SQUARE_ROWS = 10;
const SQUARE_COLS = 10;
const SQUARE_TOTAL = SQUARE_ROWS * SQUARE_COLS;

import { addClass, append, create, getNode as $, on, removeClass, text } from "../scripts/lib/dom/index.js";
import { each, loop } from "./lib/utils/index.js";

const CLASSES = {
  square: 'Square',
  snake: 'Snake',
  apple: 'Apple',
  grid: 'Grid'
}

const gridElement = $(`.${CLASSES.grid}`);
const startButtonElement = $(".Button--start");
const stopButtonElement = $(`.Button--stop`);
let squares = [];
let snake = [2, 1, 0];
let gameStopId;
let speed = 1000;
let isStarting = false;
let direction = 1;





function createSquare() {
  const square = create('div', { class: CLASSES.square })
  return square;
}

function drawSquares({ showGridNumbers = false } = {}) {
  loop((i) => {
    const square = createSquare();
    if (showGridNumbers) {
      text(square, i);
    }
    squares.push(square);
    append(gridElement, square);
  }, SQUARE_TOTAL);
}

function drawSnake() {
  each(snake, (index) => {
    addClass(squares[index], CLASSES.snake)
  });
}

function movingSnake() {
  let tailIndex = snake.pop();
  removeClass(squares[tailIndex], CLASSES.snake);
  // let headIndex = snake.unshift(snake[0] + 1);
  //! unshift가 반환하는건 length
  snake.unshift(snake[0] + direction);
  let headIndex = snake[0];
  addClass(squares[headIndex], CLASSES.snake)
}

function move() {
  if (isGameOver()) {
    return gameOver();
  }
  movingSnake();
  gameStopId = setTimeout(move, speed)
}

function isGameOver() {
  let headIndex = snake[0]
  // 벽의 위에 뱀 머리가 충돌
  // 벽의 아래에 뱀 머리가 충돌
  // 벽의 왼쪽에 뱀 머리가 충돌
  // 벽의 오른쪽에 뱀 머리가 충돌
  // 뱀의 몸통에 뱀 머리가 충돌
  switch (direction) {
    case -SQUARE_COLS:
      if (headIndex + direction < 0)
        return true;
      break;
    case SQUARE_COLS:
      if (headIndex + direction >= SQUARE_TOTAL)
        return true;
      break;
    case -1:
      if (headIndex % SQUARE_COLS === 0)
        return true;
      break;
    case 1:
      console.log(headIndex % SQUARE_COLS)
      console.log(SQUARE_COLS - 1)
      if (headIndex % SQUARE_COLS === SQUARE_COLS - 1)
        return true;
  }
  return false;
}

function gameOver(params) {
  gameStop();
}

function gameStart() {
  gameRestart();
}

function gameRestart() {
  move();
}

function gameStop() {
  clearTimeout(gameStopId);
}
function init() {
  drawSquares({ showGridNumbers: true })
  drawSnake();
}
init();

function handleGameStart() {
  if (!isStarting) {
    console.log('game start');
    gameStart();
    isStarting = true;
    text(startButtonElement, 'restart');
  } else {
    console.log('game restart');
    gameRestart();
  }

  startButtonElement.disabled = true;
  stopButtonElement.disabled = false;
}

function handleGameStop() {
  gameStop();
  startButtonElement.disabled = false;
  stopButtonElement.disabled = true;
}

function handleKeyControl({ key }) {
  key = key.replace(/arrow/i, '').toLowerCase();
  switch (key) {
    case 'up':
      if (direction === SQUARE_COLS) return;
      direction = -SQUARE_COLS;
      break;
    case 'down':
      if (direction === -SQUARE_COLS) return;
      direction = SQUARE_COLS;
      break;
    case 'left':
      if (direction === 1) return;
      direction = -1;
      break;
    case 'right':
      if (direction === -1) return;
      direction = 1;
      break;

  }
  console.log(direction)
}
on(startButtonElement, 'click', handleGameStart)
on(stopButtonElement, 'click', handleGameStop)
on(document, 'keyup', handleKeyControl)
// const SQUAREROWS = 10;
// const SQUARECOLS = 10;
// const SQUARE_TOTAL = SQUAREROWS * SQUARECOLS;
// console.log(SQUARE_TOTAL);

// const CLASSES = {
//   square: "Square",
//   snake: "Snake",
//   apple: "Apple",
//   gird: "Grid"
// }

