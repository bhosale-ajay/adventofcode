import { getInput } from "./util";
type Program = [number[]];
type Register = number[];
type Operation = (reg: Register, a: number, b: number) => number;
type OpCode = (reg: Register, a: number, b: number, c: number, ipr: number) => void;
const OpCodeNames = {
    addr:  0, addi:  1, mulr:  2, muli: 3,
    banr:  4, bani:  5, borr:  6, bori: 7,
    setr:  8, seti:  9, gtir: 10, gtri: 11,
    gtrr: 12, eqir: 13, eqri: 14, eqrr: 15
};
const getProgram = (fn: string): [Program, number] => {
    const lines = getInput(fn).split("\n");
    const program: Program = [] as any;
    let ipr = 0;
    lines.forEach(l => {
        if (l.startsWith("#ip")) {
            ipr = +l.split(" ")[1];
            return;
        }
        const args = l.split(" ");
        args[0] = (OpCodeNames as any)[args[0]];
        program.push(args.map(n => +n));
    });
    return [program, ipr];
};
const createOpCode = (op: Operation): OpCode => {
    return (reg: Register, a: number, b: number, c: number, ipr: number) => {
        reg[c] = op(reg, a, b);
        reg[ipr] = reg[ipr] + 1;
    };
};
const opcodes = [
    createOpCode((r, a, b) => r[a] + r[b]),                 // addr: 0,
    createOpCode((r, a, b) => r[a] + b),                    // addi: 1,
    createOpCode((r, a, b) => r[a] * r[b]),                 // mulr: 2,
    createOpCode((r, a, b) => r[a] * b),                    // muli: 3,
    createOpCode((r, a, b) => r[a] & r[b]),                 // banr: 4,
    createOpCode((r, a, b) => r[a] & b),                    // bani: 5,
    createOpCode((r, a, b) => r[a] | r[b]),                 // borr: 6,
    createOpCode((r, a, b) => r[a] | b),                    // bori: 7,
    createOpCode((r, a, _) => r[a]),                        // setr: 8,
    createOpCode((_, a)    => a),                           // seti: 9,
    createOpCode((r, a, b) => a > r[b] ? 1 : 0),            // gtir: 10,
    createOpCode((r, a, b) => r[a] > b ? 1 : 0),            // gtri: 11,
    createOpCode((r, a, b) => r[a] > r[b] ? 1 : 0),         // gtrr: 12,
    createOpCode((r, a, b) => a === r[b] ? 1 : 0),          // eqir: 13,
    createOpCode((r, a, b) => r[a] === b ? 1 : 0),          // eqri: 14,
    createOpCode((r, a, b) => r[a] === r[b] ? 1 : 0)        // eqrr: 15,
];

const ns = ["a", "b", "c", "d", "e", "f"];
const opcodesC = [
    (a: number, b: number, c: number) => `${ns[c]} = ${ns[a]} + ${ns[b]}`,          // addr: 0,
    (a: number, b: number, c: number) => `${ns[c]} = ${ns[a]} + ${b}`,              // addi: 1,
    (a: number, b: number, c: number) => `${ns[c]} = ${ns[a]} * ${ns[b]}`,          // mulr: 2,
    (a: number, b: number, c: number) => `${ns[c]} = ${ns[a]} * ${b}`,              // muli: 3,
    (a: number, b: number, c: number) => `${ns[c]} = ${ns[a]} & ${ns[b]}`,          // banr: 4,
    (a: number, b: number, c: number) => `${ns[c]} = ${ns[a]} & ${b}`,              // bani: 5,
    (a: number, b: number, c: number) => `${ns[c]} = ${ns[a]} | ${ns[b]}`,          // borr: 6,
    (a: number, b: number, c: number) => `${ns[c]} = ${ns[a]} | ${b}`,              // bori: 7,
    (a: number, _: number, c: number) => `${ns[c]} = ${ns[a]}`,                     // setr: 8,
    (a: number, _: number, c: number) => `${ns[c]} = ${a}`,                         // seti: 9,
    (a: number, b: number, c: number) => `${ns[c]} = ${a} > ${ns[b]} ? 1 : 0`,      // gtir: 10,
    (a: number, b: number, c: number) => `${ns[c]} = ${ns[a]} > ${b} ? 1 : 0`,      // gtri: 11,
    (a: number, b: number, c: number) => `${ns[c]} = ${ns[a]} > ${ns[b]} ? 1 : 0`,  // gtrr: 12,
    (a: number, b: number, c: number) => `${ns[c]} = ${a} === ${ns[b]} ? 1 : 0`,    // eqir: 13,
    (a: number, b: number, c: number) => `${ns[c]} = ${ns[a]} === ${b} ? 1 : 0`,    // eqri: 14,
    (a: number, b: number, c: number) => `${ns[c]} = ${ns[a]} === ${ns[b]} ? 1 : 0` // eqrr: 15,
];

export const solve = (fn: string) => {
    const reg = [0, 0, 0, 0, 0, 0];
    const [program, ipr] = getProgram(fn);
    const programLength = program.length;
    while (0 <= reg[ipr] && reg[ipr] < programLength) {
        const [code, a, b, c] = program[reg[ipr]];
        opcodes[code](reg, a, b, c, ipr);
    }
    return reg[0];
};

export const print = (fn: string) => {
    const [program ] = getProgram(fn);
    let simplified = "";
    let counter = 0;
    for (const [code, a, b, c] of program) {
        const parts = opcodesC[code](a, b, c).split("=");
        parts[1] = parts[1].replace(/e/g, counter.toString());
        simplified = simplified + counter.toString().padStart(2, " ") + " " + parts[0] + "=" + parts[1] + "\n";
        counter = counter + 1;
    }
    console.log(simplified);
};

const sumOfFactors = (n: number) => {
    const to = Math.sqrt(n);
    const isEven = n % 2 === 0;
    const inc = isEven ? 1 : 2;
    let sum = 1 + n;
    for (let i = isEven ? 2 : 3; i <= to; i = i + inc) {
        if (n % i !== 0) {
            continue;
        }
        sum = sum + i;
        const factor = n / i;
        if (factor !== i) {
            sum = sum + factor;
        }
    }
    return sum;
};

export const solveSimplified = (fn: string, seed: number = 0) => {
    const reg = [seed, 0, 0, 0, 0, 0];
    const [program, ipr] = getProgram(fn);
    while (reg[ipr] !== 1) {
        const [code, a, b, c] = program[reg[ipr]];
        opcodes[code](reg, a, b, c, ipr);
    }
    return sumOfFactors(reg[1]);
};

test("19", () => {
    expect(solve("19-test1")).toEqual(7);
    expect(solve("19")).toEqual(912);
    expect(solveSimplified("19")).toEqual(912);
    expect(solveSimplified("19", 1)).toEqual(10576224);
});

// print("19");
