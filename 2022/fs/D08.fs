module D08

open Common
open System
open Xunit

let parse fn =
    fn
    |> seqOfLines
    |> Seq.map (fun l -> l.ToCharArray())
    |> array2D

let innerTreeLocations rc cc =
    seq {
        for r in 1 .. rc - 2 do
            for c in 1 .. cc - 2 ->
                r, c
    }

let withinTreeLines rc cc r c =
    0 <= r && r < rc && 0 <= c && c < cc

let top (r, c) = r, c - 1
let left (r, c) = r - 1, c
let right (r, c) = r + 1, c
let bottom (r, c) = r, c + 1

let walkTowards (trees : char array2d) withinTreeLines walker =
    let rec walk treeHeight depth (r, c) =
        let (nr, nc) = walker (r, c)
        match withinTreeLines nr nc with
        | false -> true, depth
        | true when treeHeight <= trees[nr, nc] -> false, depth + 1
        | _ -> walk treeHeight (depth + 1) (nr, nc)

    fun (r, c) ->
        walk (trees[r, c]) 0 (r, c)

let foldWalkScore (canSee, score) (canSeeFromThisDir, depth) =
    canSee || canSeeFromThisDir, score * depth

let getScore walkers l =
    walkers
    |> Seq.map (fun w -> w l)
    |> Seq.fold foldWalkScore (false, 1)

let getOverallScore (getScore) (p1 : int, p2 : int) l =
    let (canSeeFromEdge, score) = getScore l
    (if canSeeFromEdge then p1 + 1 else p1), Math.Max(p2, score)

let solve fileName =
    let trees = fileName |> parse
    let rows = trees |> Array2D.length1
    let cols = trees |> Array2D.length2
    let treesOnEdge = (rows * 2) + (cols * 2) - 4
    let walkTowards' = walkTowards trees (withinTreeLines rows cols)
    let walkers = [|
        walkTowards' top
        walkTowards' left
        walkTowards' right
        walkTowards' bottom
    |]
    innerTreeLocations rows cols
    |> Seq.fold (getOverallScore (getScore walkers)) (treesOnEdge, 0)

[<Theory>]
[<InlineData("08-test", 21, 8)>]
[<InlineData("08", 1870, 517440)>]
let test08 fn ep1 ep2  =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)