import { getInput } from './util';
import { IntCodeComputer, SignalType } from './intcode';

// Assumption is that continuos three blocks can't be hole
// otherwise there won't be any solution
const puzzleInput = getInput('21');
const part1 =
  'OR A J\n' + // J true if A is GROUND
  'AND B J\n' + // J true if A,B is GROUND
  'AND C J\n' + // J true if A,B,C is GROUND
  'NOT J J\n' + // J false if A,B,C all are GROUND
  'AND D J\n' + // J true if D is GROUND and either A,B,C are HOLE
  'WALK\n'; // Jump if one of (A,B,C) are HOLE, and D is GROUND
// Part 2 based on solution from mebeim
// Check https://github.com/mebeim/aoc/blob/master/2019/README.md#day-21---springdroid-adventure
const part2 =
  'NOT C J\n' +
  'AND H J\n' +
  'NOT B T\n' +
  'OR T J\n' +
  'NOT A T\n' +
  'OR T J\n' +
  'AND D J\n' +
  'RUN\n';
const compileSpringSprint = (script: string) => {
  return script.split('').map(s => s.charCodeAt(0));
};
const execute = (script: string): number => {
  const inputs = compileSpringSprint(script);
  const computer = IntCodeComputer(puzzleInput);
  let nextInput = 0;
  let output = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { value } = computer.next(nextInput);
    if (value.type === SignalType.OUTPUT) {
      output = value.number;
    } else if (value.type === SignalType.INPUT) {
      nextInput = inputs.shift() as number;
    } else if (value.type === SignalType.COMPLETE) {
      break;
    }
  }
  return output;
};

test('21', () => {
  expect(execute(part1)).toEqual(19353565);
  expect(execute(part2)).toEqual(1140612950);
});
