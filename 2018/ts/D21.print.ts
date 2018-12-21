import { getInput } from "./util";
type Program = [number[]];
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
const print = (fn: string) => {
    const [program, ipr] = getProgram(fn);
    let simplified = "";
    let counter = 0;
    const regToReplace = new RegExp(ns[ipr], "g");
    let lastExpression = "";
    let isExpression = false;
    // let isGoTo = false;
    const mapping: number[][] = [];
    let simple = "";
    // const hasVariable =  new RegExp("abcedf", "g");
    for (const [code, a, b, c] of program) {
        let factor = 0;
        const parts = opcodesC[code](a, b, c).split(" = ");
        parts[1] = parts[1].replace(regToReplace, counter.toString());
        let line =  parts[0] + " = " + parts[1];
        simple = simple + (counter).toString().padStart(2, " ") + " " + line + "\n";
        if (parts[1].includes("?")) {
            isExpression = true;
            lastExpression = parts[1].split("?")[0];
        }
        if (parts[0] === ns[ipr]) {
            if (/[abcdef]/.test(parts[1])) {
                // line = line + " + 1";
                const n = +parts[1].split(" + ")[1].trim() + 1;
                line = "goto " + (n + 1) + " if " + lastExpression + " else goto " + (n);
                factor = 1;
            } else {
                // tslint:disable-next-line:no-eval
                const lineN = eval(parts[1]) + 1;
                line = "goto " + lineN;
                mapping.push([counter, lineN]);
            }
        }
        if (counter > 4 && !isExpression) {
            simplified = simplified + "L" + (counter - factor) + ": " + line + ";\n";
        }
        isExpression = false;
        counter = counter + 1;
    }
    for (const [f, t] of mapping) {
        simplified = simplified.replace("goto " + f, "goto " + t);
    }
    // console.log(simple);
    // console.log("---");
    console.log(simplified);
};

print("21");
