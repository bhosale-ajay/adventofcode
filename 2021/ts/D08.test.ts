import { countBy } from 'dotless';
import { mapLine } from './util';

type NoteEntry = [string[], string[]];
const [a, b, c, d, e, f, g] = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
const allSegments = () => [a, b, c, d, e, f, g];
const segmentsForNumbers: Record<number, string[]> = {
    0: [a, b, c, e, f, g],
    1: [c, f],
    2: [a, c, d, e, g],
    3: [a, c, d, f, g],
    4: [b, c, d, f],
    5: [a, b, d, f, g],
    6: [a, b, d, e, f, g],
    7: [a, c, f],
    8: [a, b, c, d, e, f, g],
    9: [a, b, c, d, f, g],
};

const lineToNoteEntry = (l: string) =>
    l.split(' | ').map(s => s.split(' ')) as NoteEntry;

const getContenders = (): Record<string, string[]> => ({
    a: allSegments(),
    b: allSegments(),
    c: allSegments(),
    d: allSegments(),
    e: allSegments(),
    f: allSegments(),
    g: allSegments(),
});

type SegmentContenders = ReturnType<typeof getContenders>;

const deductionMapFor235: Record<number, string[]> = {
    // if a segment appears for 3 times
    // for 2, 3, and 5 then it means
    // it can be considered a, d, and g segment
    3: [a, d, g],
    2: [c, f],
    1: [b, e],
};

const deductionMapFor069: Record<number, string[]> = {
    3: [a, b, d, f, g],
    2: [c, d, e],
};

const filterContendersForEasyNumbers = (
    patterns: string[],
    con: SegmentContenders,
    num: number,
    length: number
) => {
    const pattern = patterns.filter(p => p.length === length)[0];
    const segmentsForNumber = segmentsForNumbers[num];
    for (const s of allSegments()) {
        const segmentNeeded = segmentsForNumber.includes(s);
        if (segmentNeeded) {
            con[s] = con[s].filter(s => pattern.includes(s));
        } else {
            con[s] = con[s].filter(s => !pattern.includes(s));
        }
    }
};

const filterByDeductionMap = (
    patterns: string[],
    contenders: SegmentContenders,
    dm: Record<number, string[]>,
    length: number
) => {
    const combinedPatterns = patterns
        .filter(p => p.length === length)
        .join('')
        .split('');
    const segmentOccurrence = countBy()(combinedPatterns);
    const contenderMap: Record<string, string[]> = {};
    for (const s of allSegments()) {
        for (const c of dm[segmentOccurrence[s]]) {
            contenderMap[c] = contenderMap[c] || [];
            contenderMap[c].push(s);
        }
    }
    for (const s of allSegments()) {
        contenders[s] = contenders[s].filter(c => contenderMap[s].includes(c));
    }
};

const getOutputDigit = (
    winners: Record<string, string>,
    outputValue: string
): [string, number] => {
    switch (outputValue.length) {
        case 2:
            return ['1', 1];
        case 3:
            return ['7', 1];
        case 4:
            return ['4', 1];
        // case for digit 2, 3, and 5
        case 5:
            // if mapped e segment present it means its 2, cant be 3 or 5
            if (outputValue.includes(winners[e])) return ['2', 0];
            // if mapped b segment present it means its 5, cant be 2 or 3
            if (outputValue.includes(winners[b])) return ['5', 0];
            return ['3', 0];
        // case for digit 0, 6, and 9
        case 6:
            // if mapped d segment missing it means its 0
            if (!outputValue.includes(winners[d])) return ['0', 0];
            // if mapped e segment missing it means its 9
            if (!outputValue.includes(winners[e])) return ['9', 0];
            return ['6', 0];
        default:
            return ['8', 1];
    }
};

const selectWinners = (contenders: SegmentContenders) => {
    const winners: Record<string, string> = {};
    for (const segment of Object.keys(contenders)) {
        const cs = contenders[segment];
        if (cs.length !== 1) {
            throw `Invalid contenders`;
        }
        winners[segment] = cs[0];
    }
    return winners;
};

const solve = (fn: string) => {
    const notes = mapLine(fn, lineToNoteEntry);
    let easyDigitCount = 0;
    let sumOfLines = 0;
    for (const [patterns, ovs] of notes) {
        const contenders = getContenders();
        filterContendersForEasyNumbers(patterns, contenders, 1, 2);
        filterContendersForEasyNumbers(patterns, contenders, 7, 3);
        filterContendersForEasyNumbers(patterns, contenders, 4, 4);
        filterByDeductionMap(patterns, contenders, deductionMapFor235, 5);
        filterByDeductionMap(patterns, contenders, deductionMapFor069, 6);
        const winners = selectWinners(contenders);
        const [lineNumber, lineEasyCount] = ovs
            .map(ov => getOutputDigit(winners, ov))
            .reduce(
                ([accN, accEC], [n, ec]) => [accN + n, accEC + ec],
                ['', 0]
            );
        easyDigitCount = easyDigitCount + lineEasyCount;
        sumOfLines = sumOfLines + +lineNumber;
    }
    return [easyDigitCount, sumOfLines];
};

test('08', () => {
    expect(solve('08-test')).toEqual([26, 61229]);
    expect(solve('08')).toEqual([278, 986179]);
});
