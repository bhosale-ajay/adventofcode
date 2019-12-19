import { getInput, Dictionary } from './util';

const [ENTRANCE, WALL] = ['@', '#'];
type Vault = string[][];
interface Key {
  l: number[];
  distMap: Dictionary<number>;
  doorMap: Dictionary<string[]>;
}
type Keys = Dictionary<Key>;
const buildKey = (l: number[]): Key => ({ l, distMap: {}, doorMap: {} });
const isKey = (c: string) => 'a' <= c && c <= 'z';
const isDoor = (c: string) => 'A' <= c && c <= 'Z';
const parseLine = (
  [v, [ex, ey], keys]: [Vault, number[], Keys],
  l: string,
  y: number
) => {
  const contents = l.split('');
  contents.forEach((c, x) => {
    if (isKey(c)) {
      keys[c] = buildKey([x, y]);
    } else if (c === ENTRANCE) {
      [ex, ey] = [x, y];
    }
  });
  v.push(contents);
  return [v, [ex, ey], keys] as [Vault, number[], Keys];
};

// prettier-ignore
const parse = (ip: string) => getInput(ip).split('\n').reduce(parseLine, [[], [0, 0], {}] as [Vault, number[], Keys]);
const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
// prettier-ignore
const getNext = ([x, y]: number[]) => dirs.map(([xi, yi]) => [x + xi, y + yi]);
// prettier-ignore
const notWall = (v: Vault, [x, y]: number[]) => 0 <= y && y < v.length && v[y][x] !== WALL;
const km = ([x, y]: number[]) => `K${x}_${y}`;
type Queue = [number, number, number, string[]];
const findDistance = (
  v: Vault,
  [fx, fy]: number[],
  [tx, ty]: number[],
  fn: string,
  tn: string
): [number, string[]] => {
  const queue = [[fx, fy, 0, []]] as Queue[];
  const visited = new Set<string>();
  while (queue.length > 0) {
    const [x, y, d, doors] = queue.shift() as Queue;
    visited.add(km([x, y]));
    const locs = getNext([x, y]).filter(
      l => !visited.has(km(l)) && notWall(v, l)
    );
    for (const [nx, ny] of locs) {
      if (nx === tx && ny === ty) {
        return [d + 1, doors];
      }
      const c = v[ny][nx];
      let nDoors = doors;
      if (isDoor(c)) {
        nDoors = [...doors, c.toLowerCase()];
      }
      queue.push([nx, ny, d + 1, nDoors]);
    }
  }
  throw `Should find ${tn} from ${fn}.`;
};

const findShortestPath = (
  names: string[],
  keys: Keys,
  visited: string[],
  distance: number,
  memo: Dictionary<number>
): number => {
  if (names.length === visited.length - 1) {
    return distance;
  }
  const current = visited[visited.length - 1];
  const keysToVisit = names.filter(
    nk =>
      !visited.includes(nk) &&
      keys[nk].doorMap[current].every(d => visited.includes(d))
  );
  if (keysToVisit.length === 0) {
    return distance;
  }
  const mk = current + ':' + names.filter(k => !visited.includes(k)).join();
  if (memo[mk] !== undefined) {
    return memo[mk] + distance;
  }
  let min = Number.MAX_SAFE_INTEGER;
  for (const nk of keysToVisit) {
    // prettier-ignore
    min = Math.min(min, findShortestPath(names, keys, [...visited, nk], distance + keys[nk].distMap[current], memo));
  }
  memo[mk] = min - distance;
  return min;
};

const part1 = (ip: string) => {
  const [v, [ex, ey], keys] = parse(ip);
  const names = Object.keys(keys).sort();
  let [dist, doors] = [0, [] as string[]];
  for (let i = 0; i < names.length; i++) {
    const a = keys[names[i]];
    const aName = names[i];
    [dist, doors] = findDistance(v, [ex, ey], a.l, aName, ENTRANCE);
    a.distMap[ENTRANCE] = dist;
    a.doorMap[ENTRANCE] = doors;
    for (let j = i + 1; j < names.length; j++) {
      const b = keys[names[j]];
      const bName = names[j];
      [dist, doors] = findDistance(v, a.l, b.l, aName, bName);
      a.distMap[bName] = dist;
      b.distMap[aName] = dist;
      a.doorMap[bName] = doors;
      b.doorMap[aName] = doors;
    }
  }
  return findShortestPath(names, keys, [ENTRANCE], 0, {});
};

test('18 Part 1', () => {
  expect(part1('18a')).toEqual(8);
  expect(part1('18b')).toEqual(86);
  expect(part1('18c')).toEqual(132);
  expect(part1('18d')).toEqual(136);
  expect(part1('18e')).toEqual(81);
  expect(part1('18')).toEqual(4900);
});
