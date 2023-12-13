import { mapLine } from './util';
import { matchesToArray } from 'dotless';

type PartNumber = {
    line: number;
    start: number;
    end: number;
    value: number;
};

type SchemaSymbol = {
    line: number;
    start: number;
    end: number;
    value: string;
    adjacentParts: PartNumber[];
};

const matchToPartNumber =
    (line: number) =>
    (m: RegExpExecArray): PartNumber => {
        const start = m.index;
        const value = +m[0];
        const end = start + m[0].length - 1;
        return {
            line,
            start,
            end,
            value,
        };
    };

const matchToSymbol =
    (line: number) =>
    (m: RegExpExecArray): SchemaSymbol => {
        const start = m.index;
        const value = m[0];
        const end = start + m[0].length - 1;
        return {
            line,
            start,
            end,
            value,
            adjacentParts: [],
        };
    };

const parseLine = (l: string, li: number): [PartNumber[], SchemaSymbol[]] => {
    const partNumbers = matchesToArray(l, /\d+/g, matchToPartNumber(li));
    const symbols = matchesToArray(l, /[^\d^.]/g, matchToSymbol(li));
    return [partNumbers, symbols];
};

const solve = (fn: string): [number, number] => {
    const [partNumbers, symbols] = mapLine(fn, parseLine).reduce(
        ([accP, accS], [p, s]) => [accP.concat(p), accS.concat(s)],
    );

    const touchedArea = new Set();
    const gearArea = new Map<string, SchemaSymbol>();
    for (const symbol of symbols) {
        const key = `${symbol.line}:${symbol.start}`;
        touchedArea.add(key);
        if (symbol.value == '*') {
            gearArea.set(key, symbol);
        }
    }
    let p1 = 0;
    for (const partNumber of partNumbers) {
        let countedForSum = false;
        for (let li = partNumber.line - 1; li <= partNumber.line + 1; li++) {
            for (
                let si = partNumber.start - 1;
                si <= partNumber.end + 1;
                si++
            ) {
                const key = `${li}:${si}`;
                if (touchedArea.has(key) && !countedForSum) {
                    p1 = p1 + partNumber.value;
                    countedForSum = true;
                }
                if (gearArea.has(key)) {
                    gearArea.get(key)?.adjacentParts.push(partNumber);
                }
            }
        }
    }
    let p2 = 0;
    for (const symbol of symbols) {
        if (symbol.adjacentParts.length == 2) {
            const [pa, pb] = symbol.adjacentParts;
            const gearRatio = pa.value * pb.value;
            p2 = p2 + gearRatio;
        }
    }
    return [p1, p2];
};

test('03', () => {
    expect(solve('03-t1')).toEqual([4361, 467835]);
    expect(solve('03')).toEqual([544433, 76314915]);
});
