export interface Cup {
    label: number;
    prev: Cup;
    next: Cup;
}

type Circle = [firstCup: Cup, max: number, cups: Map<number, Cup>];

const insertAfter = (current: Cup, label: number): Cup => {
    const currentNext = current.next;
    const newCup = { label, prev: current, next: currentNext };
    current.next = newCup;
    currentNext.prev = newCup;
    return newCup;
};

const buildCircle = (items: number[], extra: number): Circle => {
    const cups = new Map<number, Cup>();
    const firstCup = { label: items[0] } as Cup;
    firstCup.prev = firstCup;
    firstCup.next = firstCup;
    cups.set(firstCup.label, firstCup);
    let current = firstCup;
    for (let i = 1; i < items.length; i++) {
        current = insertAfter(current, items[i]);
        cups.set(items[i], current);
    }
    for (let label = 10; label <= extra; label++) {
        current = insertAfter(current, label);
        cups.set(label, current);
    }
    return [firstCup, extra || 9, cups];
};

const play = (ip: string, moves: number, extra = 0): Cup => {
    const cupLabels = ip.split('').map(n => +n);
    const [root, maxLabel, cups] = buildCircle(cupLabels, extra);
    let current = root;
    for (let m = 1; m <= moves; m++) {
        const p1 = current.next;
        const p2 = p1.next;
        const p3 = p2.next;
        const p4 = p3.next;

        const picked = [p1.label, p2.label, p3.label];

        let destLabel = current.label;
        let seek = true;
        while (seek) {
            destLabel = destLabel - 1;
            if (destLabel === 0) {
                destLabel = maxLabel;
            }
            seek = picked.includes(destLabel);
        }
        const dest = cups.get(destLabel) as Cup;
        const destNext = dest.next;

        current.next = p4;
        p4.prev = current;

        dest.next = p1;
        p1.prev = dest;

        destNext.prev = p3;
        p3.next = destNext;

        current = p4;
    }
    return cups.get(1) as Cup;
};

const labelsAfter1 = (ip: string, moves = 100): string => {
    let { next } = play(ip, moves, 0);
    let result = '';
    while (next.label !== 1) {
        result = result + next.label;
        next = next.next;
    }
    return result;
};

const findStars = (ip: string): number => {
    const { next } = play(ip, 10000000, 1000000);
    return next.label * next.next.label;
};

test('23', () => {
    expect(labelsAfter1('389125467', 10)).toEqual('92658374');
    // expect(labelsAfter1('389125467')).toEqual('67384529');
    // expect(labelsAfter1('792845136')).toEqual('98742365');
    // expect(findStars('389125467')).toEqual(149245887792);
    expect(findStars('792845136')).toEqual(294320513093);
});
