module D12

open Common
open System
open Xunit

type CaveMap = Map<string, string []>

let lineToConnectionPair (line: string) =
    line.Split "-"
    |> (fun lp -> [| (lp.[0], lp.[1]); (lp.[1], lp.[0]) |])

let parse (fn: string) : CaveMap =
    fn
    |> mapLines lineToConnectionPair
    |> Array.concat
    |> Array.filter (fun (f, t) -> not (f = "end" || t = "start"))
    |> Array.groupBy fst
    |> Array.map (fun k -> (fst k, k |> snd |> Array.map snd))
    |> Map
    |> Map.add "end" [||]

let solve (fn: string) =
    let caveMap = parse fn

    let rec check (visited: Set<string>) (singleVisit: bool) (current: string) =
        match current with
        | "end" -> 1
        | _ when
            visited.Contains current
            && (singleVisit || current = "start")
            ->
            0
        | _ ->
            let updatedSingleVisit = visited.Contains current || singleVisit

            let updatedVisited =
                if Char.IsLower(current.[0]) then
                    visited.Add(current)
                else
                    visited

            caveMap.[current]
            |> Array.map (check updatedVisited updatedSingleVisit)
            |> Array.sum

    (check Set.empty true "start", check Set.empty false "start")

[<Theory>]
[<InlineData("12-test-0", 10, 36)>]
[<InlineData("12-test-1", 19, 103)>]
[<InlineData("12-test-2", 226, 3509)>]
[<InlineData("12", 3708, 93858)>]
let test fn (ep1: int) (ep2: int64) =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
