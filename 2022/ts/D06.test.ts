import { getLines } from './util';

const t1 = 'mjqjpqmgbljsphdztnvjfqwrcgsmlb';
const t2 = 'bvwbjplbgvbhsrlpgdmjqwftvncz';
const t3 = 'nppdvjthqldpwncqszvftbrmjlhg';
const t4 = 'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg';
const t5 = 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw';
const a1 = getLines('06')[0];

const findDuplicatePosition = (marker: string) => {
    for (let i = 0; i < marker.length - 1; i++) {
        for (let j = i + 1; j < marker.length; j++) {
            if (marker[i] === marker[j]) {
                return i;
            }
        }
    }
    return -1;
};

const solve = (buffer: string, size: number) => {
    let marker = buffer.slice(0, size);
    let foundAt = 0;
    for (let i = size; i < buffer.length; i++) {
        if (foundAt === 0) {
            foundAt = findDuplicatePosition(marker);
            if (foundAt === -1) {
                return i;
            }
        }
        marker = marker.slice(1) + buffer[i];
        foundAt = Math.max(0, foundAt - 1);
    }
    return -1;
};

test('06', () => {
    expect(solve(t1, 4)).toEqual(7);
    expect(solve(t2, 4)).toEqual(5);
    expect(solve(t3, 4)).toEqual(6);
    expect(solve(t4, 4)).toEqual(10);
    expect(solve(t5, 4)).toEqual(11);
    expect(solve(a1, 4)).toEqual(1598);
    expect(solve(t1, 14)).toEqual(19);
    expect(solve(t2, 14)).toEqual(23);
    expect(solve(t3, 14)).toEqual(23);
    expect(solve(t4, 14)).toEqual(29);
    expect(solve(t5, 14)).toEqual(26);
    expect(solve(a1, 14)).toEqual(2414);
});
