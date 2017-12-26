import * as inputSets from "./24-input";
import { assert } from "./util";

const parse = i => i.split("\n").map(l => l.split("/").map(n => +n))
                                .map(([p1, p2], id) => ({id, p1, p2}));

function* buildBridge(pins, chainSoFar, end) {
    const next = pins.filter(p => chainSoFar.every(cp => cp.id !== p.id)
                               && (p.p1 === end || p.p2 === end));
    if (next.length === 0) {
        yield chainSoFar;
    }
    for (const n of next) {
        const nextEnd = n.p1 === end ? n.p2 : n.p1;
        yield* buildBridge(pins, [...chainSoFar, n], nextEnd);
    }
}

const strongest = (input) => {
    const pins = parse(input);
    let maxStrength = 0;
    let longestStrength = 0;
    let maxLength = 0;
    const usedTypeZero = {};
    for (const typeZero of pins.filter(p => p.p1 === 0 || p.p2 === 0)) {
        if (usedTypeZero[typeZero.id]) {
            continue;
        }
        for (const bridge of buildBridge(pins, [typeZero], typeZero.p1 === 0 ? typeZero.p2 : typeZero.p1)) {
            const bridgeStrength = bridge.reduce((s, p) => s + p.p1 + p.p2, 0);
            const bridgeLength = bridge.length;
            maxStrength = Math.max(maxStrength, bridgeStrength);
            if (maxLength < bridgeLength) {
                maxLength = bridgeLength;
                longestStrength = bridgeStrength;
            } else if (maxLength === bridgeLength && longestStrength < bridgeStrength) {
                longestStrength = bridgeStrength;
            }
            bridge.filter(p => p.p1 === 0 || p.p2 === 0).every(p => usedTypeZero[p.id] = true);
        }
    }
    return [maxStrength, longestStrength];
};

const [a, c] = strongest(inputSets.ip2401);
const [b, d] = strongest(inputSets.ip2402);

assert(a,   31, "24.1, Test 01");
assert(b, 1859, "24.1");
assert(c,   19, "24.2, Test 01");
assert(d, 1799, "24.2");
