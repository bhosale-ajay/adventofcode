module D23

open Common
open Xunit
open System.Collections.Generic

type Location = (int * int)
type Option = (int list) * Location
type Options = Option list
type Proposal = KeyValuePair<Location, Location list>
type ProposalMap = Map<Location, Location list>
type Field = Set<Location>
type num = int
let MAX = num.MaxValue
let MIN = num.MinValue

let checkLines ls =
    [
        for (ri, l) in Seq.indexed ls do
            for (ci, c) in Seq.indexed l do
                if c = '#' then (ri, ci)
    ]
    |> Set.ofSeq

let spacesAround (r, c) =
    [|
        r - 1, c - 1 // Top Left
        r - 1, c + 0 // Top
        r - 1, c + 1 // Top Right
        r + 0, c - 1 // Left
        r + 0, c + 1 // Right
        r + 1, c - 1 // Bottom Left
        r + 1, c + 0 // Bottom
        r + 1, c + 1 // Bottom Right
    |]

let optionSeed : Options =
    [
        [0; 1; 2], (-1,  0)
        [5; 6; 7], ( 1,  0)
        [0; 3; 5], ( 0, -1)
        [2; 4; 7], ( 0,  1)
    ]

let rearrangeOptions = function
    | h :: tail -> tail @ [h]
    | _ -> []

let isEmpty f l =
    f
    |> Set.contains l
    |> not

let allEmpty s =
    s
    |> Seq.contains false
    |> not

let findOption (s : bool array) os =
    os
    |> Seq.tryFind (fun (o, _d) -> o |> Seq.forall(fun n -> s[n]))

let nextlocation l d = (fst l + fst d), (snd l + snd d)

let addToProposal l = function
    | Some v -> Some (l :: v)
    | None -> Some [l]

let propose f (os : Options) (p : ProposalMap) l =
    let s = l |> spacesAround |> Array.map (isEmpty f)
    match allEmpty s with
    | true -> p
    | false ->
        match findOption s os with
        | None -> p
        | Some (_, d) -> p |> Map.change (nextlocation l d) (addToProposal l)

let processProposal field (p: Proposal) =
    match p.Value with
    | [only] -> field |> Set.remove only |> Set.add p.Key
    | _ -> field

let getBound (minR, maxR, minC, maxC) (r, c) =
    (
        min minR r,
        max maxR r,
        min minC c,
        max maxC c
    )

let getEmptyTiles (f: Field) =
    let minR, maxR, minC, maxC =
        f
        |> Seq.fold getBound (MAX, MIN, MAX, MIN)
    abs (maxR - minR + 1) * (maxC - minC + 1) - f.Count

let rec roundLoop field options ri emptyTiles noMovementRound =
    match ri <= 10 || noMovementRound = -1 with
    | false -> emptyTiles, noMovementRound
    | true ->
        let proposal =
            field
            |> Seq.fold (propose field options) Map.empty
        let field =
            proposal
            |> Seq.fold (processProposal) field
        let emptyTiles =
            if ri = 10 then getEmptyTiles field else emptyTiles
        let noMovementRound =
            if noMovementRound = -1 && proposal.Count = 0 then ri else noMovementRound
        let options =
            rearrangeOptions options
        roundLoop field options (ri + 1) emptyTiles noMovementRound

let solve fn =
    let f =
        fn
        |> seqOfLines
        |> checkLines
    roundLoop f optionSeed 1 -1 -1

[<Theory>]
[<InlineData("23-test", 110, 20)>]
// [<InlineData("23", 4052, 978)>]
let test23 fn ep1 ep2 =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
