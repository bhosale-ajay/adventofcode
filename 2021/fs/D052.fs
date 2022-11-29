module D052

open System
open Xunit
open Common

type Point = string // Set of Point as int * int takes almost double the time 

type LineType =
    | Horizontal
    | Vertical
    | Diagonal

type Line = Set<Point> * LineType
        
let isDiagonal (_, lt) = lt <> Diagonal

let toPoint (a, b) = sprintf "%d:%d" a b

let sequneceToLine lt ps  : Line =
    (ps |> Seq.map toPoint |> Set.ofSeq, lt)

let buildLine x1 y1 x2 y2 = 
    let xd = if x1 < x2 then 1 else -1
    let yd = if y1 < y2 then 1 else -1
    if x1 = x2 then 
        seq { y1 .. yd .. y2 } 
        |> Seq.map (fun y -> (x1, y))
        |> sequneceToLine Horizontal
    else if y1 = y2 then 
        seq { x1 .. xd .. x2 } 
        |> Seq.map (fun x -> (x, y1))
        |> sequneceToLine Vertical
    else
        seq { x1 .. xd .. x2 } 
        |> Seq.zip <| seq { y1 .. yd .. y2 } 
        |> sequneceToLine Diagonal

let parseLine (l: string) =
    let ps = l.Split ([|","; " -> "|], StringSplitOptions.None) |> Array.map int
    match ps with
    | [|x1; y1; x2; y2|] -> Some (buildLine x1 y1 x2 y2)
    | _ -> None

let countInteractions (visited: Set<Point>, intersected : Set<Point>) point =
    match (visited.Contains(point), intersected.Contains(point)) with
    | false, _ -> visited.Add point, intersected
    | true, false -> (visited, intersected.Add point)
    | _ -> (visited, intersected)

let countInteractionsForLine acc (points, _) =
    points
    |> Seq.fold countInteractions acc

let solve (fn: string) =
    let (hnvLines, diaLines) =
        fn
        |> mapLines parseLine
        |> Array.choose id
        |> Array.partition isDiagonal

    let a, i = 
        hnvLines
        |> Seq.fold countInteractionsForLine (Set.empty, Set.empty)

    let _, i' = 
        diaLines
        |> Seq.fold countInteractionsForLine (a, i)
    (i.Count, i'.Count)

[<Theory>]
[<InlineData("05-test", 5, 12)>]
[<InlineData("05", 5576, 18144)>]
let test fn ep1 ep2 =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)

