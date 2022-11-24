module D05

open Common
open System.Text.RegularExpressions
open Xunit

let lineRegEx = "([0-9]+),([0-9]+) -> ([0-9]+),([0-9]+)"

type LineType =
   | HorizontalOrVertical
   | Diagonal

type StartAndEnd = int * int * int * int

type Line = {
    points : string list
    lineType : LineType
}

let rec collectPoints ((x1, y1, x2, y2): StartAndEnd) (points: string list) (xs: int) (ys: int) =
    let updated = (sprintf "%d:%d" x1 y1) :: points
    if x1 = x2 && y1 = y2 then
        updated
    else
        let nx = if x1 = x2 then x1 else x1 + xs
        let ny = if y1 = y2 then y1 else y1 + ys
        collectPoints (nx, ny, x2, y2) updated xs ys

let getPoints ((x1, y1, x2, y2): StartAndEnd) =
    let xs = if x1 < x2 then 1 else -1
    let ys = if y1 < y2 then 1 else -1
    collectPoints (x1, y1, x2, y2) List.empty xs ys

let getLineType ((x1, y1, x2, y2): StartAndEnd) : LineType = 
    if x1 = x2 || y1 = y2 then HorizontalOrVertical else Diagonal

let matchToLine (m: Match) =
    m.Groups
    |> Seq.skip 1
    |> Seq.map (fun g -> int g.Value)
    |> Seq.toArray
    |> (fun ln -> (ln[0], ln[1], ln[2], ln[3]))
    |> (fun pd -> {
        points = (getPoints pd)
        lineType = (getLineType pd)
    })

let dataToLines (fn: string) =
    Regex.Matches((readText fn), lineRegEx)
    |> Seq.map matchToLine
    |> Seq.toList

let countIntersections (ls: Line list) =
    ls
    |> List.collect (fun l -> l.points)
    |> List.countBy id
    |> List.filter (fun (_, c) -> c > 1)
    |> List.length

let solve (fn: string) =
    let lines = 
        fn 
        |> dataToLines 

    let hnvLines =
        lines
        |> List.filter (fun l -> l.lineType = LineType.HorizontalOrVertical)

    (countIntersections hnvLines, countIntersections lines)

[<Theory>]
[<InlineData("05-test", 5, 12)>]
[<InlineData("05", 5576, 18144)>]
let test fn ep1 ep2 =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
