module D16

open Common
open System.Text.RegularExpressions
open Xunit

type Valve = (int * string list)
type ValveMap = Map<string, Valve>
type TimeMap = Map<string, Map<string, int>>

let parseLine l =
    Regex.Matches(l,"(-?\d+)|([A-Z]{2})")
    |> Seq.map (fun vs -> vs.Groups[0].Value)
    |> List.ofSeq
    |> (function
    | v :: r :: leadsTo -> v, (int r, leadsTo)
    | _ -> failwith "Invalid Input")

let parse fn : ValveMap =
    fn
    |> seqOfLines
    |> Seq.map parseLine
    |> Map.ofSeq

let addToSet s i = s |> Set.add i

let addToMap v m k = m |> Map.add k v

let notVisited s k = false = Set.contains k s

let buildSubMap (vm : ValveMap) vk =
    let rec loop q (dm: Map<string, int>) visited =
        match q with
        | [] -> dm
        | cv :: tail ->
            let nextv =
                vm[cv]
                |> snd
                |> List.filter (notVisited visited)
            match List.isEmpty nextv with
            | true -> loop tail dm visited
            | false ->
                let visited' = nextv |> Seq.fold addToSet visited
                let dm' = nextv |> Seq.fold (addToMap (dm[cv] + 1)) dm
                loop (tail @ nextv) dm' visited'
    loop [vk] (Map.ofList [vk, 0]) (Set.singleton vk)

let buildTimeMap (vm : ValveMap) =
    let flowNotZero v = 0 < fst vm[v]
    let keyValves = vm |> Map.keys |> Seq.filter flowNotZero |> Seq.sort |> Array.ofSeq
    let timeMap = 
        keyValves
        |> Seq.map(fun vk -> vk, buildSubMap vm vk)
        |> Map.ofSeq
        |> Map.add "AA" (buildSubMap vm "AA")
    timeMap, keyValves

let solveP1 (vm: ValveMap) (tm : TimeMap) (nextSeed: string array) =
    let rec loop cv time next =
        let next' = next |> Seq.filter (fun nv -> nv <> cv)
        next'
        |> Seq.fold (fun bf nv ->
            match time - tm[cv][nv] - 1 with
            | tl when tl > 0 -> max bf ((fst vm[nv]) * tl + (loop nv tl next'))
            | _ -> bf
        ) 0
    loop "AA" 30 nextSeed

let updatePathMap pm path pf =
    let pk = path |> Seq.sort |> Seq.fold (+) ""
    match pm |> Map.tryFind pk with
    | Some bf when bf > pf -> pm
    | _ -> pm |> Map.add pk pf

let buildPathFlowMap (vm: ValveMap) (tm : TimeMap) (nextSeed: string array) =
    let rec loop cv time path pathFlow pm =
        let pm = updatePathMap pm path pathFlow
        nextSeed
        |> Array.except path
        |> Seq.fold (fun pm' nv ->
            match time - tm[cv][nv] - 1 with
            | tl when tl > 0 ->
                let f = ((fst vm[nv]) * tl) + pathFlow
                loop nv tl (nv :: path) f pm'
            | _ -> pm') pm
    loop "AA" 26 List.empty 0 Map.empty

let rec extendPathFlowMap (pm : Map<string, int>) (nextSeed: string seq) =
    let pk = nextSeed |> Seq.fold (+) ""
    match pm |> Map.tryFind pk with
    | Some bf -> pm, bf
    | None ->
        let pm, bf =
            nextSeed
            |> Seq.fold (fun (pm', bf) o ->
                let (pm'', obf) = extendPathFlowMap pm' (nextSeed |> Seq.filter (fun oo -> oo <> o))
                (pm'', max bf obf)
            ) (pm, 0)
        pm |> Map.add pk bf, bf

let solveP2 (vm: ValveMap) (tm : TimeMap) (kv: string array) =
    let p = buildPathFlowMap vm tm kv
    let p = extendPathFlowMap p kv |> fst
    p
    |> Seq.fold (fun bf kvp ->
        let hw = kvp.Key
        let ew = kv |> Seq.filter (fun v -> false = hw.Contains(v)) |> Seq.fold (+) ""
        max bf (p[hw] + p[ew])
    ) 0

let solve fn =
    let vm = fn |> parse
    let tm, kv = buildTimeMap vm
    solveP1 vm tm kv, solveP2 vm tm kv

[<Theory>]
[<InlineData("16-test", 1651, 1707)>]
// [<InlineData("16", 1871, 2416)>]
let test16 fn ep1 ep2 =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)