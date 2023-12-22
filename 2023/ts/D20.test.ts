import { getLines } from './util';

type State = [string, string, boolean];
type BaseModule = {
    name: string;
    destinations: string[];
    processor: (m: Module, p: boolean, f: string) => State[];
};
type FlipFlopModule = BaseModule & {
    type: 'ff';
    memory: boolean;
};
type ConjunctionModule = BaseModule & {
    type: 'c';
    memory: Map<string, boolean>;
    highInputCount: number;
};
type BroadcastModule = BaseModule & {
    type: 'b';
    memory: any;
};
type Module = FlipFlopModule | ConjunctionModule | BroadcastModule;
type Modules = Map<string, Module>;
const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);
const processPulseB = () => [];
const processPulseFF = (m: FlipFlopModule, p: boolean, _: string): State[] => {
    if (!p) {
        m.memory = !m.memory;
        return m.destinations.map(d => [m.name, d, m.memory]);
    }
    return [];
};
const processPulseC = (
    m: ConjunctionModule,
    p: boolean,
    f: string,
): State[] => {
    const cv = m.memory.get(f)!;
    let change = 0;
    if (p && !cv) {
        change = 1;
    } else if (!p && cv) {
        change = -1;
    }
    m.memory.set(f, p);
    m.highInputCount = m.highInputCount + change;
    const output = m.highInputCount < m.memory.size;
    return m.destinations.map(d => [m.name, d, output]);
};
const processors = {
    ff: processPulseFF,
    c: processPulseC,
    b: processPulseB,
};
const collectModules = (ms: Modules, l: string) => {
    const [nd, dd] = l.split(' -> ');
    const type = nd[0] === '%' ? 'ff' : nd[0] === '&' ? 'c' : 'b';
    const name = type !== 'b' ? nd.substring(1) : nd;
    const memory = type === 'c' ? new Map() : false;
    const processor = processors[type];
    const module = {
        name,
        type,
        destinations: dd.split(', '),
        memory,
        processor,
    };
    ms.set(name, module as Module);
    return ms;
};
const solve = (fn: string) => {
    const lines = getLines(fn);
    const modules = lines.reduce(collectModules, new Map());
    const rx = lines.find(l => l.endsWith('rx'));
    const rxSource = rx?.substring(1, 3);
    const inputTriggeredAt: Record<string, number> = {};
    let inputCount = 0;
    let triggeredCount = 0;
    for (const m of modules.values()) {
        for (const d of m.destinations) {
            if (d === rxSource) {
                inputTriggeredAt[m.name] = 0;
                inputCount = inputCount + 1;
            }
            const dest = modules.get(d);
            if (dest !== undefined && dest.type === 'c') {
                dest.memory.set(m.name, false);
                dest.highInputCount = 0;
            }
        }
    }
    const b = 'broadcaster';
    const bm = modules.get(b)!;
    const start = bm.destinations.map(d => [b, d, false] as State);
    let presses = 0;
    let low = 0;
    let high = 0;
    while (triggeredCount < inputCount || presses < 1000) {
        presses = presses + 1;
        if (presses - 1 < 1000) {
            low = low + 1;
        }
        const queue = [...start];
        while (queue.length) {
            const [f, t, p] = queue.shift()!;
            const target = modules.get(t);
            if (presses - 1 < 1000) {
                if (p) {
                    high = high + 1;
                } else {
                    low = low + 1;
                }
            }
            if (target === undefined) {
                continue;
            }
            if (target.name === rxSource && p) {
                if (inputTriggeredAt[f] === 0) {
                    inputTriggeredAt[f] = presses;
                    triggeredCount = triggeredCount + 1;
                }
            }
            queue.push(...target.processor(target, p, f));
        }
    }
    const values = Object.values(inputTriggeredAt);
    const p1 = low * high;
    const p2 = values.length > 0 ? values.reduce(lcm) : 1;
    return [p1, p2];
};

test('20', () => {
    expect(solve('20-t2')).toEqual([11687500, 1]);
    expect(solve('20')).toEqual([898557000, 238420328103151]);
});
