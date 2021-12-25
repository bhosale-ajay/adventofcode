module D25

open Common
open Xunit

type Position = (int * int)
type Herd = Position []
type Navigator = Position -> Position
let eastNavigator n (r, c) : Position = if c < n then r, c + 1 else r, 0
let southNavigator n (r, c) : Position = if r < n then r + 1, c else 0, c

let EAST_HERD = '>'
let SOUTH_HERD = 'v'
let EMPTY = '.'

let locateHerd ((east: Position list), (south: Position list), (sea: char [,])) (r: int, c: int, o: char) =
    if o = EAST_HERD then
        sea.[r, c] <- o
        (r, c) :: east, south, sea
    elif o = SOUTH_HERD then
        sea.[r, c] <- o
        east, (r, c) :: south, sea
    else
        east, south, sea

let isMovable (sea: char [,]) (nav: Navigator) i (sc: Position) : Option<int * Position * Position> =
    let (nr, nc) = nav sc

    if sea.[nr, nc] = EMPTY then
        Some(i, sc, (nr, nc))
    else
        None

let move (sea: char [,]) (herd: Herd) (i, (fr, fc): Position, (tr, tc): Position) =
    sea.[tr, tc] <- sea.[fr, fc]
    sea.[fr, fc] <- EMPTY
    herd.[i] <- (tr, tc)

let step (sea: char [,]) (nav: Navigator) (herd: Herd) =
    let movable =
        herd
        |> Array.mapi (isMovable sea nav)
        |> Array.choose id

    movable |> Array.iter (move sea herd)
    movable.Length > 0

let solve fn =
    let data =
        fn
        |> readLines
        |> Array.mapi (fun r l -> l.ToCharArray() |> Array.mapi (fun c o -> r, c, o))
        |> Array.concat

    let rl, cl, _ = data |> Array.last

    let sea =
        Array2D.init (rl + 1) (cl + 1) (fun _i _j -> EMPTY)

    let eastHerd, southHerd =
        data
        |> Array.fold locateHerd (List.empty, List.empty, sea)
        |> (fun (eh, sh, _) -> List.toArray eh, List.toArray sh)

    let eastNav = eastNavigator cl
    let southNav = southNavigator rl

    let rec takeStep sc =
        let eastMoved = step sea eastNav eastHerd
        let southMoved = step sea southNav southHerd

        match (eastMoved || southMoved) with
        | true -> takeStep (sc + 1)
        | false -> sc

    takeStep 1

[<Theory>]
[<InlineData("25-test", 58)>]
[<InlineData("25", 486)>]
let test (fn: string) (ep: int32) =
    let a = solve fn
    Assert.Equal(ep, a)
