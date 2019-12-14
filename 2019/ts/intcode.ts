const parse = (s: string) => s.split(',').map(w => +w);

export enum SignalType {
  READY = 'READY',
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  COMPLETE = 'COMPLETE'
}

export class ReadySignal {
  readonly type = SignalType.READY;
}

export class InputSignal {
  readonly type = SignalType.INPUT;
}

export class OutputSignal {
  readonly type = SignalType.OUTPUT;
  constructor(readonly number: number) {}
}

export class CompleteSignal {
  readonly type = SignalType.COMPLETE;
}

export type Message = InputSignal | OutputSignal | ReadySignal | CompleteSignal;

type Options = {
  overrideZeroLocation?: number;
};

export function* IntCodeComputer(
  program: string,
  { overrideZeroLocation }: Options = {}
): Generator<Message, Message, number> {
  const p = parse(program);
  if (overrideZeroLocation !== undefined) {
    p[0] = overrideZeroLocation;
  }
  yield new ReadySignal();
  let rb = 0;
  const gv = (ip: number) => (p[ip] === undefined ? 0 : p[ip]);
  // prettier-ignore
  const gi = (m: number, ip: number) => m === 0 ? p[ip] : m === 1 ? ip : rb + p[ip];
  for (let ip = 0; ip < p.length; ) {
    const i = p[ip];
    const [_, tpm, spm, fpm] = (100000 + i).toString().split('');
    const a = gi(+fpm, ip + 1);
    const b = gi(+spm, ip + 2);
    const c = gi(+tpm, ip + 3);
    const opCode = i % 100;
    if (opCode === 1) {
      p[c] = gv(a) + gv(b);
      ip = ip + 4;
    } else if (opCode === 2) {
      p[c] = gv(a) * gv(b);
      ip = ip + 4;
    } else if (opCode === 3) {
      // eslint-disable-next-line require-atomic-updates
      p[a] = yield new InputSignal();
      ip = ip + 2;
    } else if (opCode === 4) {
      yield new OutputSignal(gv(a));
      ip = ip + 2;
    } else if (opCode === 5) {
      ip = gv(a) !== 0 ? gv(b) : ip + 3;
    } else if (opCode === 6) {
      ip = gv(a) === 0 ? gv(b) : ip + 3;
    } else if (opCode === 7) {
      p[c] = gv(a) < gv(b) ? 1 : 0;
      ip = ip + 4;
    } else if (opCode === 8) {
      p[c] = gv(a) === gv(b) ? 1 : 0;
      ip = ip + 4;
    } else if (opCode === 9) {
      rb = rb + gv(a);
      ip = ip + 2;
    } else if (opCode === 99) {
      break;
    } else {
      break;
    }
  }
  return new CompleteSignal();
}
