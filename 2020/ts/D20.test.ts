import { assert } from 'console';
import { matchesToArray } from 'dotless';
import { getInput } from './util';

// Which side is connected to which tile
type Connections = Map<number, number>;
type Tile = [
    id: number,
    edges: string[],
    connections: Connections,
    data: string[][]
];
type TileMap = Map<number, Tile>;
// Indicates how much a tile is rotated or flipped
type RotationMap = [number, number, number, number];
type Transformation = [(d: string[][]) => void, RotationMap];
// 0 is TOP, 1 is LEFT, 2 is RIGHT, and 3 is BOTTOM
// This is same order returned by edges
const opposite = [3, 2, 1, 0];
class Placement {
    constructor(
        public size: number,
        public c: number,
        public r: number,
        public rm: RotationMap
    ) {}

    get key() {
        return `${this.c}:${this.r}`;
    }

    get inbound() {
        return (
            0 <= this.c &&
            this.c < this.size &&
            0 <= this.r &&
            this.r < this.size
        );
    }

    connect(fc: number, rm: RotationMap): Placement {
        let c = this.c;
        let r = this.r;
        if (fc === 0) {
            // Connected at TOP
            r = r - 1;
        } else if (fc === 1) {
            // Connected at LEFT
            c = c - 1;
        } else if (fc === 2) {
            // Connected at RIGHT
            c = c + 1;
        } else if (fc === 3) {
            // Connected at BOTTOM
            r = r + 1;
        }
        return new Placement(this.size, c, r, rm);
    }

    // connections of first tile decides its placement
    // 0 TOP, 1 LEFT, 2 RIGHT, 3 BOTTOM
    // connected at 2 and 3 (sum 5) === top right corner
    // connected at 1 and 3 (sum 4) === top left corner
    // connected at 0 and 2 (sum 2) === bottom left corner
    // connected at 0 and 1 (sum 1) === bottom right corner
    static first(tile: Tile, size: number): Placement {
        const [c1, c2] = tile[2].keys();
        const sum = c1 + c2;
        const [c, r] =
            sum === 5
                ? [0, 0]
                : sum === 4
                ? [size - 1, 0]
                : sum === 2
                ? [0, size - 1]
                : [size - 1, size - 1];
        return new Placement(size, c, r, [0, 1, 2, 3]);
    }
}
type TilePlacement = Map<string, [Tile, Placement]>;
type Image = string[][];
const none = (_: string[][]) => {
    /**/
};

const rotate90 = (a: string[][]) => {
    const n = a.length;
    for (let i = 0; i < n / 2; i++) {
        for (let j = i; j < n - i - 1; j++) {
            const tmp = a[i][j];
            a[i][j] = a[n - j - 1][i];
            a[n - j - 1][i] = a[n - i - 1][n - j - 1];
            a[n - i - 1][n - j - 1] = a[j][n - i - 1];
            a[j][n - i - 1] = tmp;
        }
    }
};

const flip = (a: string[][]) => {
    const n = a.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n / 2; j++) {
            const tmp = a[i][j];
            a[i][j] = a[i][n - j - 1];
            a[i][n - j - 1] = tmp;
        }
    }
};

