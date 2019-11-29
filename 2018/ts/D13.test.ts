import { ascendingBy, sort } from "dotless";
import { Dictionary, getInput } from "./util";

interface Cart {
    x: number;
    y: number;
    t: number;  // turn
    d: number;  // direction
    s: boolean; // safe
}
type Track = (c: Cart) => Cart;
type CartBuilder = (x: number, y: number) => Cart;

const [L, R, ST] = [0, 1, 2];
const [N, E, W, S] = [0, 1, 2, 3];
const trackImpact: Dictionary<number[][]> = {
    [N]: [[-1,  0, W], [ 1,  0, E], [ 0, -1, N]],
    [E]: [[ 0, -1, N], [ 0,  1, S], [ 1,  0, E]],
    [W]: [[ 0,  1, S], [ 0, -1, N], [-1,  0, W]],
    [S]: [[ 1,  0, E], [ -1, 0, W], [ 0,  1, S]],
};
const build = (d: number) => (x: number, y: number): Cart => ({x, y, d, t: L, s: true});
const moveCart = ({x, y, t, d, s}: Cart, impact: number, nt: number| null = null): Cart => {
    const i = trackImpact[d][impact];
    return { x: x + i[0], y: y + i[1], d: i[2], t: nt !== null ? nt : t, s };
};
const straightTrack: Track = c => moveCart(c, ST);
const curveForward: Track = c =>  moveCart(c, c.d === N || c.d === S ? R : L);
const curveBackward: Track = c => moveCart(c, c.d === N || c.d === S ? L : R);
const intersection: Track = c => moveCart(c, c.t, c.t === L ? ST : (c.t === ST ? R : L));

const trackTypes: Dictionary<Track> = {
    "/": curveForward,  "\\": curveBackward, "-": straightTrack, "|": straightTrack, "+": intersection,
    "v": straightTrack, "^" : straightTrack, ">": straightTrack, "<": straightTrack
};

const cartBuilders: Dictionary<CartBuilder> = {
    "^"  : build(N), ">"  : build(E),
    "<"  : build(W), "v"  : build(S),
};

const parse = (ip: string) => getInput(ip).split("\n")
    .reduce(([tracks, carts], l, y) => {
        l.split("").forEach((indicator, x) => {
            if (trackTypes[indicator] !== undefined) {
                tracks[`${x}_${y}`] = trackTypes[indicator];
            }
            if (cartBuilders[indicator] !== undefined) {
                carts.push(cartBuilders[indicator](x, y));
            }
        });
        return [tracks, carts];
    }, [{}, []] as [Dictionary<Track>, Cart[]]) as [Dictionary<Track>, Cart[]];

const solve = (ip: string) => {
    // tslint:disable-next-line:prefer-const
    let [ tracks, carts ] = parse(ip);
    let [ firstCrash, firstCrashLocation, lastCartLocation] = [ false, "", "" ];
    const sorter = sort(ascendingBy("y"), ascendingBy("x"));
    while (carts.length > 1) {
        carts = sorter(carts)
                    .reduce((movedCarts, cart, index) => {
                        const movedCart = tracks[`${cart.x}_${cart.y}`](cart);
                        let conflict = carts.find((oc, oci) => oci > index && oc.x === movedCart.x &&  oc.y === movedCart.y);
                        if (conflict === undefined) {
                            conflict = movedCarts.find(oc => oc.x === movedCart.x &&  oc.y === movedCart.y);
                        }
                        if (conflict !== undefined) {
                            conflict.s = false;
                            movedCart.s = false;
                            if (!firstCrash) {
                                firstCrash = true;
                                firstCrashLocation = `${movedCart.x},${movedCart.y}`;
                            }
                        }
                        movedCarts.push(movedCart);
                        return movedCarts;
                    }, [] as Cart[])
                    .filter(c => c.s);
    }
    if (carts.length > 0) {
        lastCartLocation = `${carts[0].x},${carts[0].y}`;
    }
    return [firstCrashLocation, lastCartLocation];
};

test("13", () => {
    expect(solve("13-test1")).toEqual(["7,3", ""]);
    expect(solve("13")).toEqual(["26,99", "62,48"]);
    expect(solve("13-test2")).toEqual(["2,0", "6,4"]);
});
