﻿module D24

open Common
open Xunit
open System.Collections.Generic

type LocationQueue = Queue<int * int * int>

let nextItem (q : LocationQueue) =
    match q.Count with
    | 0 -> None
    | _ -> Some (q.Dequeue())

let next (r, c) =
    [
        r, c - 1
        r - 1, c
        r + 1, c
        r, c + 1
        r, c
    ]

let walk (d: string array) sr sc dr dc baseTime mt =
    let sh = Array.length d - 2
    let sw = d[0].Length - 2
    let rows = Array.length d
    let cols = d[0].Length
    let f = sh * sw

    let ulp a t s =
        let p = a + ((t + 1) % s)
        if p > s then p - s else p

    let drp a t s =
        let p = a - ((t + 1) % s)
        if p < 1 then p + s else p

    let updateQueueAndVisited t (q : LocationQueue, v) (r, c) =
        q.Enqueue(r, c, (t + 1))
        q, v |> Set.add (r, c, (t + 1) % f)

    let notVisiitedAndEmpty visited t (r, c) =
        0 <= r && r < rows && 0 <= c && c < cols && d[r][c] <> '#' &&
        d[drp r t sh][c] <> 'v' && d[ulp r t sh][c] <> '^' &&
        d[r][drp c t sw] <> '>' && d[r][ulp c t sw] <> '<' &&
        not (Set.contains (r, c, (t + 1) % f) visited)

    let rec loop (queue : LocationQueue, visited) =
        match nextItem queue with
        | Some (_, _, t)  when t - baseTime > mt -> loop (queue, visited)
        | Some (r, c, t) ->
            let nl = (r, c) |> next
            if nl |> Seq.contains (dr, dc) then
                t + 1
            else
                nl
                |> Seq.filter (notVisiitedAndEmpty visited t)
                |> Seq.fold (updateQueueAndVisited t) (queue, visited)
                |> loop
        | _ -> -1

    let queue = LocationQueue();
    queue.Enqueue(sr, sc, baseTime)
    loop (queue, Set.empty)

let solve fn mt =
    let data =
        fn
        |> seqOfLines
        |> Array.ofSeq
    let (sr, sc, dr, dc) = (0, 1, data.Length - 1, data[0].Length - 2)
    let p1 = walk data sr sc dr dc 0 mt
    let b = walk data dr dc sr sc p1 mt
    let p2 = walk data sr sc dr dc b mt
    p1, p2

[<Theory>]
[<InlineData("24-test", 23, 18, 54)>]
// [<InlineData("24", 338, 322, 974)>]
let test24 fn mt ep1 ep2 =
    let (ap1, ap2) = solve fn mt
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)