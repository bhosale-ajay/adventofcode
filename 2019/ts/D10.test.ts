import { getInput, Dictionary, getValue } from './util';

interface Asteroid {
  x: number;
  y: number;
  dc: number;
  views: Set<number>;
}

const lineToAsteroid = (acc: Asteroid[], l: string, y: number) => {
  l.split('').forEach((c, x) => {
    if (c === '#') {
      acc.push({ x, y, dc: 0, views: new Set<number>() });
    }
  });
  return acc;
};

// prettier-ignore
const parse = (ip: string) => getInput(ip).split('\n').reduce(lineToAsteroid, [] as Asteroid[]);

const calAngle = (a: Asteroid, b: Asteroid) => {
  const d = Math.atan2(a.y - b.y, a.x - b.x) * (180 / Math.PI) + 90;
  return d < 0 ? d + 360 : d;
};
const calSlope = (a: Asteroid, b: Asteroid) => (a.y - b.y) / (a.x - b.x);
// prettier-ignore
const calDistance = (a: Asteroid, b: Asteroid) => Math.hypot(a.x - b.x, a.y - b.y);
const solve = (ip: string) => {
  const asteroids = parse(ip);
  let max = 0;
  for (let i = 0; i < asteroids.length; i++) {
    const a = asteroids[i];
    for (let j = i + 1; j < asteroids.length; j++) {
      const b = asteroids[j];
      const view = calSlope(a, b);
      if (!a.views.has(view)) {
        a.views.add(view);
        max = Math.max(max, ++a.dc, ++b.dc);
      }
    }
  }
  const toKill = asteroids.length - 1;
  if (toKill < 200) {
    return [max, 0];
  }
  const blId = asteroids.findIndex(a => a.dc === max);
  const bl = asteroids[blId];
  const belt: Dictionary<number[][]> = {};
  for (let i = 0; i < asteroids.length; i++) {
    if (blId === i) {
      continue;
    }
    const b = asteroids[i];
    const distance = calDistance(b, bl);
    const angle = calAngle(b, bl).toString();
    const lineOfSight = getValue(belt, angle, []);
    lineOfSight.push([distance, i]);
  }

  const angles = Object.keys(belt).sort((a, b) => (+a > +b ? 1 : -1));
  for (const angle of angles) {
    belt[angle].sort((a, b) => (a[0] > b[0] ? 1 : -1));
  }

  let killed = 0;
  while (killed < toKill) {
    for (const angle of angles) {
      if (belt[angle].length > 0) {
        const [_, ai] = belt[angle].shift() as number[];
        killed = killed + 1;
        if (killed === 200) {
          return [max, asteroids[ai].x * 100 + asteroids[ai].y];
        }
      }
    }
  }
  return [max, -1];
};

test('10', () => {
  expect(solve('10a')).toEqual([8, 0]);
  expect(solve('10b')).toEqual([33, 0]);
  expect(solve('10c')).toEqual([35, 0]);
  expect(solve('10d')).toEqual([41, 0]);
  expect(solve('10e')).toEqual([210, 802]);
  expect(solve('10')).toEqual([227, 604]);
});
