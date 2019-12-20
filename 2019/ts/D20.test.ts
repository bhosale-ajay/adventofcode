import { getInput, Dictionary, getValue } from './util';
type Maze = string[][];
type Portals = Dictionary<number[][]>;
const [LEFT_RIGHT, UP_DOWN] = [0, 1];
const [SPACE, PASSAGE] = [' ', '.'];
const [MIN, MAX] = [0, 200];
// prettier-ignore
const parse = (ip: string) => getInput(ip).split('\n').map(l => l.split('')) as Maze;
const isMazeIndicator = (c: string) => 'A' <= c && c <= 'Z';
const getContent = (maze: Maze, x: number, y: number) => {
  if (y < 0 || maze.length <= y || x < 0 || maze[y].length <= x) {
    return SPACE;
  }
  return maze[y][x];
};
// prettier-ignore
const isPassage = (maze: Maze, x: number, y: number) => getContent(maze, x, y) === PASSAGE;
const km = (x: number, y: number) => `K${x}_${y}`;
const kml = (x: number, y: number, l: number) => `K${x}_${y}_${l}`;
const tryMaze = (
  maze: Maze,
  x: number,
  y: number,
  direction: number
): [string, number, number] | null => {
  const [xd, yd] = direction === LEFT_RIGHT ? [1, 0] : [0, 1];
  const name = getContent(maze, x + 1 * xd, y + 1 * yd);
  if (!isMazeIndicator(name)) {
    return null;
  }
  if (isPassage(maze, x - 1 * xd, y - 1 * yd)) {
    return [name, x - 1 * xd, y - 1 * yd];
  }
  if (isPassage(maze, x + 2 * xd, y + 2 * yd)) {
    return [name, x + 2 * xd, y + 2 * yd];
  }
  throw `This should never happen`;
};
// prettier-ignore
const dirs = [[0, -1],[0, 1],[-1, 0],[1, 0]];
const getNext = (
  edges: Dictionary<number[]>,
  x: number,
  y: number,
  level: number
) => {
  const result = dirs.map(([xi, yi]) => [x + xi, y + yi, level]);
  const key = km(x, y);
  if (edges[key]) {
    const [ex, ey, lc] = edges[key];
    result.push([ex, ey, lc + level]);
  }
  return result;
};

const walk = (ip: string, recursive = false) => {
  const maze = parse(ip);
  const portals: Portals = {};
  let [minX, minY, maxX, maxY] = [MAX, MAX, MIN, MIN];
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      const c = maze[y][x];
      if (isMazeIndicator(c)) {
        const result =
          tryMaze(maze, x, y, LEFT_RIGHT) || tryMaze(maze, x, y, UP_DOWN);
        if (result !== null) {
          const [np, mx, my] = result;
          const name = c + np;
          const portal = getValue(portals, name, []);
          portal.push([mx, my]);
          [minX, minY] = [Math.min(mx, minX), Math.min(my, minY)];
          [maxX, maxY] = [Math.max(mx, maxX), Math.max(my, maxY)];
        }
      }
    }
  }
  const edges: Dictionary<number[]> = {};
  // prettier-ignore
  const isOuter = (ex: number, ey: number) => ex == minX || ex == maxX || ey == minY || ey == maxY;
  for (const n of Object.keys(portals)) {
    if (portals[n].length > 1) {
      const [[xf, yf], [xt, yt]] = portals[n];
      edges[km(xf, yf)] = [xt, yt, recursive ? (isOuter(xf, yf) ? -1 : 1) : 0];
      edges[km(xt, yt)] = [xf, yf, recursive ? (isOuter(xt, yt) ? -1 : 1) : 0];
    }
  }
  const [fx, fy] = portals['AA'][0];
  const [tx, ty] = portals['ZZ'][0];
  const queue = [[fx, fy, 0, 0]] as number[][];
  const visited = new Set<string>();
  while (queue.length > 0) {
    const [x, y, d, l] = queue.shift() as number[];
    const key = kml(x, y, l);
    visited.add(key);
    for (const [nx, ny, nl] of getNext(edges, x, y, l)) {
      if (
        nl === -1 ||
        !isPassage(maze, nx, ny) ||
        visited.has(kml(nx, ny, nl))
      ) {
        continue;
      }
      if (nx === tx && ny === ty && nl === 0) {
        return d + 1;
      }
      queue.push([nx, ny, d + 1, nl]);
    }
  }
  return -1;
};

test('20', () => {
  expect(walk('20a')).toEqual(23);
  expect(walk('20b')).toEqual(58);
  expect(walk('20')).toEqual(696);
  expect(walk('20c', true)).toEqual(396);
  expect(walk('20', true)).toEqual(7538);
});
