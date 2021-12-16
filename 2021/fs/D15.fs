module D15

open Common
open System
open System.Collections.Generic
open Xunit

type RiskMap = Map<int * int, int>
type Queue = PriorityQueue<int * int, int>
type DistanceMap = Map<int * int, int>
type VisitSet = Set<int * int>

let enqueue element priority (queue: Queue) =
    queue.Enqueue(element, priority)
    queue

let dequeue (queue: Queue) = queue.Dequeue()

let neighbors (rc, cc) (r, c) =
    [ r - 1, c // Top
      r, c - 1 // Left
      r, c + 1 // Right
      r + 1, c ] // Bottom
    |> List.filter (fun (ri, ci) -> 0 <= ri && ri < rc && 0 <= ci && ci < cc)

let charToInt c = c |> string |> int

let parseLine (ri: int) (l: string) =
    l.ToCharArray()
    |> Array.mapi (fun ci c -> ((ri, ci), charToInt c))

let parse fn =
    fn
    |> readLines
    |> Array.mapi parseLine
    |> Array.concat
    |> Map

let findLeastRisk (risks: RiskMap) =
    let size = risks.Count |> double |> sqrt |> int
    let start = (0, 0)
    let endLocation = (size - 1, size - 1)
    let neighborFinder = neighbors (size, size)
    let seedQueue = Queue() |> enqueue start 0

    let seedDistanceMap =
        risks
        |> Map.map (fun _ _ -> Int32.MaxValue)
        |> Map.add start 0

    let rec visit (dist: DistanceMap) (queue: Queue) (visited: VisitSet) =
        match queue.Count = 0
              || dist.[endLocation] < Int32.MaxValue
            with
        | true -> dist.[endLocation]
        | false ->
            let location = dequeue queue

            let updatedDM, updatedQ =
                neighborFinder location
                |> List.filter (fun n -> not (visited.Contains n))
                |> Seq.map (fun n -> (n, dist.[location] + risks.[n]))
                |> Seq.filter (fun (n, d) -> d < dist.[n])
                |> Seq.fold (fun (ud, uq) (n, d) -> Map.add n d ud, enqueue n d uq) (dist, queue)

            visit updatedDM updatedQ (visited.Add location)

    visit seedDistanceMap seedQueue Set.empty

let solve (fn: string) =
    let risks = parse fn
    let size = risks.Count |> double |> sqrt |> int

    let expanded =
        Seq.allPairs [ 0 .. 4 ] [ 0 .. 4 ]
        |> Seq.allPairs risks
        |> Seq.map (fun (kvp, (i, j)) ->
            let (x, y) = kvp.Key
            let risk = (kvp.Value + i + j - 1) % 9 + 1
            (x + i * size, y + j * size), risk)
        |> Map

    (findLeastRisk risks, findLeastRisk expanded)

[<Theory>]
[<InlineData("15-test", 40, 315)>]
[<InlineData("15", 769, 2963)>]
let test fn (ep1: int) (ep2: int) =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
