import { getInput, Dictionary, getValue } from './util';

type Space = Dictionary<[string, number, string[]]>;

const getObject = (s: Space, n: string) => getValue(s, n, ['', 0, []]);
const recordAssociation = (space: Space, l: string) => {
  const [pn, cn] = l.split(')');
  const p = getObject(space, pn);
  p[2].push(cn);
  const c = getObject(space, cn);
  c[0] = pn;
  c[2].push(pn);
  return space;
};

// prettier-ignore
const parse = (s: string) => getInput(s).split('\n').reduce(recordAssociation, {} as Space);

const getCount = (space: Space, name: string) => {
  const obj = space[name];
  const pname = obj[0];
  if (pname === '') {
    return 0;
  }
  if (obj[1] === 0) {
    obj[1] = 1 + getCount(space, pname);
  }
  return obj[1];
};

const countDirectNIndirectOrbits = (input: string) => {
  const space = parse(input);
  let checkSum = 0;
  for (const obj in space) {
    checkSum = checkSum + getCount(space, obj);
  }
  return checkSum;
};

const findSanta = (input: string) => {
  const space = parse(input);
  const [YOU, SAN] = ['YOU', 'SAN'];
  const visited = new Set<string>([YOU]);
  const queue = [[YOU, -1]];
  while (queue.length > 0) {
    const [n, hops] = queue.pop() as [string, number];
    const cons = space[n][2];
    for (const con of cons.filter(c => !visited.has(c))) {
      if (con === SAN) {
        return hops;
      }
      visited.add(con);
      queue.push([con, hops + 1]);
    }
  }
  return -1;
};

test('06 Part 1', () => {
  expect(countDirectNIndirectOrbits('06a')).toEqual(42);
  expect(countDirectNIndirectOrbits('06')).toEqual(204521);
});

test('06 Part 2', () => {
  expect(findSanta('06b')).toEqual(4);
  expect(findSanta('06')).toEqual(307);
});
