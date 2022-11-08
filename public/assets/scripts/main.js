const SQUARE_ROWS = 10;
const SQUARE_COLS = 10;
const SQUARE_TOTAL = SQUARE_ROWS * SQUARE_COLS;

import { addClass, append, create, getNode as $, hasClass, on, removeClass, text } from "../scripts/lib/dom/index.js";
import { each, getRandom, loop } from "./lib/utils/index.js";

const CLASSES = {
  square: 'Square',
  snake: 'Snake',
  apple: 'Apple',
  grid: 'Grid'
}

/* ------------------------------------------------------------ */
const gridElement = $(`.${CLASSES.grid}`);
const startButtonElement = $(".Button--start");
const stopButtonElement = $(".Button--stop");
const ScoreElement = $('.Score');

let squares = [];
let snake = [];
let gameStopId;
let direction = 1;
let speed = 1000;
let appleIndex;
let isStarting = false;
let SPEED_RATIO = 0.9;
let score = 0;

const createSquare = () => {
  const square = create('div', { class: CLASSES.square })
  return square;
}

const drawSquares = ({ showGridNumber = false } = {}) => {
  loop((i) => {
    const square = createSquare();
    if (showGridNumber) {
      text(square, i);
    }
    squares.push(square);
    append(gridElement, square);
  }, SQUARE_TOTAL);


}

function init() {
  drawSquares();
}
init();

const drawSnake = () => {
  each(snake, (index) => {
    addClass(squares[index], CLASSES.snake);
  });
}
const randomSnakeArray = () => {
  let headIndex;
  let restIndex;
  do {
    headIndex = getRandom(SQUARE_TOTAL - 1);
    restIndex = headIndex % SQUARE_ROWS;
  } while (restIndex < SQUARE_ROWS - 7 || restIndex > SQUARE_ROWS - 3);
  let bodyIndex = headIndex - 1;
  let tailIndex = headIndex - 2;
  snake.push(headIndex, bodyIndex, tailIndex);
  return [headIndex, bodyIndex, tailIndex]
}




const drawApple = () => {
  do {
    appleIndex = getRandom(SQUARE_TOTAL - 1);
  } while (hasClass(squares[appleIndex], CLASSES.snake))
  addClass(squares[appleIndex], CLASSES.apple)
}


const moveSnake = () => {
  let tailIndex = snake.pop();
  removeClass(squares[tailIndex], CLASSES.snake);
  snake.unshift(snake[0] + direction);
  let headIndex = snake[0];
  addClass(squares[headIndex], CLASSES.snake);
  return { headIndex, tailIndex }
}

const moveAnimation = () => {
  if (isGameOver()) {
    return gameOver();
  }
  let { headIndex, tailIndex } = moveSnake();
  gameStopId = setTimeout(moveAnimation, speed);
  if (hasClass(squares[headIndex], CLASSES.apple)) {
    removeClass(squares[appleIndex], CLASSES.apple);
    addClass(squares[tailIndex], CLASSES.snake);
    snake.push(tailIndex);
    ScoreUp();
    speed *= SPEED_RATIO;
    drawApple();
  }
}

const stopAnimation = () => {
  clearTimeout(gameStopId);
}

function ScoreUp() {
  score += 10;
  text(ScoreElement, score)
}


function gameStart() {
  randomSnakeArray();
  drawSnake();
  drawApple();
  moveAnimation();
  text(startButtonElement, 'RESTART');
  startButtonElement.disabled = true;
  stopButtonElement.disabled = false;
}


function gameOver() {
  alert('gameOver');
  stopAnimation();
  resetGame();

}

function resetGame() {
  resetSquares();
  resetScore();
  snake = randomSnakeArray();
  drawApple();
  drawSnake();
  text(startButtonElement, 'START');
  startButtonElement.disabled = false;
  stopButtonElement.disabled = true;
}

function resetSquares() {
  each(squares, (square) => {
    removeClass(square, CLASSES.apple, CLASSES.snake)
  })
}

function resetScore() {
  score = 0;
  text(ScoreElement, score);
}


function gameRestart() {
  moveAnimation();
}

function handleGameStart() {
  if (!isStarting) {
    gameStart();
    isStarting = true;
  } else {
    gameRestart();
  }
  startButtonElement.disabled = true;
  stopButtonElement.disabled = false;
}


function handleGameStop() {
  stopAnimation();
  console.log('gameStop');
  stopButtonElement.disabled = true;
  startButtonElement.disabled = false;
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
      console.log(direction)
      break;
    case 'right':
      if (direction === -1) return;
      direction = 1;
      console.log(direction)
  }
}
function isGameOver() {
  let headIndex = snake[0];
  let nextHeadIndex = headIndex + direction;
  switch (direction) {
    case - SQUARE_COLS:
      if (nextHeadIndex < 0) return true;
      break;
    case SQUARE_COLS:
      if (nextHeadIndex > SQUARE_TOTAL) return true;
      break;
    case -1:
      if (headIndex % SQUARE_COLS === 0) return true;
      break;
    case 1:
      if (headIndex % SQUARE_COLS === SQUARE_COLS - 1) return true;

  }
  if (hasClass(squares[nextHeadIndex], CLASSES.snake)) {
    return true;
  }
}




on(startButtonElement, 'click', handleGameStart);
on(stopButtonElement, 'click', handleGameStop)
on(document, 'keyup', handleKeyControl);













