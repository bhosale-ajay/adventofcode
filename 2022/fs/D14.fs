module D14

open Common
open System
open Xunit

let count s = s |> Set.count

let add c p = c |> Set.add p

let lineToNumbers (l : string) =
    l.Split ([|","; " -> "|], StringSplitOptions.None) |> Array.map int

let lineMaker f vf vt vertical =
    [min vf vt .. 1 .. max vf vt]
    |> Seq.map (fun v -> if vertical then (f, v) else (v, f))

let collectPoints x1 y1 x2 y2 =
    match x1 = x2 with
    | true -> lineMaker x1 y1 y2 true
    | false -> lineMaker y1 x1 x2 false

let buildCaveMap cave l =
    let ns = lineToNumbers l
    [0 .. 2 .. ns.Length - 4]
    |> Seq.collect (fun i -> collectPoints ns[i] ns[i+1] ns[i+2] ns[i+3])
    |> Seq.fold add cave

let pouringPoint = 500, 0

let rec watch abyss (cave, p1) =
    let rec drop cave p1 (x, y) =
        [ x, y + 1; x - 1, y + 1; x + 1, y + 1 ]
        |> Seq.tryFind (fun n -> not (Set.contains n cave))
        |> (function
            | None -> add cave (x, y), p1
            | Some (nx, ny) when ny = abyss ->
                add cave (nx, ny),
                (if p1 = -1 then count cave else p1)
            | Some n -> drop cave p1 n)

    match (Set.contains pouringPoint cave) with
    | true -> p1, count cave
    | false -> watch abyss (drop cave p1 pouringPoint)

let solve fn =
    let cave =
        fn
        |> seqOfLines
        |> Seq.fold buildCaveMap Set.empty
    let abyss = (cave |> Seq.maxBy snd |> snd) + 1
    let r = count cave
    let rns = watch abyss (cave, -1)
    (fst rns - r), (snd rns - r)

[<Theory>]
[<InlineData("14-test", 24, 93)>]
//[<InlineData("14", 885, 28691)>]
let test14 fn ep1 ep2 =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
