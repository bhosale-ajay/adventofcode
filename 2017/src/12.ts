import * as inputSets from "./12-input";
import { assert } from "./util";

const parse = i => i.replace(/ /g, "").split("\n").map(l => l.split("<->")).reduce((ps, [p, cs]) => {
    ps[p] = cs.split(",");
    return ps;
}, {});

const connect = (ps, p, connected) => {
    connected.add(p);
    for (const con of ps[p]) {
        if (connected.has(con)) {
            continue;
        }
        connect(ps, con, connected);
    }
    return connected;
};

const findGroups = ps => {
    const visited = new Set();
    let count = 0;
    // tslint:disable-next-line:forin
    for (const p in ps) {
        if (!visited.has(p)) {
            const group = connect(ps, p, new Set());
            group.forEach(v => visited.add(v));
            count = count + 1;
        }
    }
    return count;
};

const findConnections = ps => connect(ps, "0", new Set()).size;

const tC = findConnections(parse(inputSets.ip1201));
const pC = findConnections(parse(inputSets.ip1202));
const gC = findGroups(parse(inputSets.ip1202));
assert(tC,   6, "12.1, Test 01");
assert(pC, 283, "12.1");
assert(gC, 195, "12.2");
