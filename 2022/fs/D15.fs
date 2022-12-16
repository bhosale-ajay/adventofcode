module D15

open Common
open System.Text.RegularExpressions
open Xunit

type SensorInfo = int array * int
let distance (c : int array) =
    abs(c[0] - c[2]) + abs(c[1] - c[3])

let parseLine l : SensorInfo =
    Regex.Matches(l,"(-?\d+)")
    |> Seq.map (fun vs -> int vs.Groups[0].Value)
    |> Array.ofSeq
    |> (fun c -> c, distance c)

let closerToRow row ((c, d) : SensorInfo) =
    abs (row - c[1]) < d;

let beaconsAtRow  row ((c , _) : SensorInfo) =
    c[3] = row;

let coverageAtRow row ((c ,d) : SensorInfo) =
    let r = abs (d - abs(row - c[1]))
    c[0] - r, c[0] + r

let maxCoverageAtRow maxY row ((c ,d) : SensorInfo) =
    let r = abs (d - abs(row - c[1]))
    max 0 (c[0] - r), min maxY (c[0] + r)

let rangeSorter (ax, ay) (bx, by) =
    match ax - bx with
    | 0 -> ay - by
    | d -> d

let foldMerge (acc : List<int * int>) (a0, a1) =
    match acc with
    | [] -> [a0, a1]
    | (l0, l1) :: tail when a0 <= (l1 + 1) && l1 < a1 -> (l0, a1) :: tail
    | (_, l1)  :: _    when a0 <= (l1 + 1) -> acc
    | _ -> (a0, a1) :: acc

let merge (ranges : seq<int * int>) =
    ranges
    |> Seq.sortWith rangeSorter
    |> Seq.fold foldMerge List.empty

let sumRanges acc (s, e) = acc + abs (e + 1 - s)

let solveP1 (data: SensorInfo array) row =
    let pointsInRange =
        data
        |> Seq.filter (closerToRow row)
        |> Seq.map (coverageAtRow row)
        |> merge
        |> Seq.fold sumRanges 0
    let beaconsCount =
        data
        |> Seq.filter (beaconsAtRow row)
        |> Seq.map (fun (c,_) -> c[2])
        |> Seq.distinct
        |> Seq.length
    pointsInRange - beaconsCount

let solveP2 (data: SensorInfo array) maxY =
    let coverageAtRow' = maxCoverageAtRow maxY
    [maxY .. -1 .. 0]
    |> Seq.pick (fun row ->
        data
        |> Seq.filter (closerToRow row)
        |> Seq.map (coverageAtRow' row)
        |> merge
        |> (fun s ->
            match Seq.length s with
            | n when n > 1 -> // means a gap a range
                s
                |> Seq.head // Range with highest X (As merge append at head)
                |> fst // will give xstart of range, (x will be -1 of xs)
                |> (fun xs -> Some ((int64 xs - 1L) * 4_000_000L + int64 row))
            | _ -> None
        )
    )

[<Theory>]
[<InlineData("15-test", 10, 26, 20, 56000011L)>]
[<InlineData("15", 2000000, 5832528, 4000000, 13360899249595L)>]
let test15 fn p1row ep1 p2max ep2 =
    let data = fn |> seqOfLines |> Seq.map parseLine |> Array.ofSeq
    Assert.Equal(ep1, solveP1 data p1row)
    if fn = "15-test" then // Skip this costly test
        Assert.Equal(ep2, solveP2 data p2max)
