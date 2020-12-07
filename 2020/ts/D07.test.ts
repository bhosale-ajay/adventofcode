import { matchesToArray } from 'dotless';
import { getInput } from './util';

interface Bag {
    contains: [string, number][];
    parent: string[];
    count: number;
}
type Bags = Map<string, Bag>;
const regex = /([\w]+\s[\w]+ bags contain)|([\d+] [\w]+\s[\w]+)/g;
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
    token: string
): [string, Bags] => {
    if (token.endsWith('bags contain')) {
        const name = token.substr(0, token.length - 13);
        return [name, bags];
    }
    const parentBag = getBag(bags, parentBagName);
    const firstSpaceIndex = token.indexOf(' ');
    const quantity = +token.substr(0, firstSpaceIndex);
    const name = token.substr(firstSpaceIndex + 1);
    const bag = getBag(bags, name);
    parentBag.contains.push([name, quantity]);
    bag.parent.push(parentBagName);
    return [parentBagName, bags];
};

const parse = (ip: string) =>
    matchesToArray(getInput(ip), regex, x => x[0]).reduce(build, [
        '',
        new Map<string, Bag>(),
    ] as [string, Bags])[1];

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

const testInput01 = parse('07-test-01');
const testInput02 = parse('07-test-02');
const input = parse('07');

test('07, Part 1', () => {
    expect(getParentCount(testInput01)).toEqual(4);
    expect(getParentCount(input)).toEqual(172);
});

test('07, Part 2', () => {
    expect(findRequiredBags(testInput01)).toEqual(32);
    expect(findRequiredBags(testInput02)).toEqual(126);
    expect(findRequiredBags(input)).toEqual(39645);
});
