module D17

open Common
open Xunit

type Tunnel = Map<int * int, bool>

type RockShape = { parts: (int * int) list; xp: int; eh: int}

type GetNextShape = unit -> RockShape

let getNextItem (arr: 'a array) =
    let mutable index = -1
    fun () ->
        index <- (index + 1) % (Array.length arr)
        arr[index]

let make parts xp eh =
    { parts = parts; xp = xp; eh = eh}

let shapes =
    [|
        make [(0, 0); ( 1, 0); (2, 0); (3, 0)] 2 0
        make [(0, 0); (-1, 1); (1, 1); (0, 1); (0,2)] 3 2
        make [(0, 0); ( 1, 0); (2, 0); (2, 1); (2, 2)] 2 2
        make [(0, 0); ( 0, 1); (0, 2); (0, 3)] 2 3
        make [(0, 0); ( 1, 0); (0, 1); (1, 1)] 2 1
    |]

let canMove dx dy t rx ry shape =
    let r =
        shape.parts
        |> List.forall (fun (ex, ey) ->
            let px = ex + dx + rx
            let py = ey + dy + ry
            0 <= px && px <= 6 && 0 <= py && not (Map.containsKey (px, py) t))
    if r then r, rx + dx, ry + dy else r, rx, ry

let moveWithAir =
    [
        ('<', canMove -1 0)
        ('>', canMove  1 0)
    ]
    |> Map.ofSeq

let canMoveDown = canMove 0 -1

let solve fn =
    let nextAirFlow = fn |> readFile |> Array.ofSeq |> getNextItem
    let nextShape = shapes |> getNextItem
    let times = 2022

    let rec drop t rx ry shape =
        let (_, rx, ry) = moveWithAir[nextAirFlow()] t rx ry shape
        match canMoveDown t rx ry shape with
        | (true, rx, ry ) -> drop t rx ry shape
        | (false, rx, ry) -> rx, ry

    let rec watch ri t height =
        match ri < times with
        | false -> height + 1
        | _ ->
            let shape = nextShape()
            let (rx, ry) = drop t shape.xp (height + 4) shape
            let t =
                shape.parts
                |> Seq.fold (fun acc (ex, ey) -> acc |> Map.add (ex + rx, ey + ry) true) t
            let height = max height (ry + shape.eh)
            watch (ri + 1) t height

    watch 0 Map.empty -1

[<Theory>]
[<InlineData("17-test", 3068)>]
[<InlineData("17", 3100)>]
let test17 fn ep1 =
    let ap1 = solve fn
    Assert.Equal(ep1, ap1)
