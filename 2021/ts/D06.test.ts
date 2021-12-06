import { mapLineToNumber } from './util';

const countFish = (fs: number[]) => fs.reduce((c, f) => c + f);
const solve = (fn: string): [number, number] => {
    const dayWiseFishCount = Array(9).fill(0);
    const school = mapLineToNumber(fn, ',');
    school.forEach(f => dayWiseFishCount[f]++);
    let [p1, p2] = [0, 0];
    for (let day = 1; day <= 256; day++) {
        const fishReadyToCreate = dayWiseFishCount.shift() as number;
        // new born
        dayWiseFishCount[8] = fishReadyToCreate;
        // adult join back to cycle
        dayWiseFishCount[6] = dayWiseFishCount[6] + fishReadyToCreate;
        if (day === 80) {
            p1 = countFish(dayWiseFishCount);
        }
    }
    p2 = countFish(dayWiseFishCount);
    return [p1, p2];
};

test('06', () => {
    expect(solve('06-test')).toEqual([5934, 26984457539]);
    expect(solve('06')).toEqual([351092, 1595330616005]);
});
