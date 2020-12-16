const play = (ip: string, times = 2020) => {
    const numbers = ip.split(',').map(n => +n);
    const memory = new Map<number, number>();
    numbers.forEach((n, i) => memory.set(n, i + 1));
    let current = 0;
    for (let turn = numbers.length + 1; turn < times; turn++) {
        if (memory.has(current)) {
            const lt = memory.get(current) as number;
            memory.set(current, turn);
            current = turn - lt;
        } else {
            memory.set(current, turn);
            current = 0;
        }
    }
    return current;
};

test('15', () => {
    expect(play('0,3,6')).toEqual(436);
    // expect(play('1,3,2')).toEqual(1);
    // expect(play('2,1,3')).toEqual(10);
    // expect(play('1,2,3')).toEqual(27);
    // expect(play('2,3,1')).toEqual(78);
    // expect(play('3,2,1')).toEqual(438);
    // expect(play('3,1,2')).toEqual(1836);
    expect(play('10,16,6,0,1,17')).toEqual(412);
    // expect(play('10,16,6,0,1,17', 30000000)).toEqual(243);
});
