module Common

open System.IO

let basePath =
    @"D:\Ajay\Projects\adventofcode\2022\inputs"

let seqOfLinesWEE fileName =
    seq {
        yield! Path.Combine(basePath, $"{fileName}.txt")
        |> File.ReadLines
        yield "";
    }

let seqOfLines fileName =
    Path.Combine(basePath, $"{fileName}.txt")
    |> File.ReadLines
    
let (|Integer|_|) (l : string) =
    match System.Int32.TryParse l with
    | (true, number) -> Some number
    | (false, _)     -> None

let readFile fileName =
    Path.Combine(basePath, $"{fileName}.txt")
    |> File.ReadAllText
    |> fun t -> t.Replace("\r", "")

let splitFile (splitBy: string) fileName =
    fileName
    |> readFile
    |> fun s -> s.Split(splitBy)

let repeat f times =
    [1..times]
    |> Seq.iter (fun _ -> f())