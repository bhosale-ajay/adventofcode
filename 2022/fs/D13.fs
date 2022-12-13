module D13

open Common
open System
open System.Text.Json.Nodes
open Xunit

type Packet =
    | Integer of int
    | List of Packet array

let rec convert (p : JsonNode) : Packet =
    match p with
    | :? JsonValue as n -> Integer (n.GetValue<int>())
    | :? JsonArray as l -> l |> Seq.map convert |> Array.ofSeq |> List
    | _ -> failwith "Invalid Input"

let wrap = Array.singleton >> List
let createDividerPacket = Integer >> wrap >> wrap

let rec compare (l : Packet) (r : Packet) =
    match l, r with
    | Integer li, Integer ri when li < ri -> -1
    | Integer li, Integer ri when li > ri -> 1
    | Integer _, Integer _ -> 0
    | Integer _, List _ -> compare (wrap l) r
    | List _, Integer _ -> compare l (wrap r)
    | List ll, List rl ->
        (ll, rl)
        ||> Seq.fold2 (fun acc a b ->
            match acc with
            | 0 -> compare a b
            | x -> x
        ) 0
        |> function
        | 0 when ll.Length < rl.Length -> -1
        | 0 when ll.Length > rl.Length -> 1
        | x -> x

let solve fn =
    let packets =
        fn
        |> seqOfLines
        |> Seq.filter (fun l -> String.IsNullOrEmpty l = false)
        |> Seq.map (JsonNode.Parse >> convert)
        |> Array.ofSeq
    let p1 =
        [0.. 2 .. (packets.Length - 1)]
        |> Seq.map (fun n ->
            match compare packets[n] packets[n+1] with
            | -1 -> (n/2) + 1
            | _ -> 0)
        |> Seq.sum
    let dp2 = createDividerPacket 2
    let dp6 = createDividerPacket 6
    let packets' =
        packets
        |> Array.append [| dp2; dp6 |]
        |> Array.sortWith compare
    let dp2Index = packets' |> Array.findIndex((=) dp2) |> (+) 1
    let dp6Index = packets' |> Array.findIndex((=) dp6) |> (+) 1
    let p2 = dp2Index * dp6Index
    p1, p2

[<Theory>]
[<InlineData("13-test", 13, 140)>]
[<InlineData("13", 6272, 22288)>]
let test13 fn ep1 ep2 =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
