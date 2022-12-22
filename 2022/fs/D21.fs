module D21

open Common
open Xunit

type Expression =
    | Specific of int64
    | Operation of string array
type EMap = Map<string, Expression>

let operation a b = function
    | "+" -> a + b
    | "-" -> a - b
    | "*" -> a * b
    | _ -> a / b

let rec eval (d: EMap) n t =
    match d[n] with
    | Specific v -> v, t, n = "humn"
    | Operation ps ->
        let va, t, ca = eval d ps[0] t
        let vb, t, cb = eval d ps[2] t
        let r = operation va vb ps[1]
        match ca, cb with
        | false, false -> r, t, false
        | false, true -> r, (va, ps[1], false) :: t, true
        | true, false -> r, (vb, ps[1], true) :: t, true
        | _, _ -> failwith "This should never happen."

let parse (line: string) =
    let name = line[0..3]
    let parts = (line[6..]).Split(' ')
    match parts.Length with
    | 1 -> name, Specific (int64 parts[0])
    | _ -> name, Operation (parts)

let reverseEval r (v, o, rs) =
    match o, rs with
    | "/", true -> r * v
    | "/", false -> v / r
    | "-", true -> r + v
    | "-", false -> v - r
    | "*", _ -> r / v
    | _, _ -> r - v

let solve fn =
    let m =
        fn
        |> seqOfLines
        |> Seq.map parse
        |> Map.ofSeq
    let p1, t, _ = eval m "root" List.empty
    let r, _, _ = t.Head
    let p2 =
        t.Tail
        |> Seq.fold reverseEval r
    p1, p2

[<Theory>]
[<InlineData("21-test", 152L, 301L)>]
[<InlineData("21", 145167969204648L, 3330805295850L)>]
let test21 fn ep1 ep2 =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
