import { getInput, Dictionary } from './util';

const [ENTRANCE, WALL] = ['@', '#'];
type Vault = string[][];

class Reachable {
  constructor(readonly distance: number, readonly doors: string[]) {}
  public allClear(doorsOpen: string[]): boolean {
    return this.doors.every(d => doorsOpen.includes(d));
  }
}

class NotReachable {
  constructor(readonly distance = Number.MAX_SAFE_INTEGER) {}
  public allClear(_: string[]): boolean {
    return false;
  }
}

type Link = Reachable | NotReachable;

interface Key {
  loc: number[];
  links: Dictionary<Link>;
}

type Keys = Dictionary<Key>;
const buildKey = (l: number[]): Key => ({ loc: l, links: {} });
const isKey = (c: string) => 'a' <= c && c <= 'z';
const isDoor = (c: string) => 'A' <= c && c <= 'Z';
const parseLine = (
  [v, keys, entrances]: [Vault, Keys, string[]],
  l: string,
  y: number
) => {
  const contents = l.split('');
  contents.forEach((c, x) => {
    if (isKey(c)) {
      keys[c] = buildKey([x, y]);
    } else if (c === ENTRANCE) {
      const entrance = entrances.length.toString();
      keys[entrance] = buildKey([x, y]);
      entrances.push(entrance);
    }
  });
  v.push(contents);
  return [v, keys, entrances] as [Vault, Keys, string[]];
};

// prettier-ignore
const parse = (ip: string) => ip.split('\n').reduce(parseLine, [[], {}, []] as [Vault, Keys, string[]]);
const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
// prettier-ignore
const getNext = ([x, y]: number[]) => dirs.map(([xi, yi]) => [x + xi, y + yi]);
// prettier-ignore
const notWall = (v: Vault, [x, y]: number[]) => 0 <= y && y < v.length && v[y][x] !== WALL && v[y][x] !== undefined;
const km = ([x, y]: number[]) => `K${x}_${y}`;
type Queue = [number, number, number, string[]];
const getLink = (v: Vault, [fx, fy]: number[], [tx, ty]: number[]): Link => {
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
        return new Reachable(d + 1, doors);
      }
      const c = v[ny][nx];
      let nDoors = doors;
      if (isDoor(c)) {
        nDoors = [...doors, c.toLowerCase()];
      }
      queue.push([nx, ny, d + 1, nDoors]);
    }
  }
  return new NotReachable();
};

const findShortestPath = (
  places: string[],
  keys: Keys,
  visited: string[],
  positions: string[], // Current positions for each robots
  distance: number,
  memo: Dictionary<number>
): number => {
  if (places.length === visited.length) {
    return distance;
  }
  const remaining = places.filter(k => !visited.includes(k));
  const mk = positions.join() + ':' + remaining.join();
  if (memo[mk] !== undefined) {
    return memo[mk] + distance;
  }
  let min = Number.MAX_SAFE_INTEGER;
  for (let pi = 0; pi < positions.length; pi++) {
    const current = positions[pi];
    const links = keys[current].links;
    for (const nk of remaining.filter(r => links[r].allClear(visited))) {
      const nPositions = [...positions];
      nPositions[pi] = nk;
      // prettier-ignore
      min = Math.min(
        min,
        findShortestPath(places, keys, [...visited, nk], nPositions, distance + links[nk].distance, memo)
      );
    }
  }
  memo[mk] = min - distance;
  return min;
};

const collectKeys = (ip: string) => {
  const [v, keys, entrances] = parse(ip);
  const places = Object.keys(keys).sort();
  for (let i = 0; i < places.length; i++) {
    const a = keys[places[i]];
    const aName = places[i];
    for (let j = i + 1; j < places.length; j++) {
      const b = keys[places[j]];
      const bName = places[j];
      const link = getLink(v, a.loc, b.loc);
      a.links[bName] = link;
      b.links[aName] = link;
    }
  }
  const positions = [...entrances];
  return findShortestPath(places, keys, entrances, positions, 0, {});
};

const updateInput = (ip: string) => {
  const grid = ip.split('\n').map(l => l.split(''));
  const [ex, ey] = [(grid[0].length + 1) / 2 - 1, (grid.length + 1) / 2 - 1];
  grid[ey - 1][ex - 1] = ENTRANCE;
  grid[ey - 1][ex + 0] = WALL;
  grid[ey - 1][ex + 1] = ENTRANCE;
  grid[ey + 0][ex - 1] = WALL;
  grid[ey + 0][ex + 0] = WALL;
  grid[ey + 0][ex + 1] = WALL;
  grid[ey + 1][ex - 1] = ENTRANCE;
  grid[ey + 1][ex + 0] = WALL;
  grid[ey + 1][ex + 1] = ENTRANCE;
  return grid.map(l => l.join('')).join('\n');
};

const puzzleInput = getInput('18');
test('18 Part 1', () => {
  expect(collectKeys(getInput('18a'))).toEqual(8);
  expect(collectKeys(getInput('18b'))).toEqual(86);
  expect(collectKeys(getInput('18c'))).toEqual(132);
  expect(collectKeys(getInput('18d'))).toEqual(136);
  expect(collectKeys(getInput('18e'))).toEqual(81);
  expect(collectKeys(puzzleInput)).toEqual(4900);
});

test('18 Part 2', () => {
  expect(collectKeys(updateInput(getInput('18f')))).toEqual(8);
  expect(collectKeys(getInput('18g'))).toEqual(24);
  expect(collectKeys(getInput('18h'))).toEqual(32);
  expect(collectKeys(getInput('18i'))).toEqual(72);
  expect(collectKeys(updateInput(puzzleInput))).toEqual(2462);
});
