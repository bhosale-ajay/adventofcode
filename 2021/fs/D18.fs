module D18

open Common
open Xunit

// value * depth
type SnailfishNumber = int * int

let parseLine line =
    let rec parseLineRec (l: char seq) depth acc =
        match Seq.head l, Seq.tail l, depth with
        | '[', tail, _ -> parseLineRec tail (depth + 1) acc
        | ']', _, 1 -> acc
        | ']', tail, _ -> parseLineRec tail (depth - 1) acc
        | ',', tail, _ -> parseLineRec tail depth acc
        | n, tail, _ when n >= '0' && n <= '9' ->
            parseLineRec tail depth (SnailfishNumber(n |> string |> int, depth) :: acc)
        | c, _, _ -> failwith (sprintf "Wrong character : %c" c)

    parseLineRec line 0 List.empty |> List.rev

let aboutToExplode sfn = (snd sfn) >= 5

let increaseDepth (n, d) = SnailfishNumber(n, d + 1)

let shouldSplit sfn = (fst sfn) >= 10

let addToLeft pair c =
    let self = SnailfishNumber(0, snd c - 1)

    match pair with
    | [] -> self :: pair
    | left :: tail ->
        self
        :: SnailfishNumber(fst c + fst left, snd left)
           :: tail

let addToRight pair =
    match pair with
    | next :: right :: tail ->
        SnailfishNumber(fst next + fst right, snd right)
        :: tail
    | _ -> []

let explode pair =
    let rec checkAndExplode result toVisit hasExploed =
        match toVisit with
        | [] ->
            if hasExploed then
                List.rev result
            else
                pair
        | current :: tail ->
            match aboutToExplode current with
            | false -> checkAndExplode (current :: result) tail hasExploed
            | true -> checkAndExplode (addToLeft result current) (addToRight tail) true

    checkAndExplode List.empty pair false

let rec concat src dest =
    match src with
    | [] -> dest
    | head :: tail -> concat tail (head :: dest)

let rec split pair =
    let rec checkAndSplit result toVisit =
        match toVisit with
        | [] -> pair // It means no split happend return the original pair
        | current :: tail ->
            match shouldSplit current with
            | false -> checkAndSplit (current :: result) tail
            | true ->
                let n, d = current
                let a = SnailfishNumber(n / 2, d + 1)
                let b = SnailfishNumber(n - n / 2, d + 1)
                // concat is fast way to reverse whatever result so far
                (concat result (a :: b :: tail))
                |> explode
                |> split

    checkAndSplit List.empty pair

let add a b =
    (a @ b)
    |> List.map increaseDepth
    |> explode
    |> split

let checkMagnitude (p: SnailfishNumber list) =
    let rec recursive pair result reduced depth =
        match pair with
        | a :: b :: tail ->
            match snd a = snd b && snd a = depth with
            | true ->
                recursive
                    (tail)
                    (SnailfishNumber(fst a * 3 + fst b * 2, snd a - 1)
                     :: result)
                    true
                    depth
            | false -> recursive (b :: tail) (a :: result) reduced depth
        | a :: tail -> recursive (tail) (a :: result) reduced depth
        | [] ->
            match List.length result with
            | 1 -> fst result.[0]
            | _ when reduced -> recursive (List.rev result) List.empty false (depth - 1)
            | _ -> failwith "Not able to reduce for magnitude"

    let maxDepth = p |> List.maxBy snd |> snd
    recursive p List.empty false maxDepth

let addAndCheckMagnitude (pair: SnailfishNumber list []) (ai, bi) =
    (add pair.[ai] pair.[bi]) |> checkMagnitude

let findLargestMagnitude input =
    let li = Array.length input - 1

    Seq.allPairs (seq { 0 .. li }) (seq { 0 .. li })
    |> Seq.choose (fun (ai, bi) -> if ai <> bi then Some(ai, bi) else None)
    |> Seq.map (addAndCheckMagnitude input)
    |> Seq.max

let solve fn =
    let lines = fn |> mapLines parseLine

    let magnitudeOfSum =
        lines |> Array.reduce add |> checkMagnitude

    let largestMagnitude = findLargestMagnitude lines
    magnitudeOfSum, largestMagnitude

[<Theory>]
[<InlineData("18-test", 4140, 3993)>]
[<InlineData("18", 3411, 4680)>]
let test fn (ep1: int) (ep2: int) =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
