import { range } from 'dotless';

const countValidPasswords = (from: number, to: number) => {
  let [p1, p2] = [0, 0];
  // TODO :: Change range for i5 based on from and to
  for (const i5 of range(2, 7)) {
    for (const i4 of range(i5, 9)) {
      for (const i3 of range(i4, 9)) {
        for (const i2 of range(i3, 9)) {
          for (const i1 of range(i2, 9)) {
            for (const i0 of range(i1, 9)) {
              // prettier-ignore
              const currentNum = +(i5 + '' + i4 + '' + i3 + '' + i2 + '' + i1 + '' + i0);
              if (currentNum < from || to < currentNum) {
                continue;
              }
              // prettier-ignore
              if (i5 === i4 || i4 === i3 || i3 === i2 || i2 === i1 || i1 === i0) {
                p1 = p1 + 1;
              }
              if (
                (i5 === i4 && i4 !== i3) ||
                (i4 === i3 && i5 !== i4 && i3 !== i2) ||
                (i3 === i2 && i4 !== i3 && i2 !== i1) ||
                (i2 === i1 && i3 !== i2 && i1 != i0) ||
                (i1 === i0 && i2 !== i1)
              ) {
                p2 = p2 + 1;
              }
            }
          }
        }
      }
    }
  }
  return [p1, p2];
};

test('04', () => {
  expect(countValidPasswords(240920, 789857)).toEqual([1154, 750]);
});
