type Circle = [firstCup: number, cups: number[]];

const buildCircle = (labels: number[], extra: number): Circle => {
    const cups = [];
    const firstCup = labels[0];
    let current = firstCup;
    for (const label of labels) {
        cups[current] = label;
        current = label;
    }
    for (let label = 10; label <= extra; label++) {
        cups[current] = label;
        current = label;
    }
    cups[current] = firstCup;
    return [firstCup, cups];
};

const playCups = (ip: string, moves: number, extra = 0): number[] => {
    const cupLabels = ip.split('').map(n => +n);
    const [root, cups] = buildCircle(cupLabels, extra);
    const maxLabel = cups.length - 1;
    let current = root;
    for (let m = 1; m <= moves; m++) {
        const p1 = cups[current];
        const p2 = cups[p1];
        const p3 = cups[p2];
        const p4 = cups[p3];
        const picked = [p1, p2, p3];
        let destination = current;
        do {
            destination = destination - 1;
            if (destination === 0) {
                destination = maxLabel;
            }
        } while (picked.includes(destination));
        cups[current] = p4;
        cups[p3] = cups[destination];
        cups[destination] = p1;
        current = p4;
    }
    return cups;
};

const labelsAfter1 = (ip: string, moves = 100): string => {
    const cups = playCups(ip, moves);
    let result = '';
    let current = cups[1];
    while (current !== 1) {
        result = result + current;
        current = cups[current];
    }
    return result;
};

const findStars = (ip: string): number => {
    const cups = playCups(ip, 10000000, 1000000);
    const nextToOne = cups[1];
    return nextToOne * cups[nextToOne];
};

test('23', () => {
    // expect(labelsAfter1('389125467', 10)).toEqual('92658374');
    // expect(labelsAfter1('389125467')).toEqual('67384529');
    expect(labelsAfter1('792845136')).toEqual('98742365');
    // expect(findStars('389125467')).toEqual(149245887792);
    expect(findStars('792845136')).toEqual(294320513093);
});
