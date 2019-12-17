import { getInput } from './util';
import { IntCodeComputer, SignalType } from './intcode';

type View = number[][];
const puzzleInput = getInput('17');
const char = (cc: number) => String.fromCharCode(cc);
const cc = (s: string | number) => s.toString().charCodeAt(0);
const SCAFFOLD = cc('#');
const [NL, SPACE] = ['\n', ' '];
const [UP_CC, DO_CC, LE_CC, RI_CC] = [cc('^'), cc('v'), cc('<'), cc('>')];
const [NL_CC, L_CC, R_CC, N_CC] = [cc(NL), cc('L'), cc('R'), cc('n')];
const regExpForSpace = / /g;

const isScaffold = (view: View, x: number, y: number) => {
  return 0 <= y && y < view.length && view[y][x] === SCAFFOLD;
};

const processCameraMode = (): [View, number, number, number] => {
  const computer = IntCodeComputer(puzzleInput);
  const view = [] as View;
  // prettier-ignore
  const robotIndicators = [UP_CC, DO_CC, LE_CC, RI_CC];
  let [y, rx, ry, sum] = [0, 0, 0, 0];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { value } = computer.next(0);
    if (value.type === SignalType.OUTPUT) {
      const output = value.number;
      if (output === NL_CC) {
        y = y + 1;
      } else {
        if (view.length === y) {
          view.push([]);
        }
        if (robotIndicators.some(ri => ri === output)) {
          [ry, rx] = [y, view[y].length];
        }
        view[y].push(output);
      }
    } else if (value.type === SignalType.COMPLETE) {
      break;
    }
  }
  for (y = 1; y < view.length - 1; y++) {
    for (let x = 1; x < view[y].length - 1; x++) {
      // prettier-ignore
      if (isScaffold(view, x, y) &&
          isScaffold(view, x, y - 1) && isScaffold(view, x - 1, y) &&
          isScaffold(view, x, y + 1) && isScaffold(view, x + 1, y)
      ) {
        sum = sum + y * x;
      }
    }
  }
  return [view, sum, rx, ry];
};

// prettier-ignore
const impact = [ [0, -1, L_CC], [0, 1, R_CC], [-1, 0, L_CC], [1, 0, R_CC] ];

const startingDirection = (view: View, x: number, y: number): number[] => {
  for (const [xi, yi, rl] of impact) {
    if (isScaffold(view, x + xi, y + yi)) {
      return [rl, xi, yi];
    }
  }
  throw 'Invalid location of Robot.';
};

const extractPattern = (path: string, func: string): [string, string] => {
  const steps = path.split(SPACE);
  let pattern = '';
  let index = steps.findIndex(s => !s.startsWith('-'));
  if (index === -1) {
    // if there is input which only need two movement function this will fail
    throw `Invalid path`;
  }
  let patternToTry = steps[index];
  while (patternToTry.trim().length <= 20 && path.indexOf(patternToTry) > -1) {
    pattern = patternToTry;
    index = index + 1;
    if (index === steps.length || steps[index].startsWith('-')) {
      break;
    }
    patternToTry = patternToTry + SPACE + steps[index];
  }
  return [path.replace(new RegExp(pattern, 'g'), `-${func}-`).trim(), pattern];
};

const convertToInput = (p: string): number[] => {
  return (p + NL)
    .replace(regExpForSpace, ',')
    .split('')
    .map(s => s.charCodeAt(0));
};

const prepareInputForRobot = (view: View, x: number, y: number): number[] => {
  let [rl, xi, yi] = startingDirection(view, x, y);
  // let steps = [] as string[];
  let path = '';
  while (rl !== 0) {
    let step = 0;
    while (isScaffold(view, x + xi, y + yi)) {
      [x, y, step] = [x + xi, y + yi, step + 1];
    }
    path = path + char(rl) + ',' + step + SPACE;
    rl = 0;
    if (xi === 0) {
      if (isScaffold(view, x - 1, y)) {
        [rl, xi, yi] = [yi === -1 ? L_CC : R_CC, -1, 0];
      } else if (isScaffold(view, x + 1, y)) {
        [rl, xi, yi] = [yi === -1 ? R_CC : L_CC, +1, 0];
      }
    } else {
      if (isScaffold(view, x, y - 1)) {
        [rl, xi, yi] = [xi === -1 ? R_CC : L_CC, 0, -1];
      } else if (isScaffold(view, x, y + 1)) {
        [rl, xi, yi] = [xi === -1 ? L_CC : R_CC, 0, +1];
      }
    }
  }
  const [pathRA, a] = extractPattern(path.trim(), 'A');
  const [pathRB, b] = extractPattern(pathRA, 'B');
  const [pathRC, c] = extractPattern(pathRB, 'C');
  if (pathRC.indexOf('R') > -1 || pathRC.indexOf('L') > -1) {
    throw 'Not able to extract all patterns, logic not sufficient.';
  }
  return [
    ...convertToInput(pathRC.replace(/-/g, '').replace(regExpForSpace, ',')),
    ...convertToInput(a),
    ...convertToInput(b),
    ...convertToInput(c),
    N_CC, // Say NO
    NL_CC // Last New Line
  ];
};

const processCleanMode = (view: View, rx: number, ry: number): number => {
  const computer = IntCodeComputer(puzzleInput, { overrideZeroLocation: 2 });
  const input = prepareInputForRobot(view, rx, ry);
  let [nextInput, dustCollected] = [0, 0];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { value } = computer.next(nextInput);
    if (value.type === SignalType.OUTPUT) {
      dustCollected = value.number;
    } else if (value.type === SignalType.INPUT) {
      nextInput = input.shift() as number;
    } else if (value.type === SignalType.COMPLETE) {
      break;
    }
  }
  return dustCollected;
};

test('17', () => {
  const [view, sum, rx, ry] = processCameraMode();
  expect(sum).toEqual(4112);
  expect(processCleanMode(view, rx, ry)).toEqual(578918);
});
