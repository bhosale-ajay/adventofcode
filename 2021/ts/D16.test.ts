import { getInput } from './util';

type Action = (a: number, b: number) => number;

const typeDecoder: Record<number, Action> = {
    0: (a: number, b: number) => a + b,
    1: (a: number, b: number) => a * b,
    2: (a: number, b: number) => (a < b ? a : b),
    3: (a: number, b: number) => (a > b ? a : b),
    5: (a: number, b: number) => (a > b ? 1 : 0),
    6: (a: number, b: number) => (a < b ? 1 : 0),
    7: (a: number, b: number) => (a === b ? 1 : 0),
};

type Packet = {
    value: number;
    consumed: number;
    version: number;
};

const charToBinary = (c: string) =>
    parseInt(c, 16).toString(2).padStart(4, '0');

const stringToBinary = (s: string) => {
    let result = '';
    for (const c of s) {
        result = result + charToBinary(c);
    }
    return result;
};

const decodePacket = (transmission: string): Packet => {
    const typeID = parseInt(transmission.slice(3, 6), 2);
    let version = parseInt(transmission.slice(0, 3), 2);
    let consumed = 6;
    let value = 0;
    transmission = transmission.slice(6);
    if (typeID === 4) {
        let d = '',
            next = '',
            n = 0;
        do {
            next = transmission.slice(5 * n, 5 * (1 + n++));
            consumed += 5;
            d += next.slice(1);
        } while (next[0] === '1');
        value = parseInt(d, 2);
        return { value, version, consumed };
    }
    const lengthTypeID = transmission[0];
    transmission = transmission.slice(1);
    consumed++;
    let totalSubPacket = Number.MAX_VALUE;
    if (lengthTypeID === '1') {
        totalSubPacket = parseInt(transmission.slice(0, 11), 2);
        transmission = transmission.slice(11);
        consumed += 11;
    } else {
        const subPacketLength = parseInt(transmission.slice(0, 15), 2);
        transmission = transmission.slice(15);
        transmission = transmission.slice(0, subPacketLength);
        consumed += 15;
    }
    for (let i = 0; i < totalSubPacket && 0 < transmission.length; i++) {
        const childPacket = decodePacket(transmission);
        transmission = transmission.slice(childPacket.consumed);
        consumed += childPacket.consumed;
        version += childPacket.version;
        value =
            i === 0
                ? childPacket.value
                : typeDecoder[typeID](value, childPacket.value);
    }
    return { value, version, consumed };
};

const solve = (fn: string) => {
    const packet = stringToBinary(getInput(fn));
    const result = decodePacket(packet);
    return [result.version, result.value];
};

test('16', () => {
    expect(solve('16-test-0')).toEqual([31, 54]);
    expect(solve('16-test-1')).toEqual([8, 54]);
    expect(solve('16')).toEqual([895, 1148595959144]);
});
