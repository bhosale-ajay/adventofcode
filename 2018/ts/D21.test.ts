import { getInput } from "./util";
type Program = [number[]];
const LINE = 28; // Line 28 compares d to a
const PARAM = 3; // d
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

const findHaltCode = (fn: string) => {
    const [program, ipr] = getProgram(fn);
    const reg = [0, 0, 0, 0, 0, 0];
    const length = program.length - 1;
    while (0 <= reg[ipr] && reg[ipr] <= length ) {
        const ip = reg[ipr];
        const [code, a, b, c] = program[ip];
        if (ip === LINE) {
            break;
        }
        opcodes[code](reg, a, b, c, ipr);
    }
    return reg[PARAM];
};

const findSlowestHaltCode = () => {
    const haltCodes: number[] = [];
    let [c, d] = [0, 0];
    c = d | 65536;
    d = 1505483;
    while (true) {
        // e = c & 255
        // d = d + e
        // d = d & 16777215
        // d = d * 65899
        // d = d & 16777215
        d = (((d + (c & 255)) & 16777215) * 65899) & 16777215;
        if (256 > c) {
            if (haltCodes.includes(d)) {
                break;
            }
            haltCodes.push(d);
            c = d | 65536;
            d = 1505483;
            continue;
        }
        // e = 0
        // while(true) {
        //     f = e + 1
        //     f = f * 256
        //     if(f > c) {
        //         break;
        //     }
        //     e = e + 1
        // }
        c = Math.floor(c / 256);
    }
    return haltCodes[haltCodes.length - 1];
};

test("21", () => {
    expect(findHaltCode("21")).toEqual(7216956);
    expect(findSlowestHaltCode()).toEqual(14596916);
});

/*
// Output from D21.print.ts
L5: d = 0;
L6: c = d | 65536;
L7: d = 1505483;
L8: e = c & 255;
L9: d = d + e;
L10: d = d & 16777215;
L11: d = d * 65899;
L12: d = d & 16777215;
L13: goto 28 if 256 > c  else goto 17;
L17: e = 0;
L18: f = e + 1;
L19: f = f * 256;
L20: goto 26 if f > c  else goto 24;
L24: e = e + 1;
L25: goto 18;
L26: c = e;
L27: goto 8;
L28: goto 31 if d === a  else goto 6;
*/
