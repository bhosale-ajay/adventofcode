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