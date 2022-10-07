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
/* --GRID------------------------------------------------------------------------ */
const SQUARE_ROWS = 10;
const SQUARE_COLS = 10;
const SQUARE_TOTAL = SQUARE_ROWS * SQUARE_COLS;
/* --SCORE & SPEED------------------------------------------------------------------------ */
const SPEED_RATIO = 0.9;
const SCORE_VALUE = 10;

/* --GAMEITEMS------------------------------------------------------------------------ */
const GAME_ELEMENTS = {
  grid: 'Grid',
  SquareInGrid: 'SquareInGrid',
  snake: 'Snake',
  apple: 'Apple',
};
/* --USERBUTTONS------------------------------------------------------------------------ */
const BUTTONS = {
  start: 'Button--start',
  stop: 'Button--stop',
};

/* --DOMEELEMENT------------------------------------------------------------------------ */
const gridElement = $(`.${GAME_ELEMENTS.grid}`);
const SquareInGridElement = $(`.${GAME_ELEMENTS.SquareInGrid}`);
const startButtonElement = $(`.${BUTTONS.start}`);
const stopButtonElement = $(`.${BUTTONS.stop}`);
const scoreDisplayElement = $(".Display");


/* -------------------------------------------------------------------------- */
/* 게임 변수                                                                    */
/* -------------------------------------------------------------------------- */
let snake = [2, 1, 0];
let direction = 1;
// const newArr = [...oldArr, newItem];
/* -------------------------------------------------------------------------- */
//todo 랜딩 되었을 때 셋팅 --> GRID 10 * 10 로 만들기
function createGridSquare() {
  const GridSquare = create('div', { class: GAME_ELEMENTS.SquareInGrid })
  return GridSquare;
}

function drawSquares(squares = [], { showGridNumbers } = { showGridNumbers: true }) {
  loop((i) => {
    const GridSquare = createGridSquare();
    if (showGridNumbers) {
      text(GridSquare, i)
    }
    append(gridElement, GridSquare);
    return [...squares, drawSquares()];
  }, SQUARE_TOTAL)



}



function init() {
  drawSquares()
}

init();

//todo 게임 시작 버튼을 눌렀을때 
// * 랜덤하게 뱀과 사과가 등장함
// * start버튼은 restart로 stop버튼 활성화

function drawSnake() {
  each(snake, (index) => addClass(squares[index], GAME_ELEMENTS.snake));
}

function moveSnake() {
  let tailIndex = snake.pop();
  removeClass(squares[tailIndex], GAME_ELEMENTS.snake);
  snake.unshift(snake[0] + direction);
  let headIndex = snake[0];
  addClass(squares[headIndex], GAME_ELEMENTS.snake);
  return { headIndex, tailIndex }
};

function test() {

}

function gameStart() {
  console.log('게임 시작');
  text(startButtonElement, 'RESTART');
  stopButtonElement.disabled = false;
}



function gameHandler() {
  drawSnake();
  gameStart();
  // moveSnake();
  test();
}
on(startButtonElement, 'click',
  gameHandler

)