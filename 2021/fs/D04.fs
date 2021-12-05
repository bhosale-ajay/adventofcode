module D04

open Common
open System.Text.RegularExpressions
open Xunit

type Board = {
    lines : int Set list
    bingo : bool 
    numbersTried : int
    winningNumber : int }

let lineToNumbers (line:string) =
    Regex.Split(line.Trim(), "\s+")
    |> Array.map int
    |> Array.toList

let parseBoard (lines:int list list) =
    let rows = lines |> List.map Set.ofList
    let cols = lines |> List.transpose |> List.map Set.ofList
    {
        lines = rows @ cols
        bingo = false
        numbersTried = 0
        winningNumber = 0
    }

let parse fn =
    let lines = readLines fn
    let draw = lines.[0].Split ',' |> Array.toList |> List.map int
    let boards =
        lines
        |> Array.toList
        |> List.skip 2
        |> List.filter (fun l -> l <> "")
        |> List.map lineToNumbers
        |> List.chunkBySize 5
        |> List.map parseBoard
    draw, boards

let markNumber (number:int) (board:Board) =
    let lines = board.lines |> List.map (Set.remove number)
    { board with
        lines = lines
        bingo = lines |> List.exists Set.isEmpty
        numbersTried = board.numbersTried + 1
        winningNumber = number
    }

let calculateScore (board : Board) =
    board.lines
    |> List.map Seq.sum
    |> List.sum
    |> (fun s -> ((s/ 2) * board.winningNumber))

let rec play draw board =
    match draw with
    | _ when board.bingo -> board
    | []                 -> board
    | n::rest            -> play rest (markNumber n board)

let solve fn =
    let (draw, boards) = parse fn
    let wb = boards 
                |> List.map (play draw)
                |> List.filter (fun b -> b.bingo)
                |> List.sortBy (fun b-> b.numbersTried)
    let fw = wb |> List.head
    let lw = wb |> List.last
    (calculateScore fw, calculateScore lw)

[<Theory>]
[<InlineData("04-test", 4512, 1924)>]
[<InlineData("04", 44736, 1827)>]
let test fn ep1 ep2 =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
