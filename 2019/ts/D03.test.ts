import { getInput, Dictionary, getValue } from './util';

interface Step {
  d: 'U' | 'D' | 'L' | 'R';
  s: number;
}
type Grid = Dictionary<number[]>;

const directions = {
  U: [0, -1],
  R: [1, 0],
  D: [0, 1],
  L: [-1, 0]
};
const MAX = Number.MAX_SAFE_INTEGER;
const parseInput = (i: string) => getInput(i).split('\n');
const parseStep = (l: string) => ({ d: l[0], s: +l.substr(1) } as Step);
const parseWire = (wd: string) => wd.split(',').map(parseStep);
const findInterSections = ( 
    [grid, md, cs]: [Grid, number, number],
    steps: Step[], 
    wi: number) => {
  let [step, x, y] = [1, 0, 0];
  for (const { d, s } of steps) {
    const [xd, yd] = directions[d];
    for (let i = 0; i < s; i++) {
      x = x + xd;
      y = y + yd;
      const key = `${x}_${y}`;
      const stepsToReach = getValue(grid, key, [0, 0]);
      if (stepsToReach[wi] === 0) {
        stepsToReach[wi] = step;
        if (stepsToReach[0] > 0 && stepsToReach[1] > 0) {
          md = Math.min(md, Math.abs(x) + Math.abs(y));
          cs = Math.min(cs, stepsToReach[0] + stepsToReach[1]);
        }
      }
      step = step + 1;
    }
  }
  return [grid, md, cs] as [Grid, number, number];
};

const findClosestIntersection = (ip: string) => {
  const [_, md, cs] = parseInput(ip)
    .map(parseWire)
    .reduce(findInterSections, [{}, MAX, MAX] as [Grid, number, number])
  return [md, cs];
};

test('03, Part 1', () => {
  expect(findClosestIntersection('03a')).toEqual([6, 30]);
  expect(findClosestIntersection('03b')).toEqual([159, 610]);
  expect(findClosestIntersection('03c')).toEqual([135, 410]);
  expect(findClosestIntersection('03')).toEqual([855, 11238]);
});
