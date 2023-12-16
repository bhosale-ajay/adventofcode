import { ascendingBy } from 'dotless';
import { getInput } from './util';

type Step = {
    value: number;
    box: number;
    lens: string;
    focalLength: number | undefined;
};

const getValue = (step: string) => {
    let value = 0;
    for (let i = 0; i < step.length; i++) {
        value = ((value + step.charCodeAt(i)) * 17) % 256;
    }
    return value;
};

const parseStep = (sd: string): Step => {
    const [lens, fl] = sd.split(/[-=]/);
    return {
        value: getValue(sd),
        lens,
        box: getValue(lens),
        focalLength: fl === '' ? undefined : +fl,
    };
};

const solve = (fn: string) => {
    const steps = getInput(fn).trim().split(',').map(parseStep);
    const p1 = steps.reduce((acc, s) => acc + s.value, 0);
    const boxes = Array.from({ length: 256 }).map(
        _ => new Map<string, [number, number]>(),
    );
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const box = boxes[step.box];
        if (step.focalLength == undefined) {
            box.delete(step.lens);
        } else {
            const p = box.has(step.lens) ? box.get(step.lens)![0] : i;
            box.set(step.lens, [p, step.focalLength]);
        }
    }
    let p2 = 0;
    for (let i = 0; i < boxes.length; i++) {
        p2 =
            p2 +
            Array.from(boxes[i].values())
                .sort(ascendingBy(s => s[0]))
                .reduce((acc, s, si) => acc + (i + 1) * (si + 1) * s[1], 0);
    }
    return [p1, p2];
};

test('15', () => {
    expect(solve('15-t1')).toEqual([1320, 145]);
    expect(solve('15')).toEqual([517965, 267372]);
});
