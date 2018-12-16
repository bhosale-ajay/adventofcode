import { Dictionary, getInput } from "./util";
interface Sample {
    before: number[];
    instruction: number[];
    after: number[];
}
type Program = [number[]];
type Register = number[];
type Operation = (reg: Register, a: number, b: number) => number;
type OpCode = (reg: Register, a: number, b: number, c: number) => void;
const getSamples = (ip: string): Sample[] => {
    const lines = getInput(ip).split("\n");
    return lines.reduce((samples: Sample[], l, index) => {
        if (l.startsWith("Before")) {
            const before = l.split("[")[1].split("]")[0].split(",").map(n => +(n.trim()));
            const instruction = lines[index + 1].split(" ").map(n => +(n.trim()));
            const after = lines[index + 2].split("[")[1].split("]")[0].split(",").map(n => +(n.trim()));
            samples.push({before, instruction, after});
        }
        return samples;
    }, []);
};
const getProgram = (ip: string): Program => {
    const lines = getInput(ip).split("\n");
    return lines.reduce((program: Program, l, index) => {
        if (index > 3108 && l.trim() !== "") {
            program.push(l.split(" ").map(n => +(n.trim())));
        }
        return program;
    }, [] as any);
};
const createOpCode = (op: Operation): OpCode => {
    return (reg: Register, a: number, b: number, c: number) => {
        reg[c] = op(reg, a, b);
    };
};
const opcodes = [
    createOpCode((r, a, b) => r[a] + r[b]),
    createOpCode((r, a, b) => r[a] + b),
    createOpCode((r, a, b) => r[a] * r[b]),
    createOpCode((r, a, b) => r[a] * b),
    createOpCode((r, a, b) => r[a] & r[b]),
    createOpCode((r, a, b) => r[a] & b),
    createOpCode((r, a, b) => r[a] | r[b]),
    createOpCode((r, a, b) => r[a] | b),
    createOpCode((r, a, _) => r[a]),
    createOpCode((_, a)    => a),
    createOpCode((r, a, b) => a > r[b] ? 1 : 0),
    createOpCode((r, a, b) => r[a] > b ? 1 : 0),
    createOpCode((r, a, b) => r[a] > r[b] ? 1 : 0),
    createOpCode((r, a, b) => a === r[b] ? 1 : 0),
    createOpCode((r, a, b) => r[a] === b ? 1 : 0),
    createOpCode((r, a, b) => r[a] === r[b] ? 1 : 0)
];
const solve = (ip: string) => {
    const samples = getSamples(ip);
    let matchingCodes = 0;
    const contenders: Dictionary<Dictionary<number>> = {};
    const mapping: Dictionary<number> = {};
    for (const {before, instruction, after} of samples) {
        const [code, a, b, c] = instruction;
        let matchCount = 0;
        if (contenders[code] === undefined) {
            contenders[code] = { "T" : 0};
        }
        const contendersForCode = contenders[code];
        contendersForCode["T"] = contendersForCode["T"] + 1;
        for (let i = 0; i < opcodes.length; i++) {
            const opcode = opcodes[i];
            const reg = [... before];
            opcode(reg, a, b, c);
            if (reg[c] === after[c]) {
                matchCount = matchCount + 1;
                contendersForCode[i] = 1 + (contendersForCode[i] !== undefined ? contendersForCode[i] : 0);
            }
        }
        if (matchCount >= 3) {
            matchingCodes = matchingCodes + 1;
        }
    }

    for (const code of Object.keys(contenders)) {
        const totalCalls = contenders[code]["T"];
        for (const opCodeIndex of Object.keys(contenders[code])) {
            if (opCodeIndex === "T") {
                delete contenders[code]["T"];
                continue;
            }
            if (contenders[code][opCodeIndex] < totalCalls) {
                delete contenders[code][opCodeIndex];
            }
        }
    }

    while (Object.keys(contenders).length > 0) {
        for (const code of Object.keys(contenders)) {
            const codeContenders = Object.keys(contenders[code]);
            if (codeContenders.length === 1) {
                const opIndex = codeContenders[0];
                delete contenders[code];
                for (const otherCode of Object.keys(contenders)) {
                    delete contenders[otherCode][opIndex];
                }
                mapping[code] = +opIndex;
            } else {
                let exclusiveIndex = "";
                for (const opCodeIndex of codeContenders) {
                    let exclusive = true;
                    for (const otherCode of Object.keys(contenders)) {
                        if (otherCode === code) {
                            continue;
                        }
                        if (contenders[otherCode][opCodeIndex] !== undefined) {
                            exclusive = false;
                            break;
                        }
                    }
                    if (exclusive) {
                        exclusiveIndex = opCodeIndex;
                        break;
                    }
                }
                if (exclusiveIndex !== "") {
                    delete contenders[code];
                    mapping[code] = +exclusiveIndex;
                }
            }
        }
    }
    const programRegister = [0, 0, 0, 0];
    const program = getProgram(ip);
    for (const [code, a, b, c] of program) {
        opcodes[mapping[code]](programRegister, a, b, c);
    }
    return [matchingCodes, programRegister[0]];
};

test("16", () => {
    expect(solve("16")).toEqual([624, 584]);
});
