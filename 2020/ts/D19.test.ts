import { count } from 'dotless';
import { getLines } from './util';

type Rule = [line: string, match: string];

const computeMatchFC = (rs: Rule[], cn: string) =>
    cn.split(' ').reduce((acc, c) => acc + computeMatch(rs, +c), '(') + ')';

const computeMatch = (rules: Rule[], ri: number): string => {
    const [line, match] = rules[ri];
    if (match !== '') return match;
    if (line.includes('|')) {
        const [left, right] = line.split(' | ');
        const lm = computeMatchFC(rules, left);
        const rm = computeMatchFC(rules, right);
        rules[ri][1] = `(${lm}|${rm})`;
    } else {
        rules[ri][1] = computeMatchFC(rules, line);
    }
    return rules[ri][1];
};

const parse = (ip: string): [Rule[], string[]] => {
    const messages: string[] = [];
    const rules: Rule[] = [];
    for (const l of getLines(ip)) {
        const rsi = l.indexOf(': ');
        if (rsi > -1) {
            const ri = +l.substring(0, rsi);
            const match = l.includes('a') ? 'a' : l.includes('b') ? 'b' : '';
            rules[ri] = [l.substring(rsi + 2), match];
        } else if (l.length > 0) {
            messages.push(l);
        }
    }
    computeMatch(rules, 0);
    return [rules, messages];
};

const solve = () => {
    const [rs, ms] = parse('19');
    const rule0 = RegExp('^' + rs[0][1] + '$');
    const followsRule0 = count((l: string) => rule0.test(l));
    const p1 = followsRule0(ms);
    const rule42n31 = new RegExp(
        '^(?<r42>(' + rs[42][1] + ')+)(?<r31>(' + rs[31][1] + ')+)$'
    );
    const rule31 = new RegExp(rs[31][1], 'g');
    const rule42 = new RegExp(rs[42][1], 'g');
    let p2 = 0;
    for (const m of ms) {
        const matches = rule42n31.exec(m);
        if (matches) {
            const { groups } = matches as any;
            const matches31 = groups.r31.match(rule31).length;
            const matches42 = groups.r42.match(rule42).length;
            if (matches42 > matches31) {
                p2++;
            }
        }
    }
    return [p1, p2];
};

test('19', () => {
    expect(solve()).toEqual([132, 306]);
});
