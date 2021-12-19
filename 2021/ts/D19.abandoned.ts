import { getLines } from './util';

type Match = {
    scannerID: number;
    beaconID: number;
    votes: number;
};

type Beacon = {
    beaconID: number;
    scannerID: number;
    x: number;
    y: number;
    z: number;
    dist: number[];
    matches: Match[][];
};

const lineToBeacon = (
    line: string,
    scannerID: number,
    beaconID: number
): Beacon => {
    const [x, y, z] = line.split(',').map(n => +n);
    return { beaconID, scannerID, x, y, z, dist: [], matches: [] };
};

type Scanner = {
    beacons: Beacon[];
};

const distance = (a: Beacon, b: Beacon): number => {
    return Math.sqrt(
        Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2)
    );
};

const parse = (fn: string): Scanner[] => {
    const result: Scanner[] = [];
    let current: Scanner | undefined = undefined;
    let scannerID = 0;
    for (const line of getLines(fn)) {
        if (line.startsWith('--')) {
            current = {
                beacons: [],
            };
            result.push(current);
            scannerID = result.length - 1;
        } else if (current !== undefined && line !== '') {
            const beaconID = current.beacons.length;
            current.beacons.push(lineToBeacon(line, scannerID, beaconID));
        }
    }
    return result;
};

const setDistance = (report: Scanner[]) => {
    for (const scanner of report) {
        const beacons = scanner.beacons;
        for (let bo = 0; bo < beacons.length; bo++) {
            const beacon = beacons[bo];
            for (let bi = bo + 1; bi < beacons.length; bi++) {
                const dist = distance(beacon, beacons[bi]);
                beacon.dist.push(dist);
                beacons[bi].dist.push(dist);
            }
            beacon.dist.sort((a, b) => (a < b ? -1 : 1));
        }
    }
};

const addVotesForMatch = (
    matches: Match[][],
    scannerID: number,
    beaconID: number,
    votes: number
) => {
    if (matches[scannerID] === undefined) {
        matches[scannerID] = [];
    }
    matches[scannerID].push({ scannerID, beaconID, votes });
};

const findMatches = (report: Scanner[]) => {
    const counted = new Set<string>();
    // const connections = new Set<string>();
    // const mappingWithZero = [[1, 1, 1]];
    let count = 0;
    for (let osd = 0; osd < report.length; osd++) {
        const obs = report[osd].beacons;
        for (let obd = 0; obd < obs.length; obd++) {
            const ob = obs[obd];
            for (let isd = osd + 1; isd < report.length; isd++) {
                const ibs = report[isd].beacons;
                for (let ibd = 0; ibd < ibs.length; ibd++) {
                    const ib = ibs[ibd];
                    const votes = ob.dist.filter(
                        a => ib.dist.findIndex(b => a === b) > -1
                    ).length;
                    addVotesForMatch(ob.matches, isd, ibd, votes);
                    addVotesForMatch(ib.matches, osd, obd, votes);
                }
            }
            for (let smi = 0; smi < ob.matches.length; smi++) {
                if (ob.matches[smi] === undefined) {
                    continue;
                }
                const maxVotes = ob.matches[smi].reduce(
                    (mv, m) => Math.max(mv, m.votes),
                    0
                );
                if (maxVotes === 0) {
                    ob.matches[smi] = []; // No match for this beacon in this scanner
                } else {
                    ob.matches[smi] = ob.matches[smi].filter(
                        m => m.votes === maxVotes
                    );
                    if (ob.matches[smi].length === 1) {
                        const match = ob.matches[smi][0];
                        const matchKey = `${match.scannerID}:${match.beaconID}`;
                        // const connection =
                        //     ob.scannerID < match.scannerID
                        //         ? `${ob.scannerID}:${ob.beaconID} => ${match.scannerID}:${match.beaconID} `
                        //         : `${match.scannerID}:${match.beaconID} => ${ob.scannerID}:${ob.beaconID}`;
                        // if(!connections.has(connection)) {
                        //     console.log(connection);
                        //     connections.add(connection);
                        // }
                        counted.add(matchKey);
                        // if (mappingWithZero[smi] === undefined && mappingWithZero[osd] !== undefined) {
                        //     const matchingBeacon = report[match.scannerID].beacons[match.beaconID];
                        //     mappingWithZero[smi] = [
                        //         ob.x, matchingBeacon.x,
                        //         ob.y, matchingBeacon.y,
                        //         ob.z, matchingBeacon.z
                        //     ];
                        // }
                    } else {
                        // console.log(
                        //     `Beacon ${ob.beaconID} from scanner ${ob.scannerID} has ${ob.matches[smi].length} matches with votes ${maxVotes} in scanner ${smi}.`
                        // );
                        // for (const { beaconID } of ob.matches[smi]) {
                        //     const otherContenders = report[smi].beacons[
                        //         beaconID
                        //     ].matches[ob.scannerID].filter(
                        //         m => m.beaconID !== ob.beaconID && m.votes >= maxVotes
                        //     );
                        //     for (const oc of otherContenders) {
                        //         console.log(`The ${beaconID} has one more contender at ${oc.beaconID} with votes ${oc.votes}`);
                        //     }
                        // }
                    }
                }
            }
            const beaconKey = `${ob.scannerID}:${ob.beaconID}`;
            if (!counted.has(beaconKey)) {
                counted.add(beaconKey);
                count = count + 1;
            }
        }
    }
    // console.log(mappingWithZero.map((v, i) => `For ${i} ${v ? v : "No Mapping"}`).join('\n'));
    console.log(count);
};

const solve = (fn: string) => {
    const report = parse(fn);
    setDistance(report);
    findMatches(report);
};

solve('19-test'); // 79
solve('19'); // 332

// console.log(`Connections for ${asi} : ${[...report[asi].overlapping]}`);
// const connections = report[asi].connections;
// for (const c of Object.keys(connections)) {
//     if (report[asi].overlapping.has(+c)) {
//         const connectionInfo = connections[+c];
//         console.log(
//             `For ${c} there are ${connectionInfo.length} matching points.`
//         );
//         // for (const [p1, p2] of connectionInfo) {
//         //     console.log(
//         //         `${p1.x},${p1.x},${p1.z} === ${p2.x},${p2.x},${p2.z}`
//         //     );
//         // }
//     }
// }
