module D04

open System
open Common
open Xunit

type Pairs = 
    { s1: int; e1: int; s2: int; e2: int}
    member self.isFullyContain() =
        (self.s1 <= self.s2 && self.e2 <= self.e1) 
        || 
        (self.s2 <= self.s1 && self.e1 <= self.e2)
    member self.isOverlap() =
        (self.s1 <= self.s2 && self.s2 <= self.e1) 
        || 
        (self.s2 <= self.s1 && self.s1 <= self.e2);

let (|Pairs|_|) (l: string) =
    let ps = l.Split ([|","; "-"|], StringSplitOptions.None) |> Array.map int
    match ps with
    | [|s1; e1; s2; e2|] -> Some {s1 = s1; e1 = e1; s2 = s2; e2 = e2} 
    | _ -> None

let folder (sumP1, sumP2) = function
    | Pairs p -> (
            (if p.isFullyContain() then sumP1 + 1 else sumP1), 
            (if p.isOverlap() then sumP2 + 1 else sumP2)
        )
    | _ -> (sumP1, sumP2)

let solve fileName =
    fileName
    |> seqOfLines
    |> Seq.fold folder (0, 0)
    
[<Theory>]
[<InlineData("04-test", 2, 4)>]
[<InlineData("04", 453, 919)>]
let test04 fn ep1 ep2  =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)