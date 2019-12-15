import { getInput, Dictionary } from './util';
import { IntCodeComputer, SignalType } from './intcode';

const puzzleInput = getInput('15');
const getKey = (x: number, y: number) => `K${x}_${y}`;
const [EMPTY, WALL, O, UNKNOWN] = ['.', '#', 'O', undefined];
// prettier-ignore
const impact = [[0, 0], [0, -1], [0, 1], [-1, 0], [1, 0]];
const [N, S, W, E] = [1, 2, 3, 4];
const DIRS = [N, S, W, E];
const RETURN = [0, S, N, E, W];

const spreadOxygen = (): [number, number] => {
  const computer = IntCodeComputer(puzzleInput);
  const section = {} as Dictionary<string>;
  let [x, y, steps, mins, command] = [0, 0, 0, 0, N];
  const isUnknown = ([xi, yi]: number[]) => {
    return section[getKey(x + xi, y + yi)] === UNKNOWN;
  };
  const hasSomeThing = ([xi, yi]: number[]) => {
    const status = section[getKey(x + xi, y + yi)];
    return status === EMPTY || status === O;
  };
  const isEmpty = ([xi, yi]: number[]) => {
    return section[getKey(x + xi, y + yi)] === EMPTY;
  };
  const directions = [];
  section[getKey(x, y)] = EMPTY;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { value } = computer.next(command);
    if (value.type === SignalType.OUTPUT) {
      const status = value.number;
      const [xi, yi] = impact[command];
      const [nx, ny] = [x + xi, y + yi];
      const location = getKey(nx, ny);
      if (status === 1 || status === 2) {
        if (section[location] === UNKNOWN) {
          directions.push(command);
          section[location] = status === 2 ? O : EMPTY;
        }
        [x, y] = [nx, ny];
      } else {
        section[location] = WALL;
      }
    } else if (value.type === SignalType.INPUT) {
      const unExplored = DIRS.filter(d => isUnknown(impact[d]));
      if (unExplored.length === 0) {
        const cameFrom = directions.pop();
        if (cameFrom === undefined) {
          break;
        }
        command = RETURN[cameFrom];
      } else {
        command = unExplored[0];
      }
    } else if (value.type === SignalType.COMPLETE) {
      break;
    }
  }
  [x, y] = [0, 0]; // reset x and y
  const searchQueue = [[x, y, steps]] as number[][];
  const visited = new Set(getKey(0, 0));
  outer: while (searchQueue.length > 0) {
    [x, y, steps] = searchQueue.shift() as number[];
    const dirs = DIRS.filter(d => hasSomeThing(impact[d]));
    for (const [xi, yi] of dirs.map(d => impact[d])) {
      const [nx, ny] = [x + xi, y + yi];
      const location = getKey(nx, ny);
      if (section[location] === O) {
        [x, y, steps] = [nx, ny, steps + 1];
        break outer;
      } else if (!visited.has(location)) {
        visited.add(location);
        searchQueue.push([nx, ny, steps + 1]);
      }
    }
  }
  const spreadQueue = [[x, y, mins]] as number[][];
  while (spreadQueue.length > 0) {
    [x, y, mins] = spreadQueue.shift() as number[];
    const dirs = DIRS.filter(d => isEmpty(impact[d]));
    for (const [xi, yi] of dirs.map(d => impact[d])) {
      const [nx, ny] = [x + xi, y + yi];
      section[getKey(nx, ny)] = O;
      spreadQueue.push([nx, ny, mins + 1]);
    }
  }
  return [steps, mins];
};

test('15', () => {
  expect(spreadOxygen()).toEqual([282, 286]);
});
