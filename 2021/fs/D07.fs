module D07

open Common
open Xunit

let parseInput (fn: string) =
    fn
    |> readText
    |> (fun s -> s.Split ',')
    |> Array.map int
    |> Array.sort

let range n = [| n - 1; n; n + 1 |]

let medianRange(ps: int[]) =
    let mi = ps.Length / 2
    (
        if mi % 2 = 0 
        then (ps[mi - 1] + ps[mi]) / 2
        else ps[mi]
    ) 
    |> range

let averageRange ps =
    ps
    |> Array.sum 
    |> (fun s -> s / (ps.Length))
    |> range

let costAtConstantRate anchor p = abs(anchor - p)

let costAtIncreasingRate anchor p =
    let diff = abs(anchor - p)
    diff * (diff + 1) / 2

let sum (ps: int[]) (costFunction: int -> int -> int) (anchor: int) =
    ps
    |> Array.map (costFunction anchor)
    |> Array.sum

let findFuelCost (rangeFinder : int[] -> int[]) (costFunction: int -> int -> int) (ps: int[])  =
    ps
    |> rangeFinder
    |> Array.map (sum ps costFunction)
    |> Array.min

let solve fn =
    let positions = fn |> parseInput
    let p1 = positions |> findFuelCost medianRange costAtConstantRate
    let p2 = positions |> findFuelCost averageRange costAtIncreasingRate
    (p1, p2)

[<Theory>]
[<InlineData("07-test", 37, 168)>]
[<InlineData("07", 352997, 101571302)>]
let test fn (ep1: int64) (ep2:int64) =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
