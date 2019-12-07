import { combinations, getInput } from './util';

const parse = (s: string) => s.split(',').map(w => +w);

const findDiagnosticCode = (inputs: number[], program: string) => {
  const p = parse(program);
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
      p[p1] = inputs.shift() as number;
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

const findHighestSignal = (ip: string) => {
  const program = getInput(ip);
  let max = 0;
  for (const [a, b, c, d, e] of combinations(0, 4)) {
    const oa = findDiagnosticCode([a, 0], program);
    const ob = findDiagnosticCode([b, oa], program);
    const oc = findDiagnosticCode([c, ob], program);
    const od = findDiagnosticCode([d, oc], program);
    const oe = findDiagnosticCode([e, od], program);
    if (oe > max) {
      max = oe;
    }
  }
  return max;
};

test('07 Part 1', () => {
  expect(findHighestSignal('07a')).toEqual(43210);
  expect(findHighestSignal('07b')).toEqual(54321);
  expect(findHighestSignal('07c')).toEqual(65210);
  expect(findHighestSignal('07')).toEqual(65464);
});
