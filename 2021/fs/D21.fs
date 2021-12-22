module D21

open System.Collections.Generic
open Xunit

let roll p r = (p + r) % 10

let play p1 p2 =
    let rec turn p1 p2 s1 s2 r =
        match s2 >= 1000 with
        | true -> s1 * r
        | false ->
            let position =
                [r + 1; r + 2; r + 3]
                |> List.fold roll p1
            let score = s1 + position + 1
            turn p2 position s2 score (r + 3)
    turn p1 p2 0 0 0

let diracDice =
    let r = [1; 2; 3;]
    r
    |> List.allPairs r
    |> List.allPairs r
    |> List.map (fun (a, (b, c)) -> a + b + c)
    |> List.countBy id

type Turn = int * int * int * int -> int64 * int64
let cache (turn : Turn) : Turn =
    let cache = Dictionary<int * int * int * int, int64 * int64>()
    fun input ->
        let exists, value = cache.TryGetValue input
        if exists then
            value
        else
            let value = turn input
            cache.Add(input, value)
            value

#nowarn "40"
let rec playWithDiracDice = cache(fun (p1, p2, s1, s2) ->
    let countWin (wins1 : int64, wins2: int64) (rollTotal : int, appears : int) =
        let p = (p1 + rollTotal) % 10
        let s = s1 + p + 1
        let (w2, w1) = playWithDiracDice (p2, p, s2, s)
        wins1 + w1 * (int64 appears), wins2 + w2 * (int64 appears)
    match s2 >= 21 with
    | true -> 0L, 1L
    | false ->
        diracDice
        |> List.fold countWin (0L, 0L))

let solve p1 p2 =
    let r1 = play (p1-1) (p2-1)
    let (w1, w2) = playWithDiracDice (p1 - 1, p2 - 1, 0, 0)
    r1, max w1 w2

[<Theory>]
[<InlineData(4, 8, 739785L, 444356092776315L)>]
[<InlineData(6, 1, 929625L, 175731756652760L)>]
let test (p1: int) (p2: int) (ep1: int) (ep2: int64) =
    let (ap1, ap2) = solve p1 p2
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
