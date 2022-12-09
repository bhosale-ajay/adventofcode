module D09

open Common
open Xunit

type State = (int * int) array * Set<string> * Set<string>

let actionSeq (ls: string) =
    Seq.replicate (int ls[2..]) ls[0]

let apply (r, c) = function
    | 'U' -> r, c - 1
    | 'L' -> r - 1, c
    | 'R' -> r + 1, c
    | 'D' -> r, c + 1
    | _ -> r, c

let movePoint hp tp =
    let d = hp - tp
    tp + (if abs d = 2 then d / 2 else d)

let moveT (hr, hc) (tr, tc) =
    let dist = max (abs (tr - hr)) (abs (tc - hc))
    if dist > 1 then movePoint hr tr, movePoint hc tc
    else tr, tc

let moveKnots action (fi, last) k =
    let next = if fi then apply k action else moveT last k
    next, (false, next)

let fold ((knots, v1, v2) : State) action =
    let knots' =
        knots
        |> Array.mapFold (moveKnots action) (true, (0, 0))
        |> fst
    knots', v1.Add (string knots'[1]), v2.Add (string knots'[9])

let solve fn =
    let seed = (
        Array.create 10 (0, 0),
        Set.empty.Add(string (0, 0)),
        Set.empty.Add(string (0, 0))
    )
    let (_, vby1, vby9) =
        fn
        |> seqOfLines
        |> Seq.collect actionSeq
        |> Seq.fold fold seed
    vby1.Count, vby9.Count

[<Theory>]
[<InlineData("09-test-01", 13, 1)>]
[<InlineData("09-test-02", 88, 36)>]
[<InlineData("09", 5619, 2376)>]
let test09 fn ep1 ep2 =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)