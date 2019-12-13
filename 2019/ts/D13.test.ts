import { getInput } from './util';
import { IntCodeComputer, SignalType } from './intcode';

const puzzleInput = getInput('13');
const playGame = (): [number, number] => {
  const computer = IntCodeComputer(puzzleInput, { overRideZeroLocation: 2 });
  let [blockTiles, score, nextInput, paddle] = [0, 0, 0, 0];
  let outputs: number[] = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { value } = computer.next(nextInput);
    if (value.type === SignalType.OUTPUT) {
      const output = value.number;
      outputs.push(output);
      if (outputs.length === 3) {
        const [x, y, tId] = outputs;
        if (x === -1 && y === 0) {
          score = tId;
        } else if (tId === 3) {
          paddle = x;
        } else if (tId === 4) {
          nextInput = paddle < x ? 1 : paddle === x ? 0 : -1;
        } else if (tId === 2) {
          blockTiles = blockTiles + 1;
        }
        outputs = [];
      }
    } else if (value.type === SignalType.COMPLETE) {
      break;
    }
  }
  return [blockTiles, score];
};

test('13', () => {
  const [blockTiles, score] = playGame();
  expect(blockTiles).toEqual(372);
  expect(score).toEqual(19297);
});
