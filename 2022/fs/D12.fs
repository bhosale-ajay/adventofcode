module D12

open Common
open Xunit

type Location = int * int
type ElevationMap = Map<Location, int>
type DistanceMap = Map<Location, int>
type ElevationComparer = int option -> int option -> bool

let bind comparer oa ob =
    match oa, ob with
    | Some a, Some b -> comparer a b
    | _ -> false

let charToElevation (s, d) (r, c, e) =
    let current = (r, c)
    match e with
    | 'S' -> (current, int 'a'), (current, d)
    | 'E' -> (current, int 'z'), (s, current)
    | _ -> (current, int e), (s, d)

let next (m : ElevationMap) comparer (visited : Set<Location>) (r, c) =
    [| r, c - 1; r - 1, c; r + 1, c; r, c + 1 |]
    |> Seq.filter (fun n -> (visited.Contains n = false) && comparer (m.TryFind (r, c)) (m.TryFind n))

let updateDistance dist (distMap : DistanceMap) (l : Location) =
    distMap
    |> Map.change l (function
        | Some v -> if v < dist then Some v else Some dist
        | None -> Some dist
    )

let hike elevations start comparer reached =
    let next = next elevations comparer
    let rec move (distMap : DistanceMap) (visited : Set<Location>)=
        match distMap.Count with
        | 0 -> -1
        | _ ->
            let kv = distMap |> Seq.reduce (fun a c -> if a.Value < c.Value then a else c)
            match reached kv.Key with
            | true -> kv.Value
            | false ->
                let visited' = visited.Add kv.Key
                let distMap' =
                    next visited' kv.Key
                    |> Seq.fold (updateDistance (kv.Value + 1)) (distMap.Remove kv.Key)
                move distMap' visited'
    move (Map([start, 0])) Set.empty

let solve fn =
    let (data, (start, destination)) =
        fn
        |> seqOfLines
        |> Seq.mapi (fun r l -> l |> Seq.mapi (fun c e -> r, c, e))
        |> Seq.collect id
        |> Seq.mapFold charToElevation ((0,0), (0,0))
    let elevations = data |> Map.ofSeq
    let reached = (fun l -> l = destination)
    let saveEnergy = bind (fun a b -> b <= a + 1)
    let reachedAnyA = (fun l -> elevations[l] = (int 'a'))
    let maximizeExercise = bind (fun a b -> b >= a - 1)
    let p1 = hike elevations start saveEnergy reached
    let p2 = hike elevations destination maximizeExercise reachedAnyA
    p1, p2

[<Theory>]
[<InlineData("12-test", 31, 29)>]
[<InlineData("12", 380, 375)>]
let test12 fn ep1 ep2 =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)