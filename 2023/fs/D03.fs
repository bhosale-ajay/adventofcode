module D03

open System
open Common
open Xunit
open System.Text.RegularExpressions

let isPartNumber (_, _, _, _, (isInt, _)) = isInt

let getPartValue (_, _, _, _, (_, v)) = v

let parseToken row (m: Match) =
    (row, m.Index, m.Value, m.Value.Length, Int32.TryParse m.Value)

let parseLine row line =
    Regex.Matches(line, "\d+|[^.]") |> Seq.map (parseToken row)

let parse fn =
    fn
    |> seqOfLines
    |> Seq.mapi parseLine
    |> Seq.collect id
    |> List.ofSeq
    |> List.partition isPartNumber

let isLocationOfSymbol sm al = sm |> Map.containsKey al

let adjacents (r, c, _, l, _) =
    let range = [ c - 1 .. c + l ]

    seq {
        yield! (range |> Seq.map (fun c -> (r - 1, c)))
        (r, c - 1)
        (r, c + l)
        yield! (range |> Seq.map (fun c -> (r + 1, c)))
    }

let solve fn =
    let (partNumbersData, symbols) = parse fn

    let symbolsMap =
        symbols |> List.map (fun (a, b, c, _, _) -> ((a, b), c)) |> Map.ofSeq

    let nextToSymbol = isLocationOfSymbol symbolsMap

    let partNumbers =
        partNumbersData
        |> Seq.map (fun pn -> (pn |> adjacents |> Seq.filter nextToSymbol, getPartValue pn))
        |> Seq.filter (fun (s, _) -> not (Seq.isEmpty s))

    let p1 = partNumbers |> Seq.sumBy snd

    let gearMap = symbolsMap |> Map.filter (fun _ v -> v = "*")

    let nextToGear = isLocationOfSymbol gearMap

    let p2 =
        partNumbers
        |> Seq.map (fun (s, v) -> s |> Seq.filter nextToGear |> Seq.map (fun l -> (l, v)))
        |> Seq.collect id
        |> Seq.groupBy fst
        |> Seq.filter (fun (_, ps) -> Seq.length ps = 2)
        |> Seq.map (fun (_, ps) -> ps |> Seq.map snd |> Seq.reduce (*))
        |> Seq.sum

    (p1, p2)

[<Theory>]
[<InlineData("03-t1", 4361, 467835)>]
[<InlineData("03", 544433, 76314915)>]
let test02 fn ep1 ep2 =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
