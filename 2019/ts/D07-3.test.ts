import { getInput, combinations } from './util';
import { IntCodeComputer, SignalType } from './intcode';

class MessageBox {
  private messages: number[] = [0];
  private currentMessageIndex = 0;

  constructor(seed: number) {
    this.messages.push(seed);
  }

  public push(message: number) {
    this.messages.push(message);
  }

  public next() {
    if (this.currentMessageIndex < this.messages.length - 1) {
      this.currentMessageIndex = this.currentMessageIndex + 1;
      return true;
    }
    return false;
  }

  public get current() {
    return this.messages[this.currentMessageIndex];
  }

  public get lastSignal() {
    return this.messages[this.messages.length - 1];
  }
}

const buildMessageHub = (ps: number[]) => {
  const result = [] as MessageBox[];
  ps.forEach(p => result.push(new MessageBox(p)));
  // Pass zero to first
  result[0].push(0);
  return result;
};
const findHighestSignal = (ip: string): number => {
  const program = getInput(ip);
  let max = 0;
  const nextAmplifier = [1, 2, 3, 4, 0];
  const prevAmplifier = [4, 0, 1, 2, 3];
  for (const ps of combinations(5, 9)) {
    const messageHub = buildMessageHub(ps);
    const amplifiers = ps.map(_ => IntCodeComputer(program));
    let ai = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const input = messageHub[ai].current;
      const signal = amplifiers[ai].next(input).value;
      if (signal.type === SignalType.COMPLETE) {
        if (ai === 4) {
          break;
        } else {
          ai = nextAmplifier[ai];
        }
      } else if (signal.type === SignalType.OUTPUT) {
        ai = nextAmplifier[ai];
        messageHub[ai].push(signal.number);
      } else if (signal.type === SignalType.INPUT) {
        if (!messageHub[ai].next()) {
          ai = prevAmplifier[ai];
        }
      }
    }
    max = Math.max(messageHub[0].lastSignal, max);
  }
  return max;
};

test('07 Part 2 With Extracted IntCode', () => {
  expect(findHighestSignal('07d')).toEqual(139629729);
  expect(findHighestSignal('07e')).toEqual(18216);
  expect(findHighestSignal('07')).toEqual(1518124);
});
