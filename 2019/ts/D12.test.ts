import { matchesToArray } from 'dotless';
import { getInput } from './util';

const regex = /<x=([-\d]*),\sy=([-\d]*),\sz=([-\d]*)>/g;
type Moon = number[];
type Axis = 0 | 1 | 2;
// prettier-ignore
const parse = (ip: string) => matchesToArray(getInput(ip), regex, m => [+m[1], +m[2], +m[3], 0, 0, 0]) as Moon[];
const applyGravity = (m1: Moon, m2: Moon, ax: Axis) => {
  const impact = m1[ax] > m2[ax] ? -1 : m1[ax] === m2[ax] ? 0 : 1;
  m1[ax + 3] += impact;
  m2[ax + 3] += impact * -1;
};
const applyVelocity = (m: Moon, ax: Axis) => {
  m[ax] += m[ax + 3];
};
const calPE = (m: Moon) => Math.abs(m[0]) + Math.abs(m[1]) + Math.abs(m[2]);
const calKE = (m: Moon) => Math.abs(m[3]) + Math.abs(m[4]) + Math.abs(m[5]);
// prettier-ignore
const atFirstPosition = (m1: Moon, m2: Moon, ax: Axis) => m1[ax] === m2[ax] && m1[ax + 3] === m2[ax + 3];
const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

function takeStep(moons: number[][]) {
  for (let i = 0; i < moons.length; i++) {
    for (let j = i + 1; j < moons.length; j++) {
      applyGravity(moons[i], moons[j], 0);
      applyGravity(moons[i], moons[j], 1);
      applyGravity(moons[i], moons[j], 2);
    }
  }
  for (let i = 0; i < moons.length; i++) {
    applyVelocity(moons[i], 0);
    applyVelocity(moons[i], 1);
    applyVelocity(moons[i], 2);
  }
}

const calTotalEnergy = (ip: string, steps: number) => {
  const moons = parse(ip);
  for (let stepCounter = 0; stepCounter < steps; stepCounter++) {
    takeStep(moons);
  }
  return moons.reduce((acc, m) => acc + calPE(m) * calKE(m), 0);
};

const findStepsToReachFirstState = (ip: string) => {
  const moons = parse(ip);
  const firstState = parse(ip);
  const axisReachedStatus = [false, false, false];
  const notReached = (ai: number) => axisReachedStatus[ai] === false;
  const axes = [0, 1, 2] as Axis[];
  const stepsToReachFirstState = [0, 0, 0];
  while (axes.some(notReached)) {
    takeStep(moons);
    for (const axis of axes.filter(notReached)) {
      stepsToReachFirstState[axis]++;
      axisReachedStatus[axis] = moons.every((m, mi) =>
        atFirstPosition(m, firstState[mi], axis)
      );
    }
  }
  return stepsToReachFirstState.reduce(lcm);
};

test('12 - Part 1', () => {
  expect(calTotalEnergy('12a', 10)).toEqual(179);
  expect(calTotalEnergy('12b', 100)).toEqual(1940);
  expect(calTotalEnergy('12', 1000)).toEqual(10189);
});

test('12 - Part 2', () => {
  expect(findStepsToReachFirstState('12a')).toEqual(2772);
  expect(findStepsToReachFirstState('12b')).toEqual(4686774924);
  expect(findStepsToReachFirstState('12')).toEqual(469671086427712);
});
