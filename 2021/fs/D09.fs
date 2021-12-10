module D09

open Common
open Xunit
open System.Collections.Generic

type Location = int * int
type AreaKeyValue = KeyValuePair<Location, int>
type Area = Map<Location, int>

let charToInt c = c |> string |> int

let lineToLocations (row: int) (l: string) : (Location * int) [] =
    l.ToCharArray()
    |> Array.mapi (fun col h -> ((row, col), (charToInt h)))

let parse fn : Area =
    fn
    |> readLines
    |> Array.mapi lineToLocations
    |> Array.collect id
    |> Map

let adjacents (r, c) =
    [ r - 1, c // Top
      r, c - 1 // Left
      r, c + 1 // Right
      r + 1, c ] // Bottom

let checkLocation (area: Area) (areaKV: AreaKeyValue) =
    let location = areaKV.Key
    let height = areaKV.Value
    let isAdjacentSmall nh = nh <= height

    location
    |> adjacents
    |> List.choose area.TryFind
    |> List.exists isAdjacentSmall
    |> function
        | true -> None
        | false -> Some(location, height + 1)

let findSizeOfBasin (area: Area) (allVisited: Set<Location>, sizes: int list) (baseLocation: Location) =
    let getUnvisitedAdjacents (visited: Set<Location>) (location: Location) : Location list =
        location
        |> adjacents
        |> List.filter (fun l ->
            visited.Contains l = false
            && allVisited.Contains l = false
            && area.ContainsKey l
            && area[l] < 9)

    let rec walk (toVisit: Location list) (visited: Set<Location>) =
        match toVisit with
        | [] -> visited
        | current :: remaining ->
            match (visited.Contains current) with
            | true -> walk remaining visited
            | false -> walk (remaining @ getUnvisitedAdjacents visited current) (visited.Add current)

    let v = walk ([ baseLocation ]) Set.empty
    ((allVisited + v), v.Count :: sizes)

let solve (fn: string) =
    let area = fn |> parse
    let lowPoints = area |> Seq.choose (checkLocation area)
    let sumOfRisks = lowPoints |> Seq.sumBy snd

    let productOfBasinSize =
        lowPoints
        |> Seq.map fst
        |> Seq.fold (findSizeOfBasin area) (Set.empty, List.empty)
        |> snd
        |> List.sortDescending
        |> List.take 3
        |> List.reduce (fun a b -> a * b)

    (sumOfRisks, productOfBasinSize)

[<Theory>]
[<InlineData("09-test", 15, 1134)>]
[<InlineData("09", 535, 1122700)>]
let test fn (ep1: int64) (ep2: int64) =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
