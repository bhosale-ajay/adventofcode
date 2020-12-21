import { ascendingBy, sort } from 'dotless';
import { mapLine } from './util';

type Food = [Set<string>, string[]];
const lineToFood = (l: string) => {
    const [ingredients, allergens] = l.split(' (contains ');
    return [
        new Set(ingredients.split(' ')),
        allergens.slice(0, -1).split(', '),
    ] as Food;
};
const commonIngredients = (a: Set<string>, b: Set<string>) => {
    const common: Set<string> = new Set();
    for (const ai of a) {
        if (b.has(ai)) {
            common.add(ai);
        }
    }
    return common;
};
const sorter = sort<string[]>(ascendingBy(a => a[0]));
const solve = (ip: string) => {
    const food = mapLine(ip, lineToFood);
    const masterList = new Set<string>(
        food.reduce((acc, [, a]) => acc.concat(a), [] as string[])
    );
    const count = masterList.size;
    const allergens = new Map();
    while (allergens.size < count) {
        for (const allergen of masterList) {
            const impacted = food
                .filter(([, fa]) => fa.includes(allergen))
                .map(([il]) => il)
                .reduce(commonIngredients);
            if (impacted.size === 1) {
                const [ii] = impacted.values();
                allergens.set(allergen, ii);
                food.forEach(([il]) => il.delete(ii));
            }
        }
    }
    const safe = food.reduce((acc, [il]) => acc + il.size, 0);
    const dangerous = sorter(Array.from(allergens.entries()))
        .map(a => a[1])
        .join();
    return [safe, dangerous];
};

test('21', () => {
    expect(solve('21-test')).toEqual([5, 'mxmxvkd,sqjhc,fvjkl']);
    expect(solve('21')).toEqual([
        2282,
        'vrzkz,zjsh,hphcb,mbdksj,vzzxl,ctmzsr,rkzqs,zmhnj',
    ]);
});
