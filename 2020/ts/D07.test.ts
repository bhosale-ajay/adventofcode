import { matchesToArray } from 'dotless';
import { getInput } from './util';

interface Bag {
    contains: [string, number][];
    parent: string[];
    count: number;
}
type Bags = Map<string, Bag>;
const regex = /(([\w]+\s[\w]+) bags contain)|(([\d+]) ([\w]+\s[\w]+))/g;
const SHINY_GOLD = 'shiny gold';

const getBag = (bags: Bags, name: string) => {
    let bag = bags.get(name);
    if (bag === undefined) {
        bag = {
            contains: [],
            parent: [],
            count: -1,
        };
        bags.set(name, bag);
    }
    return bag;
};

const build = (
    [parentBagName, bags]: [string, Bags],
    token: RegExpExecArray
): [string, Bags] => {
    if (token[2] !== undefined) {
        const name = token[2];
        return [name, bags];
    }
    const parentBag = getBag(bags, parentBagName);
    const quantity = +token[4];
    const name = token[5];
    const bag = getBag(bags, name);
    parentBag.contains.push([name, quantity]);
    bag.parent.push(parentBagName);
    return [parentBagName, bags];
};

const seed = () => ['', new Map<string, Bag>()] as [string, Bags];
const parse = (ip: string) =>
    matchesToArray(getInput(ip), regex).reduce(build, seed())[1];

const getParentCount = (bags: Bags) => {
    const goldBag = getBag(bags, SHINY_GOLD);
    const queue: string[] = [...goldBag.parent];
    const visited = new Set<string>();
    while (queue.length > 0) {
        const current = queue.shift() as string;
        if (!visited.has(current)) {
            const bag = getBag(bags, current);
            bag.parent.forEach(pp => queue.push(pp));
            visited.add(current);
        }
    }
    return visited.size;
};

const getCount = (bags: Bags, name: string) => {
    const bag = getBag(bags, name);
    if (bag.count > -1) {
        return bag.count;
    }
    let count = 1; // count self
    bag.contains.forEach(([cn, cq]) => {
        count = count + cq * getCount(bags, cn);
    });
    bag.count = count;
    return count;
};

// -1 as the getCount considers parent + children
const findRequiredBags = (bags: Bags) => getCount(bags, SHINY_GOLD) - 1;

test('07', () => {
    const testInput01 = parse('07-test-01');
    const testInput02 = parse('07-test-02');
    const input = parse('07');
    expect(getParentCount(testInput01)).toEqual(4);
    expect(getParentCount(input)).toEqual(172);
    expect(findRequiredBags(testInput01)).toEqual(32);
    expect(findRequiredBags(testInput02)).toEqual(126);
    expect(findRequiredBags(input)).toEqual(39645);
});
