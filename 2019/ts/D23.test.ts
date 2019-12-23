import { getInput } from './util';
import { Message, IntCodeComputer, SignalType } from './intcode';

class MessageBox {
  private messages: number[] = [0];
  private currentMessageIndex = 0;
  private outputQueue: number[] = [];

  constructor(seed: number) {
    this.messages.push(seed);
  }

  public push(x: number, y: number) {
    this.messages.push(x);
    this.messages.push(y);
  }

  public pullMessage() {
    this.currentMessageIndex = Math.min(
      this.messages.length,
      this.currentMessageIndex + 1
    );
  }

  public get current() {
    if (this.currentMessageIndex === this.messages.length) {
      return -1;
    }
    return this.messages[this.currentMessageIndex];
  }

  public get IsEmpty() {
    return (
      this.currentMessageIndex === this.messages.length &&
      this.outputQueue.length === 0
    );
  }

  public buildOutputMessage(message: number): number[] | null {
    if (this.outputQueue.length === 2) {
      const dest = this.outputQueue[0];
      const x = this.outputQueue[1];
      const y = message;
      this.outputQueue = [];
      return [dest, x, y];
    }
    this.outputQueue.push(message);
    return null;
  }
}

const process = (): [number, number] => {
  const program = getInput('23');
  const computers = [] as Generator<Message, Message, number>[];
  const messageHub = [] as MessageBox[];
  const count = 50;
  for (let i = 0; i < count; i++) {
    computers.push(IntCodeComputer(program));
    messageHub.push(new MessageBox(i));
  }
  let firstMessageTo255: null | number = null;
  let repeatedMessageTo0: null | number = null;
  let NAT = [] as number[];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    for (let index = 0; index < count; index++) {
      const input = messageHub[index].current;
      const signal = computers[index].next(input).value;
      if (signal.type === SignalType.OUTPUT) {
        const output = messageHub[index].buildOutputMessage(signal.number);
        if (output !== null) {
          const [dest, x, y] = output;
          if (dest === 255) {
            if (firstMessageTo255 === null) {
              firstMessageTo255 = y;
            }
            NAT = [x, y];
          } else {
            messageHub[dest].push(x, y);
          }
        }
      } else if (signal.type === SignalType.INPUT) {
        messageHub[index].pullMessage();
      }
    }
    if (messageHub.every(m => m.IsEmpty) && NAT.length > 0) {
      if (repeatedMessageTo0 === NAT[1]) {
        break;
      }
      repeatedMessageTo0 = NAT[1];
      messageHub[0].push(NAT[0], NAT[1]);
    }
  }
  return [firstMessageTo255 as number, repeatedMessageTo0];
};

test('23', () => {
  expect(process()).toEqual([17283, 11319]);
});
