module D05

open Common
open Xunit

type Instruction = 
    { quantity : int; fromStack : int; toStack : int }
    static member fromString (line:string) =
        let parts = line.Split(' ')
        {quantity = int parts[1]; fromStack = (int parts[3]) - 1; toStack = (int parts[5]) - 1}

let (|StackInfo|_|) (l: string) =
    if l.Contains('[') then Some l
    else None

let (|Instruction|_|) (l: string) =
    if l.StartsWith("move") then Some (Instruction.fromString l)
    else None

let setupStack (stacks: string array) (line: string) (si, ci) =
    if line[ci] <> ' ' then
        stacks[si] <- stacks[si] + (string line[ci])
    ()

let instruction9000 quantity (l:string) =
    [0 .. (quantity - 1)]
    |> Seq.fold (fun acc ci -> (string l[ci]) + acc) ""

let instruction9001 quantity (l:string) = l[0..(quantity-1)]

let folder instruction (positions : seq<int * int>) (stacks: string array) = function
    | StackInfo line ->
        positions
        |> Seq.iter (setupStack stacks line)
        stacks
    | Instruction ins ->
        stacks[ins.toStack] <- (instruction ins.quantity stacks[ins.fromStack]) + stacks[ins.toStack]
        stacks[ins.fromStack] <- stacks[ins.fromStack][(ins.quantity)..]
        stacks
    | _ -> stacks

let solve instruction size fileName =
    let positions =
        [1 .. 4 .. (size * 4)]
        |> Seq.map (fun n -> (n/4, n))
    fileName
    |> seqOfLines
    |> Seq.fold (folder instruction positions) (Array.create size "")
    |> Seq.fold (fun acc s -> acc + (string s[0])) ""
    
[<Theory>]
[<InlineData("05-test", "CMZ", "MCD")>]
[<InlineData("05", "MQTPGLLDN", "LVZPSTTCZ")>]
let test05 fn (ep1:string) (ep2: string)  =
    let ap1 = solve instruction9000 ep1.Length fn
    Assert.Equal(ep1, ap1)
    let ap2 = solve instruction9001 ep2.Length fn
    Assert.Equal(ep2, ap2)