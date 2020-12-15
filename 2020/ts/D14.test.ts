import { matchesToArray } from 'dotless';
import { getInput } from './util';

type MaskInstruction = [
    type: 'mask',
    mask: string,
    zeroBits: bigint,
    oneBits: bigint
];
type MemoryInstruction = [type: 'mem', address: number, value: bigint];
type Line = MaskInstruction | MemoryInstruction;
type Memory = Map<number, bigint>;
type Updater = (
    m: Memory,
    mask: MaskInstruction,
    mem: MemoryInstruction
) => void;
const [x, z, o] = ['X', '0', '1'];
const freshMemory = () => new Map<number, bigint>() as Memory;
const zero = BigInt(0);
const regex = /(mask = ([10X]+))|(mem\[(\d+)]) = (\d+)/gm;
const maskToBigNumber = (m: string, b: string) =>
    BigInt(Number.parseInt(m.replace(/X/g, b), 2));

const parseLine = (token: RegExpExecArray): Line => {
    if (token[2] !== undefined) {
        const mask = token[2];
        return [
            'mask',
            mask,
            maskToBigNumber(mask, z),
            maskToBigNumber(mask, o),
        ];
    }
    return ['mem', +token[4], BigInt(+token[5])];
};

const parse = (ip: string) =>
    matchesToArray(getInput(ip), regex).map(parseLine);

const sumOfValues = (m: Memory) => {
    let result = zero;
    m.forEach(v => (result = result + v));
    return result;
};

const getAddresses = (mask: string, baseAddress: number): number[] => {
    const base = baseAddress.toString(2).padStart(36, '0');
    let masked = '';
    let xCount = 0;
    const result: number[] = [];
    for (let i = 0; i < base.length; i++) {
        const mc = mask.charAt(i);
        if (mc === z) {
            masked = masked + base.charAt(i);
        } else if (mc === o) {
            masked = masked + o;
        } else {
            masked = masked + x;
            xCount = xCount + 1;
        }
    }
    for (let i = 0; i < Math.pow(2, xCount); i++) {
        const flex = i.toString(2).padStart(xCount, '0');
        let ri = 0;
        const binaryAddress = masked.replace(/X/g, () => flex.charAt(ri++));
        const address = parseInt(binaryAddress, 2);
        // console.log(`${binaryAddress} (decimal ${address})`);
        result.push(address);
    }
    return result;
};

const u1 = (memory: Memory, mask: MaskInstruction, l: MemoryInstruction) => {
    const [, , zeroBits, oneBits] = mask;
    const [, address, value] = l;
    memory.set(address, (value | zeroBits) & oneBits);
};

const u2 = (memory: Memory, mask: MaskInstruction, l: MemoryInstruction) => {
    const [, address, value] = l;
    for (const floating of getAddresses(mask[1], address)) {
        memory.set(floating, value);
    }
};

const execute = (p: Line[], updater: Updater) => {
    const [mem] = p.reduce(
        ([memory, mask]: [Memory, MaskInstruction], l: Line) => {
            if (l[0] === 'mask') {
                return [memory, l];
            }
            updater(memory, mask, l);
            return [memory, mask];
        },
        [freshMemory(), ['mask', '', zero, zero]]
    );
    return sumOfValues(mem);
};

test('14', () => {
    const t1 = parse('14-test-01');
    const t2 = parse('14-test-02');
    const i = parse('14');
    expect(execute(t1, u1)).toEqual(BigInt(165));
    expect(execute(i, u1)).toEqual(BigInt(12610010960049));
    expect(execute(t2, u2)).toEqual(BigInt(208));
    expect(execute(i, u2)).toEqual(BigInt(3608464522781));
});
