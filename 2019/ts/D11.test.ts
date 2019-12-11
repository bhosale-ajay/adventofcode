import { getInput, Dictionary } from './util';

const parse = (s: string) => s.split(',').map(w => +w);
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
  const p = parse(puzzleInput);
  const panel: Dictionary<number> = {};
  let [x, y, dir] = [0, 0, U];
  let [minX, minY, maxX, maxY] = [MAX, MAX, MIN, MIN];
  let rb = 0;
  let turn = OutputTurn.Paint;
  panel[keyMaker(x, y)] = startWith;
  const gv = (ip: number) => (p[ip] === undefined ? 0 : p[ip]);
  // prettier-ignore
  const gi = (m: number, ip: number) => m === 0 ? p[ip] : m === 1 ? ip : rb + p[ip];
  for (let ip = 0; ip < p.length; ) {
    const i = p[ip];
    const [_, tpm, spm, fpm] = (100000 + i).toString().split('');
    const a = gi(+fpm, ip + 1);
    const b = gi(+spm, ip + 2);
    const c = gi(+tpm, ip + 3);
    const opCode = i % 100;
    if (opCode === 1) {
      p[c] = gv(a) + gv(b);
      ip = ip + 4;
    } else if (opCode === 2) {
      p[c] = gv(a) * gv(b);
      ip = ip + 4;
    } else if (opCode === 3) {
      const v = panel[keyMaker(x, y)];
      p[a] = v !== undefined ? v : 0;
      ip = ip + 2;
    } else if (opCode === 4) {
      const output = gv(a);
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
      ip = ip + 2;
    } else if (opCode === 5) {
      ip = gv(a) !== 0 ? gv(b) : ip + 3;
    } else if (opCode === 6) {
      ip = gv(a) === 0 ? gv(b) : ip + 3;
    } else if (opCode === 7) {
      p[c] = gv(a) < gv(b) ? 1 : 0;
      ip = ip + 4;
    } else if (opCode === 8) {
      p[c] = gv(a) === gv(b) ? 1 : 0;
      ip = ip + 4;
    } else if (opCode === 9) {
      rb = rb + gv(a);
      ip = ip + 2;
    } else if (opCode === 99) {
      return [panel, [minX, minY, maxX, maxY]];
    } else {
      return [panel, [minX, minY, maxX, maxY]];
    }
  }
  return [panel, [minX, minY, maxX, maxY]];
};

const renderNumber = (
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
  renderNumber(p2, rect);
});
