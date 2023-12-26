module D01

open Common
open Xunit

let toTuple list =
    list |> List.mapi (fun i li -> (li, i + 1))

let tokensP1 = [ "1"; "2"; "3"; "4"; "5"; "6"; "7"; "8"; "9" ] |> toTuple

let tokensP2 =
    [ "one"; "two"; "three"; "four"; "five"; "six"; "seven"; "eight"; "nine" ]
    |> toTuple

let valuesP1 = tokensP1 |> Map.ofSeq

let valuesP2 = (tokensP1 @ tokensP2) |> Map.ofSeq

let forward (l: string) = [ 0 .. l.Length ]

let backword (l: string) = [ l.Length .. -1 .. 0 ]

let search direction (tokens: string seq) values (l: string) =
    l
    |> direction
    |> Seq.map (fun n -> tokens |> Seq.tryFind (fun num -> l[ n.. ].StartsWith(num)))
    |> Seq.choose id
    |> Seq.tryHead
    |> Option.bind (fun n -> values |> Map.tryFind n)
    |> Option.defaultValue 0

let parseLine tokens values (l: string) =
    ((search forward tokens values l) * 10) + (search backword tokens values l)

let solve fileName values =
    let tokens = values |> Map.keys
    fileName |> seqOfLines |> Seq.map (parseLine tokens values) |> Seq.sum

[<Theory>]
[<InlineData("01-t1", 142)>]
[<InlineData("01", 56465)>]
let test01P1 fn ep1 = Assert.Equal(ep1, (solve fn valuesP1))

[<Theory>]
[<InlineData("01-t2", 281)>]
[<InlineData("01", 55902)>]
let test01P2 fn ep2 = Assert.Equal(ep2, (solve fn valuesP2))
