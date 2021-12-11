module D11

open Common
open Xunit

type NeighborUpdater = int * int -> (int * int) option
type NeighborFinder = int * int -> (int * int) list

let charToInt c = c |> string |> int

let parseLine (l: string) = l.ToCharArray() |> Array.map charToInt

let parse fn =
    fn |> readLines |> Array.map parseLine |> array2D

let neighbors (rc: int, cc: int) (r: int, c: int) =
    [ r - 1, c - 1 // Top Left
      r - 1, c + 0 // Top
      r - 1, c + 1 // Top Right
      r + 0, c - 1 // Left
      r + 0, c + 1 // Right
      r + 1, c - 1 // Bottom Left
      r + 1, c + 0 // Bottom
      r + 1, c + 1 ] // Bottom Right
    |> List.filter (fun (ri, ci) -> 0 <= ri && ri < rc && 0 <= ci && ci < cc)

let resetAndIncrementEnergeyLevel (o: int [,]) =
    o
    |> Array2D.iteri (fun ri ci el -> o.[ ri, ci ] <- (el % 10) + 1)
    o

let isReadyForFlash ri ci el = if el > 9 then Some(ri, ci) else None

let findReadyToFlash (os: int [,]) =
    os
    |> Array2D.mapi isReadyForFlash
    |> Seq.cast<(int * int) option>
    |> Seq.choose id
    |> Seq.toList

let updadeNeighbors (os: int [,]) ((ri, ci): int * int) =
    let el = os.[ ri, ci ]

    if el <= 9 then
        os.[ ri, ci ] <- el + 1

        if os.[ ri, ci ] > 9 then
            Some(ri, ci)
        else
            None
    else
        None

let rec flash (neighborFinder: NeighborFinder) (neighborUpdater: NeighborUpdater) (seed: (int * int) list) =
    let rec flashLocations (locations: (int * int) list) =
        match locations with
        | [] -> 0
        | location :: tail ->
            let readyNeighbors =
                location
                |> neighborFinder
                |> List.choose neighborUpdater

            1 + (flashLocations (tail @ readyNeighbors))

    flashLocations seed

let solve (fn: string) =
    let mutable totalFlashed = 0
    let mutable stepIndex = 1
    let mutable fullFlashStep = 0
    let os = parse fn
    let rowCount = Array2D.length1 os
    let colCount = Array2D.length2 os
    let neighborFinder = neighbors (rowCount, colCount)
    let neighborUpdater = updadeNeighbors os
    let flasher = flash neighborFinder neighborUpdater

    while stepIndex <= 100 || fullFlashStep = 0 do
        let flashed =
            os
            |> resetAndIncrementEnergeyLevel
            |> findReadyToFlash
            |> flasher

        fullFlashStep <-
            if flashed = 100 && fullFlashStep = 0 then
                stepIndex
            else
                fullFlashStep

        totalFlashed <-
            if stepIndex <= 100 then
                totalFlashed + flashed
            else
                totalFlashed

        stepIndex <- stepIndex + 1

    (totalFlashed, fullFlashStep)

[<Theory>]
[<InlineData("11-test", 1656, 195)>]
[<InlineData("11", 1632, 303)>]
let test fn (ep1: int) (ep2: int64) =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
