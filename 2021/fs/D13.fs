module D13

open System.Text.RegularExpressions
open System.IO

type Coordinate = int * int

type Paper = Set<Coordinate>

type Folder = Coordinate -> Coordinate

let readText fileName = $"../inputs/{fileName}.txt" |> File.ReadAllText

let foldAtX (foldAt: int) (c: Coordinate) =
    let x = fst c
    match x < foldAt with
    | true -> c
    | _ -> (foldAt * 2 - x, snd c)

let foldAtY (foldAt: int) (c: Coordinate) =
    let y = snd c
    match y < foldAt with
    | true -> c
    | _ -> (fst c, foldAt * 2 - y)

let coordRegEx = "(\d+),(\d+)"
let foldRegEx = "(x|y)=(\d+)"

let lineToCoord (m: Match) =
    m.Groups
    |> Seq.map (fun g -> g.Value)
    |> Seq.toArray
    |> (fun ln -> (int ln[1], int ln[2]))

let lineToFoldInstruction (m: Match) : Folder =
    m.Groups
    |> Seq.map (fun g -> g.Value)
    |> Seq.toArray
    |> (fun ln -> 
        match ln[1] with
        | "x" -> foldAtX (int ln[2])
        | _ -> foldAtY (int ln[2])
    )

let fold (paper: Paper) (folder : Folder) : Paper =
    paper
    |> Seq.map folder
    |> Set.ofSeq

let input = readText "13"

let paper : Paper =
    Regex.Matches(input, coordRegEx)
    |> Seq.map lineToCoord
    |> Set.ofSeq

let foldedPaper =
    Regex.Matches(input, foldRegEx)
    |> Seq.map lineToFoldInstruction
    |> Seq.toList
    |> List.fold fold paper

for y in 0..6 do
    for x in 0..40 do
       printf "%s" (if foldedPaper.Contains ((x, y)) then "#" else " ")
    printfn ""
