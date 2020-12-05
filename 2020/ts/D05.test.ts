import { ascendingBy } from 'dotless';
import { mapLine } from './util';

const expression = /F|B|L|R/g;
const binaryMap = { F: 0, B: 1, L: 0, R: 1 };

const parseBoardingPass = (line: string): number => {
    const binary = line.replace(expression, c => (binaryMap as any)[c]);
    const row = parseInt(binary.substr(0, 7), 2);
    const col = parseInt(binary.substr(7), 2);
    return row * 8 + col;
};

const findSeat = (): [maxSeat: number, missingSeat: number] => {
    const seats = mapLine('05', parseBoardingPass);
    seats.sort(ascendingBy());
    const lastSeat = seats.length - 1;
    let missingSeat = -1;
    for (let seat = 0; seat < lastSeat; seat++) {
        if (seats[seat + 1] - seats[seat] === 2) {
            missingSeat = seats[seat] + 1;
            break;
        }
    }
    return [seats[lastSeat], missingSeat];
};

test('05', () => {
    expect(findSeat()).toEqual([885, 623]);
});
