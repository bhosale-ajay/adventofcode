module D052

open System
open Xunit
open Common

let points x1 y1 x2 y2 = 
    seq {
        let xd = if x1 < x2 then 1 else -1
        let yd = if y1 < y2 then 1 else -1
        let mutable x = x1
        let mutable y = y1
        while x <> x2 || y <> y2 do
            yield (sprintf "%d:%d" x y)
            if x <> x2 then
                x <- x + xd
            if y <> y2 then
                y <- y + yd
        yield (sprintf "%d:%d" x y)
    }

type Line = 
    {
        points : string list
        isHoriOrVert : bool
    }
    static member FromString (l: string) =
        let ps = l.Split ([|","; " -> "|], StringSplitOptions.None) |> Array.map int
        {
            points = points ps[0] ps[1] ps[2] ps[3] |> Seq.toList
            isHoriOrVert = ps[0] = ps[2] || ps[1] = ps[3]
        }

let countInteractions (visited: Set<string>, intersected : Set<string>) point =
    match (visited.Contains(point), intersected.Contains(point)) with
    | false, _ -> visited.Add point, intersected
    | true, false -> (visited, intersected.Add point)
    | _ -> (visited, intersected)

let countInteractionsForLine acc line =
    line.points
    |> Seq.fold countInteractions acc

let solve (fn: string) =
    let (hnvLines, diaLines) =
        fn
        |> mapLines Line.FromString 
        |> Array.partition (fun l -> l.isHoriOrVert)

    let (v, i) = 
        hnvLines
        |> Seq.fold countInteractionsForLine (Set.empty, Set.empty)

    let (_, i') =
        diaLines
        |> Seq.fold countInteractionsForLine (v, i)

    (i.Count, i'.Count)

[<Theory>]
[<InlineData("05-test", 5, 12)>]
[<InlineData("05", 5576, 18144)>]
let test fn ep1 ep2 =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)

