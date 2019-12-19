import { getInput } from './util';
import { IntCodeComputer, SignalType } from './intcode';

const puzzleInput = getInput('19');
const check = (inputs: number[]): number => {
  let nextInput = 0;
  const computer = IntCodeComputer(puzzleInput);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { value } = computer.next(nextInput);
    if (value.type === SignalType.OUTPUT) {
      return value.number;
    } else if (value.type === SignalType.INPUT) {
      nextInput = inputs.shift() as number;
    } else if (value.type === SignalType.COMPLETE) {
      break;
    }
  }
  return 0;
};

const findPointsAffected = () => {
  let [impacted, from, started] = [0, 0, false];
  for (let y = 0; y < 50; y++) {
    started = false;
    for (let x = from; x < 50; x++) {
      const status = check([x, y]);
      impacted = impacted + status;
      if (status === 1 && !started) {
        started = true;
        from = x;
      } else if (status === 0 && started) {
        break;
      }
    }
  }
  return impacted;
};

const findBox = () => {
  let [y, lastEdge, started] = [500, 0, false];
  while (y < 2000) {
    started = false;
    for (let x = lastEdge; x < 2000; x++) {
      const status = check([x, y]);
      if (status === 1 && !started) {
        started = true;
      } else if (status === 0 && started) {
        lastEdge = x - 1;
        break;
      }
    }
    if (check([lastEdge - 99, y + 99]) === 1) {
      return (lastEdge - 99) * 10000 + y;
    }
    y = y + 1;
  }
  return -1;
};

test('19', () => {
  expect(findPointsAffected()).toEqual(226);
  expect(findBox()).toEqual(7900946);
});
