module D17BO

open Common
open Xunit
open System

type Tunnel = Map<int, int * int>

type RockShape = (int * int) array

let getNextItem (arr: 'a array) =
    let mutable index = -1
    fun () ->
        index <- (index + 1) % (Array.length arr)
        arr[index]

let rocks : RockShape array = [|
    [|  0b00_1111_00, 0 |]
    [|
        0b000_1_0000, 2
        0b00_111_000, 1
        0b000_1_0000, 0
    |]
    [|
        0b0000_1_000, 2
        0b0000_1_000, 1
        0b00_111_000, 0
    |]
    [|
        0b00_1_00000, 3
        0b00_1_00000, 2
        0b00_1_00000, 1
        0b00_1_00000, 0
    |]
    [|
        0b00_11_0000, 1
        0b00_11_0000, 0
    |]
|]
let emptySpace = 0b1_0000000_1
let baseLine = 0b1_1111111_1
let canMove tl rl = tl &&& rl = 0
let moveLeft n = n <<< 1
let moveRight n = n >>> 1

let moveWithAir =
    [
        ('<', moveLeft)
        ('>', moveRight)
    ]
    |> Map.ofSeq

let addBlankLineIfNotPresent t rn =
    t |> Map.change rn (function
        | Some l -> Some l
        | None -> Some (emptySpace, 0))

let addSpace (t: Tunnel) ch rh =
    [ch + 1 .. ch + 3 + rh]
    |> Seq.fold (fun t' rn -> addBlankLineIfNotPresent t' rn) t

let printTunnel (t: Tunnel) h =
    [h .. -1 .. 0]
    |> Seq.iter (fun rn -> printfn "%s" (Convert.ToString(fst t[rn], 2).Replace('1', '#').Replace('0', ' ')))

let moveRock mover (rl, rh) = mover rl, rh

let canMoveDown (t: Tunnel) (r : RockShape) h =
     r |> Array.forall (fun (rl, rh) -> canMove (fst t[h - 1 + rh]) rl)

let notePosition (t: Tunnel) (pm: Map<int, int list>) n =
     pm |> Map.change (fst t[n]) (function
        | Some l -> Some(n :: l)
        | None -> Some [n])

let noteDiff = function
    | h :: tail -> tail |> List.map (fun l -> h - l)
    | _ -> []

let solve fn =
    let nextAirFlow = fn |> readFile |> Array.ofSeq |> getNextItem
    let nextRock = rocks |> getNextItem
    let times = 4000
    let hightAt = Array.create (times + 1) 0

    let rec drop (t : Tunnel) (r: RockShape) h ri =
        let mover = moveWithAir[nextAirFlow()]
        let canFlowWithAir = r |> Array.forall (fun (rl, rh) -> canMove (fst t[h + rh]) (mover rl))
        let r = if canFlowWithAir then (r |> Array.map (moveRock mover)) else r
        if canMoveDown t r h then
            drop t r (h - 1) ri
        else
            let t = r |> Seq.fold (fun t (rl, rh) -> t |> Map.add (h + rh) (fst t[h + rh] ||| rl, ri)) t
            t, h + snd r[0]

    let rec watch (t: Tunnel) ri height =
        match ri <= times with
        | false ->
            t, height
        | _ ->
            let rock = nextRock()
            let t = addSpace t height rock.Length
            let (t, h) = drop t rock (height + 4) ri
            let h = max height h
            hightAt[ri] <- h
            watch t (ri + 1) h

    let (t, h) = watch ([0, (baseLine, 0)] |> Map) 1 0
    let p1 = hightAt[2022]
    let safeHeight = h - 100
    let pm = [1 .. safeHeight] |> Seq.fold (notePosition t) Map.empty
    let ph = // Pattern Height
        [safeHeight .. -1 .. (safeHeight - 10)]
        |> Seq.map (fun hi -> fst t[hi])
        |> Seq.distinct
        |> Seq.map (fun v -> pm[v] |> noteDiff |> Set.ofList)
        |> Seq.reduce (Set.intersect)
        |> Set.minElement
    let tpsi = // Pattern Start At
        [1 .. ph]
        |> Seq.find(fun hi -> fst t[hi + 0] = fst t[hi + ph + 0] && 
                              fst t[hi + 1] = fst t[hi + ph + 1] &&
                              fst t[hi + 2] = fst t[hi + ph + 2] &&
                              fst t[hi + 3] = fst t[hi + ph + 3] &&
                              fst t[hi + 4] = fst t[hi + ph + 4])
    let prePatternHeight = tpsi - 1
    let rocksPrePattern = snd t[prePatternHeight]
    let rocks4Pattern = (snd t[ph + prePatternHeight]) - rocksPrePattern
    let heightCoveredByPattern = 1000000000000L - int64 rocksPrePattern
    let repetitions = heightCoveredByPattern / int64 rocks4Pattern
    let rocksAtEnd = (int) (heightCoveredByPattern % int64 rocks4Pattern)
    let preAndPostHeight = hightAt[rocksPrePattern + rocksAtEnd]
    let p2 = (repetitions * int64 ph) + int64 preAndPostHeight;
    p1, p2

[<Theory>]
[<InlineData("17-test", 3068, 1514285714288L)>]
[<InlineData("17", 3100, 1540634005751L)>]
let test17BO fn ep1 ep2 =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
