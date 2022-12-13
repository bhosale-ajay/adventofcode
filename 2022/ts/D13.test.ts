import { getLines } from './util';

type Data = number | number[];
type Packet = Data[];
type Pair = [Packet, Packet];
type CompareResult = true | false | undefined;
const lineToPair = (l: string) =>
    l.split('\n').map(p => eval(p) as Data) as Pair;
const parse = (fn: string): Pair[] => getLines(fn, '\n\n').map(lineToPair);
const compare = (left: Data | Packet, right: Data | Packet): CompareResult => {
    const leftIsNumber = typeof left === 'number';
    const rightIsNumber = typeof right === 'number';
    if (leftIsNumber && rightIsNumber) {
        if (left < right) {
            return true;
        }
        if (left > right) {
            return false;
        }
    } else if (!leftIsNumber && !rightIsNumber) {
        const lli = left.length - 1;
        const rli = right.length - 1;
        let i = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (lli < i && i <= rli) {
                return true;
            } else if (i <= lli && rli < i) {
                return false;
            } else if (lli < i && rli < i) {
                return;
            }
            const nr = compare(left[i], right[i]);
            if (nr !== undefined) {
                return nr;
            }
            i++;
        }
    } else if (leftIsNumber && !rightIsNumber) {
        return compare([left], right);
    } else if (!leftIsNumber && rightIsNumber) {
        return compare(left, [right]);
    }
};
const concatPackets = (acc: Packet[], pair: Pair) => {
    acc.push(pair[0]);
    acc.push(pair[1]);
    return acc;
};
const sortPackets = (a: Packet, b: Packet) => (compare(a, b) ? -1 : 1);
const solve = (fn: string) => {
    const pairs = parse(fn);
    const p1 = pairs.reduce(
        (acc, p, i) => acc + (compare(p[0], p[1]) ? i + 1 : 0),
        0
    );
    const dividerPackets: Packet[] = [[[2]], [[6]]];
    const sortedPackets = pairs
        .reduce(concatPackets, dividerPackets)
        .sort(sortPackets)
        .map(p => p.toString());
    const posOf2 = sortedPackets.indexOf('2') + 1;
    const posOf6 = sortedPackets.indexOf('6') + 1;
    return [p1, posOf2 * posOf6];
};

test('13', () => {
    expect(solve('13-test')).toEqual([13, 140]);
    expect(solve('13')).toEqual([6272, 22288]);
});
