import { getInput } from './util';

const parse = (s: string) => s.split(',').map(w => +w);
const puzzleInput = getInput('13');
const renderScreen = (): [number, number] => {
  const p = parse(puzzleInput);
  p[0] = 2;
  let [blockTitles, score, nextInput, paddle] = [0, 0, 0, 0];
  let outputs: number[] = [];
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
      p[a] = nextInput;
      ip = ip + 2;
    } else if (opCode === 4) {
      outputs.push(gv(a));
      if (outputs.length === 3) {
        const [x, y, tId] = outputs;
        if (x === -1 && y === 0) {
          score = tId;
        } else if (tId === 3) {
          paddle = x;
        } else if (tId === 4) {
          nextInput = paddle < x ? 1 : paddle === x ? 0 : -1;
        } else if (tId === 2) {
          blockTitles = blockTitles + 1;
        }
        outputs = [];
      }
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
  return [blockTitles, score];
};

test('13', () => {
  const [count, score] = renderScreen();
  expect(count).toEqual(372);
  expect(score).toEqual(19297);
});
