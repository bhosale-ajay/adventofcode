module D03

open Common
open Xunit

let calculatePriority (set : Set<char>) =
    match set.IsEmpty with
    | true -> 0
    | _ ->
        let charValue = int set.MinimumElement
        if charValue >= 97 then charValue - 97 + 1
        else charValue - 65 + 1 + 26;

let lineToPriority (line : string) =
    let size = line.Length / 2
    let fc = line[0 .. size - 1] |> Set.ofSeq
    let sc = line[size ..] |> Set.ofSeq
    calculatePriority (Set.intersect fc sc)

let intersect a b =
    Set.intersect a (b |> Set.ofSeq)

let folder (sumP1, sumP2, lineNumber, pLine) line =
    let sumP1' = sumP1 + lineToPriority line
    match lineNumber with
    | 1 -> (sumP1', sumP2, 2, line |> Set.ofSeq)
    | 2 -> (sumP1', sumP2, 3, intersect pLine line)
    | _ -> (sumP1', sumP2 + calculatePriority (intersect pLine line), 1, Set.empty)

let solve fileName =
    fileName
    |> seqOfLines
    |> Seq.fold folder (0, 0, 1, Set.empty)
    
[<Theory>]
[<InlineData("03-test", 157, 70)>]
[<InlineData("03", 7568, 2780)>]
let test03 fn ep1 ep2  =
    let (ap1, ap2, _, _) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)