// Only 8 possible states
const transformations: Transformation[] = [
    [none, [0, 1, 2, 3]],
    [rotate90, [1, 3, 0, 2]],
    [rotate90, [3, 2, 1, 0]],
    [rotate90, [2, 0, 3, 1]],
    [flip, [2, 3, 0, 1]], // Flips horizontally
    [rotate90, [3, 1, 2, 0]],
    [rotate90, [1, 0, 3, 2]],
    [rotate90, [0, 2, 1, 3]],
];
const getEdges = (td: string[][]) => [
    td[0].join(''),
    td.reduce((acc, l) => acc + l[0], ''),
    td.reduce((acc, l) => acc + l[l.length - 1], ''),
    td[td.length - 1].join(''),
];
const matchToTile = (ts: RegExpExecArray): [number, Tile] => {
    const id = +ts[1];
    const data = ts[2]
        .trim()
        .split('\n')
        .map(l => l.split(''));
    const edges = getEdges(data);
    return [
        id,
        [
            id,
            edges.concat(edges.map(e => e.split('').reverse().join(''))),
            new Map(),
            data,
        ],
    ];
};
const regex = /Tile\s(\d+):\s+([.#\s]+)/g;
const parse = (ip: string): TileMap =>
    new Map(matchesToArray(getInput(ip), regex, matchToTile));

const monster = [
    '                  # '.split(''),
    '#    ##    ##    ###'.split(''),
    ' #  #  #  #  #  #   '.split(''),
];
const monsterHeight = monster.length;
const monsterWidth = monster[0].length;
const monsterCoordinates: [number, number][] = [];
for (let r = 0; r < monsterHeight; r++) {
    for (let c = 0; c < monsterWidth; c++) {
        if (monster[r][c] === '#') {
            monsterCoordinates.push([r, c]);
        }
    }
}

const setConnectionsFindCornerTiles = (tiles: TileMap) => {
    const cornerTiles: Tile[] = [];
    for (const [, tile] of tiles) {
        const [id, edges, connections] = tile;
        for (const [, otherTile] of tiles) {
            const [oId, oEdges] = otherTile;
            if (id === oId) {
                continue;
            }
            for (let side = 0; side < 4; side++) {
                if (oEdges.includes(edges[side])) {
                    connections.set(side, oId);
                    break;
                }
            }
        }
        if (connections.size === 2) {
            cornerTiles.push(tile);
        }
    }
    return cornerTiles;
};

const placeTiles = (tiles: TileMap, ft: Tile, size: number) => {
    const ftp = Placement.first(ft, size);
    const queue: string[] = [ftp.key];
    const visited = new Set<number>([ft[0]]);
    const map = new Map<string, [Tile, Placement]>();
    map.set(ftp.key, [ft, ftp]);
    while (queue.length > 0) {
        const cpk = queue.shift() as string;
        const [tile, cp] = map.get(cpk) as [Tile, Placement];
        const tileEdges = tile[1];
        for (const [side, cid] of tile[2]) {
            if (visited.has(cid)) {
                continue;
            }
            visited.add(cid);
            const connected = tiles.get(cid) as Tile;
            // ot will be 0, 1, 2, 3
            // This will be corrected base on how the tile is rotated/flipped
            const csi = cp.rm.indexOf(side);
            const edge = tileEdges[csi];
            const oppositeSI = opposite[csi];
            const data = connected[3];
            let matchFound = false;
            // transform the other side
            // until it matches the edge on correct side
            for (const [transform, rm] of transformations) {
                transform(data);
                const updatesEdges = getEdges(data);
                if (updatesEdges[oppositeSI] === edge) {
                    const p = cp.connect(csi, rm);
                    assert(p.inbound, 'Next placement should be in bound.');
                    assert(!map.has(p.key), 'Duplicate placement.');
                    // console.log(`Placed ${oid} at ${p.key}`);
                    queue.push(p.key);
                    connected[1] = updatesEdges;
                    connected[3] = data;
                    map.set(p.key, [connected, p]);
                    matchFound = true;
                    break;
                }
            }
            assert(matchFound, 'Connections must have a match.');
        }
    }
    return map;
};

const buildImage = (
    map: TilePlacement,
    squareSize: number,
    tileImageSize: number
): Image => {
    const imageWidth = squareSize * tileImageSize;
    const image = new Array(imageWidth);
    for (let i = 0; i < imageWidth; i++) {
        image[i] = new Array(imageWidth);
    }
    for (let r = 0; r < squareSize; r++) {
        for (let c = 0; c < squareSize; c++) {
            const [tile] = map.get(`${c}:${r}`) as [Tile, Placement];
            const tileImage = tile[3];
            for (let k = 1; k <= tileImageSize; k++) {
                for (let l = 1; l <= tileImageSize; l++) {
                    image[r * tileImageSize + k - 1][
                        c * tileImageSize + l - 1
                    ] = tileImage[k][l];
                }
            }
        }
    }
    return image;
};

const searchAndReplaceMonster = (image: Image, imageSize: number) => {
    let monsterFound = false;
    for (const [transform] of transformations) {
        transform(image);
        for (let r = 0; r <= imageSize - monsterHeight; r++) {
            for (let c = 0; c <= imageSize - monsterWidth; c++) {
                if (
                    monsterCoordinates.every(
                        ([k, l]) => image[r + k][c + l] === '#'
                    )
                ) {
                    monsterFound = true;
                    monsterCoordinates.forEach(
                        ([k, l]) => (image[r + k][c + l] = '0')
                    );
                }
            }
        }
        if (monsterFound) {
            return true;
        }
    }
    return false;
};

const countWaves = (image: Image, imageSize: number) => {
    let waves = 0;
    for (let r = 0; r < imageSize; r++) {
        for (let c = 0; c < imageSize; c++) {
            if (image[r][c] === '#') {
                waves = waves + 1;
            }
        }
    }
    return waves;
};

const solve = (ip: string) => {
    const tiles = parse(ip);
    const squareSize = Math.sqrt(tiles.size);

    const cornerTiles = setConnectionsFindCornerTiles(tiles);
    assert(cornerTiles.length === 4, 'Must have 4 corner sides.');
    const firstTile = cornerTiles[0];

    const map = placeTiles(tiles, firstTile, squareSize);
    assert(map.size === tiles.size, 'All tiles should be in map.');

    const image = buildImage(map, squareSize, firstTile[3].length - 2);
    const imageSize = image.length;

    const monsterFound = searchAndReplaceMonster(image, imageSize);

    const p1 = cornerTiles.reduce((p, [id]) => p * id, 1);
    return [p1, monsterFound ? countWaves(image, imageSize) : -1];
};

test('20', () => {
    expect(solve('20-test')).toEqual([20899048083289, 273]);
    expect(solve('20')).toEqual([8425574315321, 1841]);
});
