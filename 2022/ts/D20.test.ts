import { LinkedList, Node, mapLine } from './util';

const solve = (numbers: number[], steps = 1, key = 1) => {
    const list = new LinkedList<number>();
    const array: Node<number>[] = [];
    let zero: Node<number> | undefined = undefined;
    for (const n of numbers) {
        if (list.count === 0) {
            array.push(list.init(n * key));
        } else {
            array.push(list.insertAfter(array[array.length - 1], n * key));
        }
        if (n === 0) {
            zero = array[array.length - 1];
        }
    }
    const size = array.length;
    const half = size / 2;
    for (let si = 0; si < steps; si++) {
        for (const node of array) {
            const v = node.value;
            if (v === 0) {
                continue;
            }
            let current = node;
            let mover = v > 0 ? 'next' : 'prev';
            const updater = v > 0 ? 'insertNodeAfter' : 'insertNodeBefore';
            let target = Math.abs(v) % (size - 1);

            if (target > half) {
                target = size - target;
                mover = mover === 'next' ? 'prev' : 'next';
            }

            for (let i = 0; i < target; i++) {
                current = (current as any)[mover];
            }
            list.remove(node);
            list[updater](current, node);
        }
    }
    const final: number[] = [0];
    if (zero !== undefined) {
        let next = zero.next;
        while (next !== zero || final.length < 3001) {
            final.push(next.value);
            next = next.next;
        }
    }
    const n1000 = final[1000 % size];
    const n2000 = final[2000 % size];
    const n3000 = final[3000 % size];
    return n1000 + n2000 + n3000;
};

test('20', () => {
    const td = mapLine('20-test', Number);
    const ad = mapLine('20', Number);
    expect(solve(td)).toEqual(3);
    expect(solve(ad)).toEqual(15297);
    expect(solve(td, 10, 811589153)).toEqual(1623178306);
    expect(solve(ad, 10, 811589153)).toEqual(2897373276210);
});
