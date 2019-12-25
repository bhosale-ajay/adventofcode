import { getInput } from './util';
import { IntCodeComputer, SignalType } from './intcode';

const char = (cc: number) => String.fromCharCode(cc);
const [NL, NORTH, SOUTH, EAST, WEST] = ['\n', 'north', 'south', 'east', 'west'];
const convertToInput = (p: string): number[] => {
  return p.split('').map(s => s.charCodeAt(0));
};
const findSanta = () => {
  const program = getInput('25');
  const computer = IntCodeComputer(program);
  const inputs = convertToInput(
    [
      WEST,
      'take mug',
      EAST,
      EAST,
      'take coin',
      NORTH,
      NORTH,
      'take hypercube',
      SOUTH,
      SOUTH,
      SOUTH,
      WEST,
      'take astrolabe',
      NORTH,
      EAST,
      NORTH,
      EAST
    ].join(NL) + NL
  );
  inputs.unshift(0);   // first dummy input
  let index = 0;
  let output = '';
  while (true) {
    const signal = computer.next(inputs[index]).value;
    if (signal.type === SignalType.OUTPUT) {
      output = output + char(signal.number);
      if (output.endsWith('Command?')) {
        // console.log(output);
        output = '';
      }
    } else if (signal.type === SignalType.INPUT) {
      index = index + 1;
      if (index === inputs.length) {
        break;
      }
    } else if (signal.type === SignalType.COMPLETE) {
      break;
    }
  }
  return output;
};
console.log(findSanta());
