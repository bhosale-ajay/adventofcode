module D10

open Common
open Xunit

type State = int * int * int * int * string

let cycleSeq (l: string) =
    [
        0
        if l.StartsWith("a") then int l[4..]
    ]

let printPixel crt x p =
    crt +
    (if x - 1 <= p && p <= x + 1 then "#" else " ") +
    (if p = 39 then "\n" else "")

let cycle ((c, i, x, p, crt) : State) v : State =
    c + 1,
    (if (c - 19) % 40 = 0 then i + ((c + 1) * x) else i),
    x + v,
    (p + 1) % 40,
    printPixel crt x p

let solve fn =
    let (_, i, _, _, crt) =
        fn
        |> seqOfLines
        |> Seq.collect cycleSeq
        |> Seq.fold cycle (0, 0, 1, 0, "")
    i, crt

[<Theory>]
[<InlineData("10-test", 13140)>]
[<InlineData("10", 14320)>]
let test10 fn ep1 =
    let ap1, _ = solve fn
    Assert.Equal(ep1, ap1)
