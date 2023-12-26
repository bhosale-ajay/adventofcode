module D04

open System
open Common
open Xunit
open System.Linq

let parse (line: string) =
    line[line.IndexOf(":") + 1 ..]
    |> splitByString "|"
    |> Seq.map (fun l -> splitByString " " l |> Seq.ofArray)
    |> Seq.reduce (fun a b -> a.Intersect b)
    |> Seq.length

let power m =
    if m > 0 then Math.Pow(2, float (m - 1)) else 0

let updateCount (cards: int array) i m =
    [ 1..m ] |> Seq.iter (fun ci -> cards.[i + ci] <- cards.[i + ci] + cards.[i])

let solve fn =
    let matches = fn |> seqOfLines |> Seq.map parse
    let cardCount = matches |> Seq.length
    let p1 = matches |> Seq.sumBy power
    let cards = Array.init cardCount (fun _ -> 1)
    matches |> Seq.iteri (updateCount cards)
    let p2 = cards |> Array.sum
    (p1, p2)

[<Theory>]
[<InlineData("04-t1", 13, 30)>]
[<InlineData("04", 24542, 8736438)>]
let test04 fn ep1 ep2 =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
