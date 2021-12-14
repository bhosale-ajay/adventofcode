import { getLines } from './util';

type Rules = Record<string, string[]>;
type PolymerPairCount = Record<string, number[]>;
type PolymerCount = Record<string, number>;

const templateToPairs = (template: string) => {
    const result: string[] = [];
    for (let i = 0; i < template.length - 1; i++) {
        result.push(template[i] + template[i + 1]);
    }
    return result;
};

const lineToRules = (rules: Rules, line: string) => {
    const pair = line[0] + line[1];
    const result1 = line[0] + line[6];
    const result2 = line[6] + line[1];
    rules[pair] = [result1, result2, line[6]];
    return rules;
};

const diffOfMostAndLeast = (polymerCount: PolymerCount) => {
    let mostCommonCount = 0;
    let leastCommonCount = Number.MAX_SAFE_INTEGER;
    for (const p of Object.keys(polymerCount)) {
        const c = polymerCount[p];
        mostCommonCount = mostCommonCount < c ? c : mostCommonCount;
        leastCommonCount = leastCommonCount > c ? c : leastCommonCount;
    }
    return mostCommonCount - leastCommonCount;
};

const solve = (fn: string) => {
    const stepCount = 40;
    const [template, ruleSection] = getLines(fn, '\n\n');
    const pairsAtStep0 = templateToPairs(template);
    const rules = ruleSection.split('\n').reduce(lineToRules, {} as Rules);
    const polymerPairs = Object.keys(rules);
    const polymerPairCount = polymerPairs.reduce((pc, p) => {
        pc[p] = Array.from({ length: stepCount + 1 }, _ => 0);
        return pc;
    }, {} as PolymerPairCount);

    const polymerCount: PolymerCount = {};
    let diffAt10 = 0;
    for (const polymer of template) {
        polymerCount[polymer] =
            (polymerCount[polymer] ? polymerCount[polymer] : 0) + 1;
    }
    for (const pair of pairsAtStep0) {
        polymerPairCount[pair][0] = polymerPairCount[pair][0] + 1;
    }

    for (let step = 1; step <= stepCount; step++) {
        const lastStep = step - 1;
        for (const p of polymerPairs) {
            const lastCount = polymerPairCount[p][lastStep];
            if (lastCount > 0) {
                const [p1, p2, tp] = rules[p];
                polymerPairCount[p1][step] += lastCount;
                polymerPairCount[p2][step] += lastCount;
                polymerCount[tp] =
                    (polymerCount[tp] ? polymerCount[tp] : 0) + lastCount;
            }
        }
        if (step === 10) {
            diffAt10 = diffOfMostAndLeast(polymerCount);
        }
    }
    return [diffAt10, diffOfMostAndLeast(polymerCount)];
};

test('14', () => {
    expect(solve('14-test')).toEqual([1588, 2188189693529]);
    expect(solve('14')).toEqual([2797, 2926813379532]);
});
