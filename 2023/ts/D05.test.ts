import { getLines, toNumber } from './util';

type AlmanacMap = [number, number, number];
type Category = AlmanacMap[];
type Range = [number, number];
const mapToAlmanacMap = (ml: string) =>
    ml.split(' ').map(toNumber) as AlmanacMap;
const mapToCategory = (cl: string): Category =>
    cl.split('\n').slice(1).map(mapToAlmanacMap);
const searchNumberInAlmanacMap = (
    [d, s, l]: AlmanacMap,
    n: number,
): number | undefined => {
    const diff = n - s;
    return 0 <= diff && diff < l ? d + diff : undefined;
};

const mapNumber = (n: number, c: Category) => {
    for (const m of c) {
        const searchResult = searchNumberInAlmanacMap(m, n);
        if (searchResult !== undefined) {
            return searchResult;
        }
    }
    return n;
};

const searchRangeInAlmanacMap = (
    [d, s, l]: AlmanacMap,
    [rs, re]: Range,
): (Range | undefined)[] => {
    const result: (Range | undefined)[] = [];
    const [mrs, mre] = [s, s + l - 1];
    if (rs < mrs) {
        result.push([rs, Math.min(re, mrs - 1)]);
    } else {
        result.push(undefined);
    }
    if (mrs <= re && rs <= mre) {
        result.push([
            searchNumberInAlmanacMap([d, s, l], Math.max(mrs, rs))!,
            searchNumberInAlmanacMap([d, s, l], Math.min(mre, re))!,
        ]);
    } else {
        result.push(undefined);
    }
    if (mre < re) {
        result.push([Math.max(mre + 1, rs), re]);
    } else {
        result.push(undefined);
    }
    return result;
};
const mapRange = (range: Range, c: Category): Range[] => {
    const result: Range[] = [];
    let toSearch = [range];
    for (const m of c) {
        const unmatched: Range[] = [];
        toSearch.forEach((r: Range) => {
            const [unmatchedHead, matched, unmatchedTail] =
                searchRangeInAlmanacMap(m, r);
            if (unmatchedHead) {
                unmatched.push(unmatchedHead);
            }
            if (matched) {
                result.push(matched);
            }
            if (unmatchedTail) {
                unmatched.push(unmatchedTail);
            }
        });
        toSearch = unmatched;
        if (toSearch.length === 0) {
            break;
        }
    }
    result.push(...toSearch);
    return result;
};
const mapRanges = (ranges: Range[], c: Category) =>
    ranges.map(r => mapRange(r, c)).flat();

const solve = (fn: string): [number, number] => {
    const [seedLine, ...categoryLines] = getLines(fn, '\n\n');
    const seeds = seedLine.split(': ')[1].split(' ').map(toNumber);
    const categories: Category[] = categoryLines.map(mapToCategory);

    const p1 = seeds.reduce(
        (c, seed) => Math.min(c, categories.reduce(mapNumber, seed)),
        Number.MAX_SAFE_INTEGER,
    );
    const arrayOfRanges = seeds.reduce((acc, s, i) => {
        if (i % 2 === 1) {
            return acc;
        }
        acc.push([[s, s + seeds[i + 1] - 1]]);
        return acc;
    }, [] as Range[][]);
    const mappedRanges = arrayOfRanges
        .map(sr => categories.reduce(mapRanges, sr))
        .flat();
    const p2 = mappedRanges.reduce(
        (c, r) => Math.min(c, r[0]),
        Number.MAX_SAFE_INTEGER,
    );
    return [p1, p2];
};

test('05', () => {
    expect(solve('05-t1')).toEqual([35, 46]);
    expect(solve('05')).toEqual([227653707, 78775051]);
});
