import { combinations, getInput } from './util';

const parse = (s: string) => s.split(',').map(w => +w);

function* findDiagnosticCode(
  phaseSettings: number[],
  program: string
): Generator<number[] | false, void, number[]> {
  const p = parse(program);
  // start reading
  const [fm, fmId] = yield false;
  let messageId = 100;
  const seen = new Set<number>([fmId]);
  phaseSettings.push(fm);
  for (let ip = 0; ip < p.length; ) {
    const [i, p1, p2, l] = p.slice(ip, ip + 4);
    // prettier-ignore
    const [spm, fpm] = i > 1100 ? [1, 1] :
                       i > 1000 ? [1, 0] :
                       i >  100 ? [0, 1] : [0, 0];
    const a = fpm ? p1 : p[p1];
    const b = spm ? p2 : p[p2];
    const opCode = i % 100;
    if (opCode === 1) {
      p[l] = a + b;
      ip = ip + 4;
    } else if (opCode === 2) {
      p[l] = a * b;
      ip = ip + 4;
    } else if (opCode === 3) {
      let value = 0;
      if (phaseSettings.length > 0) {
        value = phaseSettings.shift() as number;
      } else {
        // send read signal
        const [m, mid] = yield false;
        value = m;
        seen.add(mid);
      }
      p[p1] = value;
      ip = ip + 2;
    } else if (opCode === 4) {
      // send write signal
      messageId = messageId + 1;
      const [m, mid] = yield [a, messageId];
      if (!seen.has(mid)) {
        phaseSettings.push(m);
        seen.add(mid);
      }
      ip = ip + 2;
    } else if (opCode === 5) {
      ip = a !== 0 ? b : ip + 3;
    } else if (opCode === 6) {
      ip = a === 0 ? b : ip + 3;
    } else if (opCode === 7) {
      p[l] = a < b ? 1 : 0;
      ip = ip + 4;
    } else if (opCode === 8) {
      p[l] = a === b ? 1 : 0;
      ip = ip + 4;
    } else if (opCode === 99) {
      return;
    } else {
      return;
    }
  }
  return;
}

const findHighestSignal = (ip: string) => {
  const program = getInput(ip);
  let max = 0;
  const prevIndex = [4, 0, 1, 2, 3];
  const nextIndex = [1, 2, 3, 4, 0];
  for (const ps of combinations(5, 9)) {
    // prettier-ignore
    const outputs = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    const amplifiers = ps.map(p => findDiagnosticCode([p], program));
    let ai = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const input = outputs[prevIndex[ai]];
      // value == false is read signal
      // value == number is write signal
      const { done, value } = amplifiers[ai].next(input);
      if (done && ai === 4) {
        break;
      }
      const readSignal = value === false;
      if (!done && !readSignal) {
        outputs[ai] = value as number[];
      }
      ai = (readSignal ? prevIndex : nextIndex)[ai];
    }
    max = Math.max(max, outputs[4][0]);
  }
  return max;
};

test('07 Part 2', () => {
  expect(findHighestSignal('07d')).toEqual(139629729);
  expect(findHighestSignal('07e')).toEqual(18216);
  expect(findHighestSignal('07')).toEqual(1518124);
});
