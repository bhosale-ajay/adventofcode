import { matchesToArray } from 'dotless';
import { getLines } from './util';

type Part = { x: number; m: number; a: number; s: number };
type Comparer = (a: number, b: number) => boolean;
type Rule = {
    variable: keyof Part;
    operation: string;
    comparer: Comparer;
    value: number;
    answer: string;
};
type Workflow = Map<string, [Rule[], string]>;
const comparers: Record<string, Comparer> = {
    '<': (a, b) => a < b,
    '>': (a, b) => a > b,
};
const compileRule = (l: string): Rule => {
    const [condition, answer] = l.split(':');
    const variable = condition[0] as keyof Part;
    const operation = condition[1];
    const comparer = comparers[operation];
    const value = +condition.substring(2);
    return { variable, comparer, operation, value, answer };
};
const buildWorkflowMap = (acc: Workflow, l: string): Workflow => {
    const data = l.split('{');
    const rulesData = data[1].split(',');
    const fallback = rulesData.pop()!;
    const rules = rulesData.map(compileRule);
    acc.set(data[0], [rules, fallback.substring(0, fallback.length - 1)]);
    return acc;
};
const parseParts = (l: string): Part => {
    const [x, m, a, s] = matchesToArray(l, /\d+/g, m => +m[0]);
    return { x, m, a, s };
};
const parse = (fn: string): [Workflow, Part[]] => {
    const [wd, pd] = getLines(fn, '\n\n');
    const workflows = wd.split('\n').reduce(buildWorkflowMap, new Map());
    const parts = pd.split('\n').map(parseParts);
    return [workflows, parts];
};
const process = (p: Part, [rules, fallback]: [Rule[], string]) => {
    for (const rule of rules) {
        if (rule.comparer(p[rule.variable], rule.value)) {
            return rule.answer;
        }
    }
    return fallback;
};
const [MIN, MAX] = [0, 1];
type State = {
    name: string;
    x: [number, number];
    m: [number, number];
    a: [number, number];
    s: [number, number];
};
const copyState = (s: State, name: string): State => {
    return {
        name,
        x: [s.x[MIN], s.x[MAX]],
        m: [s.m[MIN], s.m[MAX]],
        a: [s.a[MIN], s.a[MAX]],
        s: [s.s[MIN], s.s[MAX]],
    };
};
const solve = (fn: string) => {
    const [workflows, parts] = parse(fn);
    let p1 = 0;
    for (const part of parts) {
        let wf = 'in';
        while (!(wf == 'A' || wf == 'R')) {
            wf = process(part, workflows.get(wf)!);
        }
        if (wf === 'A') {
            p1 = p1 + part.x + part.m + part.a + part.s;
        }
    }
    const start: State = {
        name: 'in',
        x: [1, 4000],
        m: [1, 4000],
        a: [1, 4000],
        s: [1, 4000],
    };
    const queue: State[] = [start];
    let p2 = 0;
    while (queue.length) {
        const current = queue.shift()!;
        if (current.name === 'R') {
            continue;
        }
        if (current.name === 'A') {
            p2 =
                p2 +
                (1 + current.x[MAX] - current.x[MIN]) *
                    (1 + current.m[MAX] - current.m[MIN]) *
                    (1 + current.a[MAX] - current.a[MIN]) *
                    (1 + current.s[MAX] - current.s[MIN]);
            continue;
        }
        const [rules, fallback] = workflows.get(current.name)!;
        for (const { variable, operation, value, answer } of rules) {
            const next = copyState(current, answer);
            if (operation === '<') {
                next[variable][MAX] = Math.min(next[variable][MAX], value - 1);
                current[variable][MIN] = Math.max(
                    current[variable][MIN],
                    next[variable][MAX] + 1,
                );
            } else {
                next[variable][MIN] = Math.max(next[variable][MIN], value + 1);
                current[variable][MAX] = Math.min(
                    current[variable][MAX],
                    next[variable][MIN] - 1,
                );
            }
            queue.push(next);
        }
        // Pass remaining range to fallback branch
        queue.push(copyState(current, fallback));
    }
    return [p1, p2];
};

test('19', () => {
    expect(solve('19-t1')).toEqual([19114, 167409079868000]);
    expect(solve('19')).toEqual([418498, 123331556462603]);
});
