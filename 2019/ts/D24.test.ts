import { getInput } from './util';

type Area = string[][];
type Eris = string[][];
const [BUG, EMPTY, LS] = ['#', '.', '*'];
const LEVEL = EMPTY.repeat(25);
// prettier-ignore
const adjacentArea = [[+0, -1], [-1, +0], [+1, +0], [+0, +1]];
const [SL, OL, IL] = [0, -1, 1];
// prettier-ignore
const adjacentEris = [
    [[ 7, OL], [11, OL], [ 5, SL], [ 1, SL]], // 0
    [[ 7, OL], [ 0, SL], [ 6, SL], [ 2, SL]], // 1
    [[ 7, OL], [ 1, SL], [ 7, SL], [ 3, SL]], // 2
    [[ 7, OL], [ 2, SL], [ 8, SL], [ 4, SL]], // 3
    [[ 7, OL], [ 3, SL], [ 9, SL], [13, OL]], // 4
    [[ 0, SL], [11, OL], [10, SL], [ 6, SL]], // 5
    [[ 1, SL], [ 5, SL], [11, SL], [ 7, SL]], // 6
    [
        [ 2, SL], [ 6, SL], 
        [ 0, IL], [ 1, IL], [ 2, IL], [ 3, IL], [ 4, IL], 
        [ 8, SL]
    ],                                        // 7
    [[ 3, SL], [ 7, SL], [13, SL], [ 9, SL]], // 8
    [[ 4, SL], [ 8, SL], [14, SL], [13, OL]], // 9
    [[ 5, SL], [11, OL], [15, SL], [11, SL]], // 10
    [
        [ 6, SL], [10, SL], [16, SL],
        [ 0, IL], [ 5, IL], [10, IL], [15, IL], [20, IL] 
    ],                                        // 11
    [],                                       // 12
    [
        [ 8, SL],
        [ 4, IL], [ 9, IL], [14, IL], [19, IL], [24, IL],
        [18, SL], [14, SL] 
    ],                                        // 13
    [[ 9, SL], [13, SL], [19, SL], [13, OL]], // 14
    [[10, SL], [11, OL], [20, SL], [16, SL]], // 15
    [[11, SL], [15, SL], [21, SL], [17, SL]], // 16
    [
        [20, IL], [21, IL], [22, IL], [23, IL], [24, IL],
        [16, SL], [22, SL], [18, SL]
    ],                                        // 17   
    [[13, SL], [17, SL], [23, SL], [19, SL]], // 18
    [[14, SL], [18, SL], [24, SL], [13, OL]], // 19
    [[15, SL], [11, OL], [17, OL], [21, SL]], // 20
    [[16, SL], [20, SL], [17, OL], [22, SL]], // 21
    [[17, SL], [21, SL], [17, OL], [23, SL]], // 22
    [[18, SL], [22, SL], [17, OL], [24, SL]], // 23
    [[19, SL], [23, SL], [17, OL], [13, OL]], // 24
];
const parse = (ip: string) => ip.split('\n').map(l => l.split('')) as Area;
const parseEris = (ip: string) => ip.split(LS).map(l => l.split('')) as Eris;
const countInfestedNIA = (area: Area, x: number, y: number) => {
  // prettier-ignore
  return adjacentArea.filter(([xi, yi]) => 0 <= (y + yi) && 
                             (y + yi) < 5 &&
                             area[(y + yi)][(x + xi)] === BUG).length;
};

const countInfestedNIE = (eris: Eris, l: number, t: number) => {
  // prettier-ignore
  return adjacentEris[t].filter(
    ([nt, lc]) => 0 <= l + lc &&
                  l + lc < eris.length &&
                  eris[l + lc][nt] === BUG).length;
};

const getNextStatus = (current: string, count: number) => {
  let infested = current === BUG;
  if (infested && count !== 1) {
    infested = false;
  } else if (!infested && (count === 1 || count === 2)) {
    infested = true;
  }
  return infested ? BUG : EMPTY;
};

const findRepeatingPattern = (ip: string) => {
  let data = getInput(ip);
  const patterns = new Set<string>();
  while (!patterns.has(data)) {
    const area = parse(data);
    patterns.add(data);
    data = '';
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        data = data + getNextStatus(area[y][x], countInfestedNIA(area, x, y));
      }
      data = data + '\n';
    }
  }
  return data
    .replace(/\n/g, '')
    .split('')
    .reduce((acc, s, i) => acc + (s === BUG ? 2 ** i : 0), 0);
};

const countInfestedTiles = (ip: string, time: number) => {
  let data = getInput(ip).replace(/\n/g, '') + LS;
  let min = 0;
  while (min++ < time) {
    const eris = parseEris(LEVEL + LS + data + LEVEL);
    data = '';
    for (let l = 0; l < eris.length; l++) {
      for (let t = 0; t < eris[l].length; t++) {
        data = data + getNextStatus(eris[l][t], countInfestedNIE(eris, l, t));
      }
      data = data + LS;
    }
  }
  return data.split('').reduce((acc, s) => acc + (s === BUG ? 1 : 0), 0);
};

test('25', () => {
  expect(findRepeatingPattern('24a')).toEqual(2129920);
  expect(findRepeatingPattern('24')).toEqual(18371095);
  expect(countInfestedTiles('24a', 10)).toEqual(99);
  expect(countInfestedTiles('24', 200)).toEqual(2075);
});
/*
    |     |              |     |     
 0  |  1  |      2       |  3  |  4  
    |     |              |     |     
----+-----+--------------+-----+-----
    |     |              |     |     
 5  |  6  |      7       |  8  |  9  
    |     |              |     |     
----+-----+--------------+-----+-----
    |     | 0| 1| 2| 3| 4|     |     
    |     |--+--+--+--+--|     |     
    |     | 5| 6| 7| 8| 9|     |     
    |     |--+--+--+--+--|     |     
10  | 11  |10|11|12|13|14|  13 |  14 
    |     |--+--+--+--+--|     |     
    |     |15|16|17|18|19|     |     
    |     |--+--+--+--+--|     |     
    |     |20|21|22|23|24|     |     
----+-----+--------------+-----+-----
    |     |              |     |     
15  | 16  |      17      |  18 |  19 
    |     |              |     |     
----+-----+--------------+-----+-----
    |     |              |     |     
20  | 21  |      22      |  23 |  24 
    |     |              |     |     
*/
