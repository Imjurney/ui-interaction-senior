import {
  addClass,
  append,
  create,
  each,
  getNode as $,
  loop,
  on,
  removeClass,
  text,
} from './lib/index.js';

/* -------------------------------------------------------------------------- */
/* 게임 상수                                                                    */
/* -------------------------------------------------------------------------- */

const SQUARE_ROWS = 10;
const SQUARE_COLS = 10;
const SQUARE_TOTAL = SQUARE_ROWS * SQUARE_COLS;
const GAME_ELEMENTS = {
  grid: 'Grid',
  square: 'Square',
  snake: 'Snake',
  apple: 'Apple',
};
const BUTTONS = {
  start: 'Button--start',
  stop: 'Button--stop',
};

const gridElement = $(`.${GAME_ELEMENTS.grid}`);
const startButtonElement = $(`.${BUTTONS.start}`);
const stopButtonElement = $(`.${BUTTONS.stop}`);

/* -------------------------------------------------------------------------- */
/* 게임 변수                                                                    */
/* -------------------------------------------------------------------------- */

let squares = [];
let snake = [2, 1, 0];
let gameStopId;
let speed = 1000;
let isStaring = false;
let direction = 1;

/* -------------------------------------------------------------------------- */
/* 게임 함수                                                                    */
/* -------------------------------------------------------------------------- */

function createSquare() {
  const square = create('div', { class: GAME_ELEMENTS.square });
  return square;
}

function drawSquares({ showGridNumbers = false } = {}) {
  loop((i) => {
    const square = createSquare();
    if (showGridNumbers) text(square, i);
    append(gridElement, square);
    squares.push(square);
  }, SQUARE_TOTAL);
}

function drawSnake() {
  each(snake, (index) => addClass(squares[index], GAME_ELEMENTS.snake));
}

function movingSnake() {
  // 꼬리 떼기
  let tailIndex = snake.pop();
  removeClass(squares[tailIndex], GAME_ELEMENTS.snake);
  // 머리 추가
  snake.unshift(snake[0] + direction);
  let headIndex = snake[0];
  addClass(squares[headIndex], GAME_ELEMENTS.snake);
}

function move() {
  if (isGameOver()) {
    return gameOver();
  }
  movingSnake();
  gameStopId = setTimeout(move, speed);
}

function isGameOver() {
  let headIndex = snake[0];
  switch (direction) {
    // 벽의 위에 뱀 머리가 충돌
    case -SQUARE_COLS:
      if (headIndex + direction < 0) return true;
      break;
    // 벽의 아래에 뱀 머리가 충돌
    case SQUARE_COLS:
      if (headIndex + direction >= SQUARE_TOTAL) return true;
      break;
    // 벽의 왼쪽에 뱀 머리가 충돌
    case -1:
      if (headIndex % SQUARE_COLS === 0) return true;
      break;
    // 벽의 오른쪽에 뱀 머리가 충돌
    case 1:
      console.log(headIndex % SQUARE_COLS);
      console.log(SQUARE_COLS - 1);
      if (headIndex % SQUARE_COLS === SQUARE_COLS - 1) return true;
  }
  // 뱀의 몸통에 뱀 머리가 충돌
  return false;
}

function gameOver() {
  alert('GAME OVER');
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
  drawSquares({ showGridNumbers: true });
  drawSnake();
}

init();

function handleGameStart() {
  if (!isStaring) {
    console.log('game start');
    isStaring = true;
    gameStart();
    text(startButtonElement, 'restart');
  } else {
    console.log('game restart');
    gameRestart();
  }
  startButtonElement.disabled = true;
  stopButtonElement.disabled = false;
}

function handleGameStop() {
  console.log('game stop');
  gameStop();
  startButtonElement.disabled = false;
  stopButtonElement.disabled = true;
}

function handleKeyControl({ key }) {
  key = key.replace(/arrow/i, '').toLowerCase();
  switch (key) {
    case 'left':
      if (direction === 1) return;
      direction = -1;
      break;
    case 'right':
      if (direction === -1) return;
      direction = 1;
      break;
    case 'up':
      if (direction === SQUARE_COLS) return;
      direction = -SQUARE_COLS;
      break;
    case 'down':
      if (direction === -SQUARE_COLS) return;
      direction = SQUARE_COLS;
  }
}

on(startButtonElement, 'click', handleGameStart);
on(stopButtonElement, 'click', handleGameStop);
on(document, 'keyup', handleKeyControl);