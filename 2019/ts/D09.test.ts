import { getInput } from './util';
import { IntCodeComputer, SignalType } from './intcode';

const puzzleInput = getInput('09');

const findDiagnosticCode = (input: number) => {
  const computer = IntCodeComputer(puzzleInput);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { value } = computer.next(input);
    if (value.type === SignalType.OUTPUT) {
      return value.number;
    } else if (value.type === SignalType.COMPLETE) {
      break;
    }
  }
  return 0;
};

test('09', () => {
  expect(findDiagnosticCode(1)).toEqual(3460311188);
  expect(findDiagnosticCode(2)).toEqual(42202);
});
