import { getInput } from './util';

const parse = (s: string) => s.split(',').map(w => +w);
const puzzleInput = getInput('09');

const findDiagnosticCode = (input: number, program: string) => {
  const p = parse(program);
  let diagnosticCode = 0;
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
      p[a] = input;
      ip = ip + 2;
    } else if (opCode === 4) {
      diagnosticCode = gv(a);
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
      return diagnosticCode;
    } else {
      return 0;
    }
  }
  return 0;
};

test('09', () => {
  expect(findDiagnosticCode(1, puzzleInput)).toEqual(3460311188);
  expect(findDiagnosticCode(2, puzzleInput)).toEqual(42202);
});
