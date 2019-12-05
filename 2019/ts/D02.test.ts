import { getInput } from './util';

const parse = (s: string) => s.split(',').map(n => +n);
const puzzleInput = getInput('02');

const tryNounAndVerb = (data: string, noun: number, verb: number) => {
  const p = parse(data);
  p[1] = noun;
  p[2] = verb;
  for (let ip = 0; ; ip = ip + 4) {
    const opCode = p[ip];
    if (opCode === 1) {
      p[p[ip + 3]] = p[p[ip + 1]] + p[p[ip + 2]];
    } else if (opCode === 2) {
      p[p[ip + 3]] = p[p[ip + 1]] * p[p[ip + 2]];
    } else if (opCode === 99) {
      return p[0];
    } else {
      return 0;
    }
  }
};

const findNounAndVerbToLand = () => {
  for (let n = 13; n <= 99; n++) {
    for (let v = 0; v <= 99; v++) {
      if (tryNounAndVerb(puzzleInput, n, v) === 19690720) {
        return n * 100 + v;
      }
    }
  }
  return 0;
};

test('02, Part 1', () => {
  expect(tryNounAndVerb(puzzleInput, 12, 2)).toEqual(10566835);
});

test('02, Part 2', () => {
  expect(findNounAndVerbToLand()).toEqual(2347);
});
