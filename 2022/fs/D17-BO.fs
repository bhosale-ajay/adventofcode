module D17BO

open Common
open Xunit
open System

type Tunnel = Map<int, int>

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
        | None -> Some emptySpace)

let addSpace (t: Tunnel) ch rh =
    [ch + 1 .. ch + 3 + rh]
    |> Seq.fold (fun t' rn -> addBlankLineIfNotPresent t' rn) t

let printTunnel (t: Tunnel) h =
    [h .. -1 .. 0]
    |> Seq.iter (fun rn -> printfn "%s" (Convert.ToString(t[rn], 2).Replace('1', '#').Replace('0', ' ')))

let moveRock mover (rl, rh) = mover rl, rh

let canMoveDown (t: Tunnel) (r : RockShape) h =
     r |> Array.forall (fun (rl, rh) -> canMove t[h - 1 + rh] rl)

let solve fn =
    let nextAirFlow = fn |> readFile |> Array.ofSeq |> getNextItem
    let nextRock = rocks |> getNextItem
    let times = 2022

    let rec drop (t : Tunnel) (r: RockShape) h =
        let mover = moveWithAir[nextAirFlow()]
        let canFlowWithAir = r |> Array.forall (fun (rl, rh) -> canMove t[h + rh] (mover rl))
        let r = if canFlowWithAir then (r |> Array.map (moveRock mover)) else r
        if canMoveDown t r h then
            drop t r (h - 1)
        else
            let t = r |> Seq.fold (fun t (rl, rh) -> t |> Map.add (h + rh) (t[h + rh] ||| rl)) t
            t, h + snd r[0]

    let rec watch (t: Tunnel) ri height =
        match ri <= times with
        | false ->
            height
        | _ ->
            let rock = nextRock()
            let t = addSpace t height rock.Length
            let (t, h) = drop t rock (height + 4)
            let h = (max height h)
            watch t (ri + 1) h

    watch ([0, baseLine] |> Map) 1 0

[<Theory>]
[<InlineData("17-test", 3068)>]
[<InlineData("17", 3100)>]
let test17BO fn ep1 =
    let ap1 = solve fn
    Assert.Equal(ep1, ap1)
