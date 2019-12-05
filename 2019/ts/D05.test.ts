import { getInput } from './util';
import { privateName } from '@babel/types';

const parse = (s: string) => s.split(',').map(w => +w);
const puzzleInput = getInput('05');

const findDiagnosticCode = (input: number) => {
  const p = parse(puzzleInput);
  let diagnosticCode = 0;
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
      p[p1] = input;
      ip = ip + 2;
    } else if (opCode === 4) {
      diagnosticCode = a;
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
      return diagnosticCode;
    } else {
      return 0;
    }
  }
  return 0;
};

test('05', () => {
  expect(findDiagnosticCode(1)).toEqual(4511442);
  expect(findDiagnosticCode(5)).toEqual(12648139);
});
