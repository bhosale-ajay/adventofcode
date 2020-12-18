import { mapLine } from './util';

const evalSimple = (ps: string[]) => eval(ps.join(' '));
const sumEquation = /\d+\+\d+/g;
const plusSign = /\+/g;
const sumIt = (e: string) => eval(e);
const evalAdvanced = (e: string) => {
    while (e.match(plusSign)) {
        e = e.replace(sumEquation, sumIt);
    }
    return eval(e);
};

const simple = (parts: string[]): string => {
    let ps: string[] = [];
    let result = '';
    while (parts.length > 0) {
        const p = parts.shift() as string;
        if (p === '(') {
            ps.push(simple(parts));
        } else if (p === ')') {
            return result;
        } else {
            ps.push(p);
        }
        if (ps.length === 3) {
            result = evalSimple(ps);
            ps = [result];
        }
    }
    return result;
};

const advanced = (parts: string[]): string => {
    let e = '';
    while (parts.length > 0) {
        const p = parts.shift() as string;
        if (p === '(') {
            e = e + advanced(parts);
        } else if (p === ')') {
            return evalAdvanced(e);
        } else {
            e = e + p;
        }
    }
    return evalAdvanced(e);
};

const lineToParts = (l: string) => l.replace(/ /g, '').split('');
const solve = (ip: string, algorithm: (ps: string[]) => string): number =>
    mapLine(ip, lineToParts).reduce((acc, ps) => acc + +algorithm(ps), 0);

test('18', () => {
    // 51 + 26 + 437 + 12240 + 13632
    expect(solve('18-test-01', simple)).toEqual(26386);
    expect(solve('18', simple)).toEqual(86311597203806);
    // 51 + 46 + 1445 + 669060 + 23340
    expect(solve('18-test-02', advanced)).toEqual(693942);
    expect(solve('18', advanced)).toEqual(276894767062189);
});
