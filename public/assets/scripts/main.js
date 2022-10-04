import {
  addClass,
  append,
  create,
  each,
  getNode as $,
  loop,
  on,
  removeClass,
  hasClass,
  text,
  getRandom,
} from './lib/index.js';

/* -------------------------------------------------------------------------- */
/* 게임 상수                                                                    */
/* -------------------------------------------------------------------------- */
const SPEED_RATIO = 0.9;
const SQUARE_ROWS = 10;
const SQUARE_COLS = 10;
const SQUARE_TOTAL = SQUARE_ROWS * SQUARE_COLS;
const GAME_ELEMENTS = {
  grid: 'Grid',
  square: 'Square',
  snake: 'Snake',
  apple: 'Apple',
};
const SCORE_VALUE = 10;
const BUTTONS = {
  start: 'Button--start',
  stop: 'Button--stop',
};

const gridElement = $(`.${GAME_ELEMENTS.grid}`);
const startButtonElement = $(`.${BUTTONS.start}`);
const stopButtonElement = $(`.${BUTTONS.stop}`);
const scoreDisplayElement = $(".Display");


/* -------------------------------------------------------------------------- */
/* 게임 변수                                                                    */
/* -------------------------------------------------------------------------- */

let squares = [];
let snake = [];
let gameStopId;
let speed = 1000;
let isStarting = false;
let direction = 1;
let appleIndex;
let score = 0;

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

function drawApple() {
  //스네이크와 겹치지 않게 그리드 위에 생성 되어야함
  do {
    appleIndex = getRandom(SQUARE_TOTAL - 1)
    // console.log(appleIndex)
  } while (hasClass(squares[appleIndex], GAME_ELEMENTS.snake));
  //스네이크와 겹치지 않는 그리드 위치 찾기

  addClass(squares[appleIndex], GAME_ELEMENTS.apple)
  //do ~while
  //찾은 위치 값의 인덱스 애플 클래스 추가
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

  return { headIndex, tailIndex };
}

function scoreUp() {
  let { headIndex } = movingSnake();

  //스네이크 헤드가 애플을 먹으면 처리
  do {
    score += SCORE_VALUE;
  } while (hasClass(squares[headIndex], GAME_ELEMENTS.apple));

  //사과를 먹을때마다 +10 증가한다.
  //증가한 값을 score 변수에 넣어준다.
  text(scoreDisplayElement, score)
  console.log(score)
}

function speedUp() {
  speed = SPEED_RATIO * speed;
  console.log(speed)
}

function move() {
  if (isGameOver()) {
    return gameOver();
  }

  let { headIndex, tailIndex } = movingSnake();

  //스네이크 헤드가 애플을 먹으면 처리
  if (hasClass(squares[headIndex], GAME_ELEMENTS.apple)) {
    //애플은 그리드에서 사라져야 함
    removeClass(squares[appleIndex], GAME_ELEMENTS.apple);
    //애플은 그리드의 임의 위치 스네이크와 겹치지 않게 드로잉
    addClass(squares[tailIndex], GAME_ELEMENTS.snake)
    snake.push(tailIndex);
    // console.log({ snake });
    drawApple();
    //스네이크의 꼬리가 길어져야함

    //스코어 업
    // gameStop();
    scoreUp();
    speedUp();
    // gameRestart();

  }

  gameStopId = setTimeout(move, speed);
}

function isGameOver() {
  let headIndex = snake[0];
  console.log(headIndex);
  let nextHeadIndex = headIndex + direction;
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
      // console.log(headIndex % SQUARE_COLS);
      // console.log(SQUARE_COLS - 1);
      if (headIndex % SQUARE_COLS === SQUARE_COLS - 1) return true;
  }
  // 뱀의 몸통에 뱀 머리가 충돌
  if (hasClass(squares[nextHeadIndex], GAME_ELEMENTS.snake)) {
    return true;
  }
}

function gameOver() {
  alert('GAME OVER');
  console.log('GAME OVER');
  gameStop();
  startButtonElement.disabled = false;
  text(startButtonElement, 'START')
  stopButtonElement.disabled = true;
  score = 0;
  speed = 1000;
  isStarting = false;
  direction = 1;
}

function resetSquares() {
  each(squares, square => removeClass(square, GAME_ELEMENTS.apple, GAME_ELEMENTS.snake));
}

function resetScoreDisplay() {
  score = 0;
  text(scoreDisplayElement, score);
}

function resetGame() {
  console.log('reset game');
  resetSquares();
  resetScoreDisplay();
  snake = getRandomSnakeArray();
  //pristine
  drawSnake();
  drawApple();
}

function resetAndGameStart() {
  gameOver();
  resetGame();

}

function gameStart() {
  console.log('game start');
  resetGame();
  gameRestart();
}

function getRandomSnakeArray() {
  let headIndex;
  let restIndex;
  do {
    headIndex = getRandom(SQUARE_TOTAL - 1);
    restIndex = headIndex % SQUARE_ROWS;
    console.log({ restIndex });
  } while (restIndex < 3 || restIndex > 7);
  console.log('----------------------------------------------------- 끝', restIndex)
  let bodyIndex = headIndex - 1;
  let tailIndex = headIndex - 2;

  return [headIndex, bodyIndex, tailIndex]
}

loop(getRandomSnakeArray, 100)
function gameRestart() {
  move();
}

function gameStop() {
  clearTimeout(gameStopId);
}

function init() {
  drawSquares({ showGridNumbers: true });
}

init();

function handleGameStart() {
  console.log({ isStarting });
  if (!isStarting) {
    text(startButtonElement, 'restart');
    gameStart();
    isStarting = true;
  } else {
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