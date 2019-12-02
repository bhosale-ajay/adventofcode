import { map, query } from 'dotless';
import { getInput, sumIt } from './util';

const puzzleInput = getInput('01')
  .split('\n')
  .map(n => +n);

const calFuel = (m: number) => Math.max(Math.floor(m / 3) - 2, 0);

const calAllFuel = (m: number): number => {
  const f = calFuel(m);
  if (f > 0) {
    return f + calAllFuel(f);
  }
  return 0;
};

test('01, Part 1', () => {
  expect(query(puzzleInput, map(calFuel), sumIt)).toEqual(3334297);
});

test('01, Part 2', () => {
  expect(calAllFuel(14)).toEqual(2);
  expect(calAllFuel(1969)).toEqual(966);
  expect(calAllFuel(100756)).toEqual(50346);
  expect(query(puzzleInput, map(calAllFuel), sumIt)).toEqual(4998565);
});
