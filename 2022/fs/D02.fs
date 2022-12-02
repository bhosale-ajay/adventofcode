module D02

open Common
open Xunit

// for a more programming kind solution 
// check typescript version
let folder (p1, p2) = function
    | "A X" -> (p1 + 1 + 3, p2 + 3 + 0)
    | "A Y" -> (p1 + 2 + 6, p2 + 1 + 3)
    | "A Z" -> (p1 + 3 + 0, p2 + 2 + 6)
    | "B X" -> (p1 + 1 + 0, p2 + 1 + 0)
    | "B Y" -> (p1 + 2 + 3, p2 + 2 + 3)
    | "B Z" -> (p1 + 3 + 6, p2 + 3 + 6)
    | "C X" -> (p1 + 1 + 6, p2 + 2 + 0)
    | "C Y" -> (p1 + 2 + 0, p2 + 3 + 3)
    | "C Z" -> (p1 + 3 + 3, p2 + 1 + 6)
    | _ -> (p1, p2)

let solve fileName = 
    fileName 
    |> seqOfLines
    |> Seq.fold folder (0, 0)
    
[<Theory>]
[<InlineData("02-test", 15, 12)>]
[<InlineData("02", 12855, 13726)>]
let test02 fn ep1 ep2  =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)