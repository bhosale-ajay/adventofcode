import { matchesToArray } from 'dotless';
import { getInput } from './util';

type RuleChecker = (v: number) => boolean;
type Rule = [one: RuleChecker, two: RuleChecker, name: string];
type Ticket = number[];
const lineToTicket = (l: string) => l.split(',').map(n => +n) as Ticket;
const ruleCheckerFactory = (f: number, t: number): RuleChecker => (v: number) =>
    f <= v && v <= t;
const regex = /((.*): (\d+)-(\d+) or (\d+)-(\d+))|(\S[0-9,]+)/gm;
const parse = (): [Rule[], Ticket[]] => {
    const tokens = matchesToArray(getInput('16'), regex);
    const rules: Rule[] = [];
    const tickets: Ticket[] = [];
    for (const token of tokens) {
        if (token[2] !== undefined) {
            rules.push([
                ruleCheckerFactory(+token[3], +token[4]),
                ruleCheckerFactory(+token[5], +token[6]),
                token[2],
            ]);
        } else {
            tickets.push(lineToTicket(token[7]));
        }
    }
    return [rules, tickets];
};
const buildCandidateMap = (fieldCount: number) => {
    const candidates: Map<string, number>[] = [];
    for (let fi = 0; fi < fieldCount; fi++) {
        candidates.push(new Map<string, number>());
    }
    return candidates;
};
const solve = () => {
    const [rules, tickets] = parse();
    const fieldCount = tickets[0].length;
    const candidates = buildCandidateMap(fieldCount);
    const yourTicket = tickets[0];
    let validTicketCount = 0;
    let errorRate = 0;
    toNextTicket: for (const ticket of tickets) {
        toNextField: for (const f of ticket) {
            for (const [fr, sr] of rules) {
                if (fr(f) || sr(f)) {
                    continue toNextField;
                }
            }
            errorRate = errorRate + f;
            continue toNextTicket;
        }
        validTicketCount = validTicketCount + 1;
        for (let fi = 0; fi < fieldCount; fi++) {
            const fv = ticket[fi];
            for (const [fr, sr, name] of rules) {
                if (fr(fv) || sr(fv)) {
                    const cc = candidates[fi].get(name);
                    if (cc === undefined) {
                        candidates[fi].set(name, 1);
                    } else {
                        candidates[fi].set(name, cc + 1);
                    }
                }
            }
        }
    }
    const winners: string[] = [];
    for (const fieldCandidates of candidates) {
        for (const key of fieldCandidates.keys()) {
            const claims = fieldCandidates.get(key) as number;
            if (claims < validTicketCount) {
                fieldCandidates.delete(key);
            }
        }
        if (fieldCandidates.size === 1) {
            const [winner] = fieldCandidates.keys();
            winners.push(winner);
        }
    }
    while (winners.length > 0) {
        const claimedElseWhere = winners.shift() as string;
        for (const fieldCandidates of candidates) {
            if (
                fieldCandidates.size > 1 &&
                fieldCandidates.has(claimedElseWhere)
            ) {
                fieldCandidates.delete(claimedElseWhere);
                if (fieldCandidates.size === 1) {
                    const [winnerForField] = fieldCandidates.keys();
                    winners.push(winnerForField);
                }
            }
        }
    }
    let disputed = false;
    let product = 1;
    for (let fi = 0; fi < fieldCount; fi++) {
        const fieldCandidates = candidates[fi];
        if (fieldCandidates.size !== 1) {
            disputed = true;
            break;
        }
        const [winner] = fieldCandidates.keys();
        if (winner.startsWith('departure')) {
            product = product * yourTicket[fi];
        }
    }
    return [errorRate, disputed ? -1 : product];
};

test('16', () => {
    expect(solve()).toEqual([23122, 362974212989]);
});
