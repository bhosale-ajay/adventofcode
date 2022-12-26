module D25

open Common
open Xunit

let valueMap =
    Map [
        '2', 2L
        '1', 1L
        '0', 0L
        '-', -1L
        '=', -2L
    ]

let charMap = [|"="; "-"; "0"; "1"; "2"|]

let s2n s =
    s
    |> Seq.fold (fun n c -> 5L * n + valueMap[c]) 0L

let n2s n =
    let rec loop s = function
    | 0L -> s
    | n ->
        let r = int ((n + 2L) % 5L)
        let d = (n + 2L) / 5L
        loop (charMap[r] + s) d
    loop "" n

let solve fn =
    fn
    |> seqOfLines
    |> Seq.sumBy s2n
    |> n2s

[<Theory>]
[<InlineData("25-test", "2=-1=0")>]
[<InlineData("25", "2=10---0===-1--01-20")>]
let test24 fn ep1 =
    Assert.Equal(ep1, solve fn)
