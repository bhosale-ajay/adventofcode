import { getInput, Dictionary } from './util';
import { IntCodeComputer, SignalType } from './intcode';

const puzzleInput = getInput('11');
const [MIN, MAX] = [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
const [rx, rY, iX, iY, kX, kY] = [-1, -1, 1, 1, 0, 0];
const [U, L, R, D] = [0, 1, 2, 3];
const dirU = [[rx, kY, L], [iX, kY, R]];
const dirL = [[kX, iY, D], [kX, rY, U]];
const dirR = [dirL[1], dirL[0]];
const dirD = [dirU[1], dirU[0]];
const directions = [dirU, dirL, dirR, dirD];
enum OutputTurn {
  Paint = 0,
  Direction
}
const keyMaker = (x: number, y: number) => `K${x}_${y}`;
const paintProgram = (startWith: 0 | 1): [Dictionary<number>, number[]] => {
  const computer = IntCodeComputer(puzzleInput);
  const panel: Dictionary<number> = {};
  let [x, y, dir] = [0, 0, U];
  let [minX, minY, maxX, maxY] = [MAX, MAX, MIN, MIN];
  let turn = OutputTurn.Paint;
  panel[keyMaker(x, y)] = startWith;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const currentPaint = panel[keyMaker(x, y)];
    const input = currentPaint !== undefined ? currentPaint : 0;
    const { value } = computer.next(input);
    if (value.type === SignalType.OUTPUT) {
      const output = value.number;
      if (turn === OutputTurn.Paint) {
        panel[keyMaker(x, y)] = output;
        turn = OutputTurn.Direction;
      } else {
        const [xi, yi, nd] = directions[dir][output];
        x = x + xi;
        y = y + yi;
        minX = Math.min(x, minX);
        maxX = Math.max(x, maxX);
        minY = Math.min(y, minY);
        maxY = Math.max(y, maxY);
        dir = nd;
        turn = OutputTurn.Paint;
      }
    } else if (value.type === SignalType.COMPLETE) {
      break;
    }
  }
  return [panel, [minX, minY, maxX, maxY]];
};

const displayNumber = (
  panel: Dictionary<number>,
  [x1, y1, x2, y2]: number[]
) => {
  let message = '';
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      message = message + (panel[keyMaker(x, y)] === 1 ? '#' : ' ');
    }
    message = message + '\n';
  }
  console.log(message);
};

test('11', () => {
  const [p1] = paintProgram(0);
  expect(Object.keys(p1).length).toEqual(1863);
  const [p2, rect] = paintProgram(1);
  displayNumber(p2, rect);
});
