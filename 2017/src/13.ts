import * as inputSets from "./13-input";
import { assert } from "./util";

const buildLayers = i => i.split("\n").map(l => l.match(/\d+/g).map(n => +n));
const layerCanCaught = delay => ([d, r]) => (delay + d) % (2 * (r - 1)) === 0;
const calculateSeverity = (layers, delay = 0) => layers.filter(layerCanCaught(delay))
                                                       .reduce((s, [d, r]) => s + (d * r), 0);
const passThrough = i => {
    const layers = buildLayers(i);
    const severity = calculateSeverity(layers);
    let bestChance = 2;
    while (layers.some(layerCanCaught(bestChance))) {
        bestChance = bestChance + 2;
    }
    return [severity, bestChance];
};

const [tSev, tbc ] = passThrough(inputSets.ip1301);
const [sev, bc] = passThrough(inputSets.ip1302);

assert(tSev,    24, "13.1, Test 01");
assert(sev,   1316, "13.1");
assert(tbc,     10, "13.2, Test 01");
assert(bc, 3840052, "13.2");
