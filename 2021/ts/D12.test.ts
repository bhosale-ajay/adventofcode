import { mapLine } from './util';

const lineToConnection = (l: string) => l.split('-');
const isSmallCave = (caveName: string) => caveName === caveName.toLowerCase();
type VisitStrategy = (toVisit: string, visited: string[]) => boolean;
const onlyOnce = (toVisit: string, visited: string[]) =>
    !visited.includes(toVisit);
const onlyTwice = (toVisit: string, visited: string[]) =>
    visited.filter(v => v === toVisit).length < 2;
const multipleTimes = (_toVisit: string, _visited: string[]) => true;
type CaveMap = Record<string, [VisitStrategy, string[]]>;
const getVisitingStrategy = (caveName: string): VisitStrategy =>
    isSmallCave(caveName) ? onlyOnce : multipleTimes;
const buildMap = (caveMap: CaveMap, [from, to]: string[]) => {
    caveMap[from] = caveMap[from] || [getVisitingStrategy(from), []];
    caveMap[from][1].push(to);
    caveMap[to] = caveMap[to] || [getVisitingStrategy(to), []];
    caveMap[to][1].push(from);
    return caveMap;
};

function findPaths(
    caveMap: CaveMap,
    current = 'start',
    visited = ['start']
): string[][] {
    if (current === 'end') {
        return [visited];
    }
    const [, connections] = caveMap[current];
    let paths: string[][] = [];
    for (const connection of connections.filter(c =>
        caveMap[c][0](c, visited)
    )) {
        const connectionPaths = findPaths(caveMap, connection, [
            ...visited,
            connection,
        ]);
        if (connectionPaths.length > 0) {
            paths = paths.concat(connectionPaths);
        }
    }
    return paths;
}

const solve = (fn: string): [number, number] => {
    const emptyMap: CaveMap = {
        start: [onlyOnce, []],
        end: [onlyOnce, []],
    };
    const caveMap = mapLine(fn, lineToConnection).reduce(buildMap, emptyMap);
    const p1 = findPaths(caveMap).length;
    const smallCaves = Object.keys(caveMap).filter(
        cn => isSmallCave(cn) && cn !== 'start' && cn !== 'end'
    );
    const distinctPaths = new Set<string>();
    for (const smallCave of smallCaves) {
        const [_, cs] = caveMap[smallCave];
        const updatedCaveMap: CaveMap = {
            ...caveMap,
            [smallCave]: [onlyTwice, cs],
        };
        findPaths(updatedCaveMap).forEach(p => distinctPaths.add(p.join()));
    }
    return [p1, distinctPaths.size];
};

test('12', () => {
    expect(solve('12-test-0')).toEqual([10, 36]);
    expect(solve('12-test-1')).toEqual([19, 103]);
    expect(solve('12-test-2')).toEqual([226, 3509]);
    expect(solve('12')).toEqual([3708, 93858]);
});
