module D10


open Common
open Xunit

let closing =
    Map [ (')', ('(', 3))
          (']', ('[', 57))
          ('}', ('{', 1197))
          ('>', ('<', 25137)) ]

let opening =
    Map [ ('(', 1L)
          ('[', 2L)
          ('{', 3L)
          ('<', 4L) ]

let isOpening = opening.ContainsKey

let lineToCharList (l: string) = l |> Seq.toList

let calAutoCorrectScore acc c = (acc * 5L) + opening[ c ]

let rec checkLegality (stack: char list) (chars: char list) =
    match chars with
    | [] -> (0, stack |> List.fold calAutoCorrectScore 0L)
    | c :: rc ->
        match isOpening c with
        | true -> checkLegality (c :: stack) rc
        | false ->
            let (ec, es) = closing[c]
            match stack with
            | [] -> (es, 0L)
            | ac :: rs ->
                match ac = ec with
                | true -> checkLegality rs rc
                | false -> (es, 0L)

let nonZeroAutoCompleteScore (_, b: int64) = if b > 0 then Some b else None

let pickMiddleScore (s: int64[]) = s[(s.Length - 1) / 2]

let solve (fn: string) =
    let scores =
        fn
        |> mapLines lineToCharList
        |> Array.map (checkLegality List.empty)

    let p1 = scores |> Array.sumBy fst

    let p2 =
        scores
        |> Array.choose nonZeroAutoCompleteScore
        |> Array.sort
        |> pickMiddleScore

    (p1, p2)

[<Theory>]
[<InlineData("10-test", 26397, 288957)>]
[<InlineData("10", 392043, 1605968119)>]
let test fn (ep1: int) (ep2: int64) =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
