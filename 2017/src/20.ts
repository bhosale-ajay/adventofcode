import * as inputSets from "./20-input";
import { assert, matchesToArray } from "./util";

const parse = i => i.split("\n").map((l, id) => ({ id, pva : matchesToArray(l, /-*\d+/g, m => +m[0]), destroyed : false }));
const [x, y, z] = [0, 1, 2];
const impact = n => (n + 1) * n / 2;
const axisAtTick = (p, n, i, axis) => Math.abs(p[axis] + (n * p[axis + 3]) + (i * p[axis + 6]));
const distanceAtTick = (p, n, i) => axisAtTick(p, n, i, x) +
                                    axisAtTick(p, n, i, y) +
                                    axisAtTick(p, n, i, z);
const closestAtTick = (particles, n) => {
    const i = impact(n);
    return particles.reduce((acc, p) => distanceAtTick(acc.pva, n, i) < distanceAtTick(p.pva, n, i) ? acc : p).id;
};
const findClosest = (particles) => {
    let tick = 1;
    let current = 0;
    let last = -1;
    let streak = 0;
    while (streak < 2) {
        last = current;
        current = closestAtTick(particles, Math.pow(10, tick++));
        streak = (current === last) ? (streak + 1) : 0;
    }
    return current;
};
const update = (p, axis) => {
    p[axis + 3] = p[axis + 3] + p[axis + 6];
    p[axis] = p[axis] + p[axis + 3];
};
const pointKey = p => `p${p[x]}.${p[y]}.${p[z]}`;
const moveAndRemoveCollisions = (particles) => {
    const points = {};
    let collisions = 0;
    particles.filter(p => !p.destroyed).forEach(p => {
        update(p.pva, x);
        update(p.pva, y);
        update(p.pva, z);
        const key = pointKey(p.pva);
        if ((key in points)) {
            collisions = collisions + 1;
            p.destroyed = true;
            if (points[key] !== -1) {
                collisions = collisions + 1;
                points[key].destroyed = true;
                points[key] = -1;
            }
        } else {
            points[key] = p;
        }
    });
    return collisions;
};
const simulate = (particles) => {
    let current = particles.length;
    let last;
    let streak = 0;
    while (streak < 10) {
        last = current;
        current = current - moveAndRemoveCollisions(particles);
        streak = (current === last && current !== particles.length) ? (streak + 1) : 0;
    }
    return current;
};
const ps = parse(inputSets.ip2001);
const a = findClosest(ps);
const b = simulate(parse(inputSets.ip2002));
const c = simulate(ps);
assert(a, 364, "20.1");
assert(b,   1, "20.2, Test 01");
assert(c, 420, "20.2");
