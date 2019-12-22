import { getInput } from './util';

const puzzleInput = getInput('22').split('\n');
const DWI = 'deal with increment ';
const DINS = 'deal into new stack';
const CUT = 'cut ';

const dealWithIncrement = (p: number, dl: number, inc: number) => {
  return (((p - 1) * inc) % dl) + 1;
};

const dealIntoNewStack = (p: number, dl: number) => dl - p + 1;

const cut = (p: number, dl: number, cutBy: number) => {
  if (cutBy < 0) {
    cutBy = dl + cutBy;
  }
  return p > cutBy ? p - cutBy : dl - cutBy + p;
};

const processInstructions = (ins: string[], card: number, dl: number) => {
  let p = card + 1;
  ins.forEach(l => {
    if (l.startsWith(DWI)) {
      p = dealWithIncrement(p, dl, +l.replace(DWI, ''));
    } else if (l.startsWith(DINS)) {
      p = dealIntoNewStack(p, dl);
    } else if (l.startsWith(CUT)) {
      p = cut(p, dl, +l.replace(CUT, ''));
    } else {
      throw `Invalid line.`;
    }
  });
  return p - 1;
};

// based on answer from u/nutki2
const gcdExtended = (a: number, b: number) => {
  let [x, y, u, v] = [0, 1, 1, 0];
  while (a !== 0) {
    const q = Math.floor(b / a);
    [x, y, u, v] = [u, v, x - u * q, y - v * q];
    [a, b] = [b % a, a];
  }
  return [b, x, y];
};

const modInverse = (a: number, m: number) => {
  const [g, x] = gcdExtended(a, m);
  if (g !== 1) throw 'Bad mod inverse';
  return (x + m) % m;
};

const modDiv = (a: number, b: number, m: number) =>
  Number((BigInt(a) * BigInt(modInverse(b, m))) % BigInt(m));

const mulMod = (a: number, b: number, m: number) =>
  Number((BigInt(a) * BigInt(b)) % BigInt(m));

const processGiantDeck = (ins: string[], p: number) => {
  const dl = 119315717514047;
  let times = 101741582076661;
  let [a, b] = ins.reduceRight(
    ([a, b]: number[], l: string) => {
      if (l.startsWith(DWI)) {
        const increment = +l.replace(DWI, '');
        return [modDiv(a, increment, dl), modDiv(b, increment, dl)];
      } else if (l.startsWith(DINS)) {
        return [(dl - a) % dl, (dl + dl - b - 1) % dl];
      } else if (l.startsWith(CUT)) {
        const cutBy = +l.replace(CUT, '');
        return [a, (((b + cutBy) % dl) + dl) % dl];
      } else {
        throw `Invalid line.`;
      }
    },
    [1, 0]
  );
  while (times > 0) {
    if (times % 2 > 0) {
      p = (mulMod(p, a, dl) + b) % dl;
    }
    [a, b] = [mulMod(a, a, dl), (mulMod(a, b, dl) + b) % dl];
    times = Math.floor(times / 2);
  }
  return p;
};

const testInstructions = (instructions: string[], expected: string) => {
  const dl = 10;
  const cards = [];
  for (let i = 0; i < dl; i++) {
    cards[processInstructions(instructions, i, dl)] = i;
  }
  expect(cards.join(' ')).toEqual(expected);
};

test('22 Tests', () => {
  testInstructions(['deal into new stack'], '9 8 7 6 5 4 3 2 1 0');
  testInstructions(['cut 3'], '3 4 5 6 7 8 9 0 1 2');
  testInstructions(['cut -4'], '6 7 8 9 0 1 2 3 4 5');
  testInstructions(['deal with increment 3'], '0 7 4 1 8 5 2 9 6 3');
  testInstructions(
    ['deal with increment 7', 'deal into new stack', 'deal into new stack'],
    '0 3 6 9 2 5 8 1 4 7'
  );
  testInstructions(
    ['cut 6', 'deal with increment 7', 'deal into new stack'],
    '3 0 7 4 1 8 5 2 9 6'
  );
  testInstructions(
    ['deal with increment 7', 'deal with increment 9', 'cut -2'],
    '6 3 0 7 4 1 8 5 2 9'
  );
  // prettier-ignore
  testInstructions(
    ['deal into new stack', 'cut -2', 'deal with increment 7', 
     'cut 8', 'cut -4', 'deal with increment 7', 'cut 3', 
     'deal with increment 9', 'deal with increment 3', 'cut -1'],
    '9 2 5 8 1 4 7 0 3 6'
  );
});

test('22', () => {
  expect(processInstructions(puzzleInput, 2019, 10007)).toEqual(2496);
  expect(processGiantDeck(puzzleInput, 2020)).toEqual(56894170832118);
});
