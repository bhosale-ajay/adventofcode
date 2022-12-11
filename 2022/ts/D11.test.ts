import { getLines } from './util';
type Operation = (o: number) => number;
const add = (p: number) => (old: number) => old + p;
const addToOld = (old: number) => old + old;
const mul = (p: number) => (old: number) => old * p;
const mulByOld = (old: number) => old * old;
const throwItem =
    (operation: Operation, divBy: number, wt: number, wf: number) =>
    (old: number, worryFactor: Operation) => {
        const n = worryFactor(operation(old));
        const throwAt = n % divBy === 0 ? wt : wf;
        return [throwAt, n] as [number, number];
    };
type Monkey = {
    id: number;
    divBy: number;
    items: number[];
    throwItem: (n: number, wf: Operation) => [number, number];
    inspected: number;
};
const linesToMoney = (lines: string): Monkey => {
    const parts = lines.split('\n');
    const id = +parts[0].slice(7, 8);
    const items = parts[1]
        .slice(18)
        .split(', ')
        .map(n => +n);
    const [op, param] = parts[2].slice(23).split(' ');
    const divBy = +parts[3].slice(21);
    const wt = +parts[4].slice(29);
    const wf = +parts[5].slice(30);
    let operation = addToOld;
    if (op === '+' && param !== 'old') {
        operation = add(+param);
    } else if (op === '*' && param === 'old') {
        operation = mulByOld;
    } else if (op === '*') {
        operation = mul(+param);
    }
    return {
        id,
        divBy,
        items,
        throwItem: throwItem(operation, divBy, wt, wf),
        inspected: 0,
    };
};
const play = (monkeys: Monkey[], round: number, wf: Operation) => {
    // const printAt = [
    //     1, 20, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000,
    // ];
    for (let r = 0; r < round; r++) {
        for (const monkey of monkeys) {
            for (const item of monkey.items) {
                const [throwAt, nItem] = monkey.throwItem(item, wf);
                monkeys[throwAt].items.push(nItem);
            }
            monkey.inspected = monkey.inspected + monkey.items.length;
            monkey.items = [];
        }
        // if (printAt.includes(r + 1)) {
        //     console.log(`\n== After round ${r + 1} ==`);
        //     for (const { id, inspected } of monkeys) {
        //         console.log(`Monkey ${id} inspected items ${inspected} times.`);
        //     }
        // }
    }
};
const simpleWorryFactor = (n: number) => Math.floor(n / 3);
// based on solution from erikw
const complexWorryFactor = (gf: number) => (n: number) => n % gf;
const solve = (fn: string, rounds: number, complexWF = false) => {
    const monkeys = getLines(fn, '\n\n').map(linesToMoney);
    const worryFactor = complexWF
        ? complexWorryFactor(monkeys.reduce((acc, m) => acc * m.divBy, 1))
        : simpleWorryFactor;
    play(monkeys, rounds, worryFactor);
    let [t1, t2] = [0, 0];
    for (const { inspected } of monkeys) {
        if (t1 < inspected) {
            t2 = t1;
            t1 = inspected;
        } else if (t2 < inspected) {
            t2 = inspected;
        }
    }
    return t1 * t2;
};

test('11', () => {
    expect(solve('11-test', 20)).toEqual(10605);
    expect(solve('11', 20)).toEqual(78960);
    expect(solve('11-test', 10000, true)).toEqual(2713310158);
    expect(solve('11', 10000, true)).toEqual(14561971968);
});
