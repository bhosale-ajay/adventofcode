module D20

open Common
open Xunit

type Data = int64 array array
let next = 2
let prev = 1

let parse fn f : Data =
    let ns =
        fn
        |> seqOfLines
        |> Seq.mapi (fun i x -> [|f * (int64 x); (int64 i) - 1L; (int64 i) + 1L|])
        |> Array.ofSeq
    let l = ns.Length - 1
    ns[0][1] <- l
    ns[l][2] <- 0
    ns

let remove (d: Data) c =
    let cur = d[c]
    let prv = d[int cur[prev]]
    let nxt = d[int cur[next]]
    prv[next] <- cur[next]
    nxt[prev] <- cur[prev]
    
let insertAfter (d: Data) t c =
    let cur = d[c]
    let tar = d[t]
    let nxt = d[int tar[next]]
    cur[prev] <- t
    cur[next] <- tar[next]
    tar[next] <- c
    nxt[prev] <- c

let insertBefore (d: Data) t c =
    let cur = d[c]
    let tar = d[t]
    let prv = d[int tar[prev]]
    cur[prev] <- tar[prev]
    cur[next] <- t
    prv[next] <- c
    tar[prev] <- c

let arrange (d: Data) s h i =
    let cur = d[i]
    let v = cur[0]
    if v = 0 then
        ()
    else
        let t = int ((abs v) % int64 (s - 1))
        let m = v > 0
        let t' = if t > h then s - t else t
        let m' = if t > h then not m else m
        let mover = if m' then next else prev
        let ti =
            [1 .. t']
            |> Seq.fold (fun ci _ -> int (d[ci][mover])) (i)
        remove d i
        if v > 0 then
            insertAfter d ti i
        else
            insertBefore d ti i

let mix (d: Data) =
    let arrange = arrange d d.Length (d.Length / 2)
    [0 .. d.Length - 1]
    |> Seq.iter arrange

let findGroveCoordinates (d: Data) =
    let size = d.Length
    let zi = d |> Array.findIndex (fun i -> i[0] = 0) |> int64
    let locations = [| 1000 % size; 2000 % size; 3000 % size |] |> Array.sort
    let rec loop ci step sum =
        match ci = zi || step > locations[2] with
        | true -> sum
        | false when Array.contains step locations -> loop (d[int ci][next]) (step + 1) (sum + d[int ci][0])
        | _ -> loop (d[int ci][next]) (step + 1) sum
    loop (d[int zi][next]) 1 0

let solve fn times f = 
    let data = parse fn f
    repeat (fun () -> mix data) times
    findGroveCoordinates data

[<Theory>]
[<InlineData("20-test", 3L, 1623178306L)>]
[<InlineData("20", 15297L, 2897373276210L)>]
let test20 fn ep1 ep2 =
    let ap1 = solve fn 1 1
    Assert.Equal(ep1, ap1)
    let ap2 = solve fn 10 811589153
    Assert.Equal(ep2, ap2)

//let findGroveCoordinates (d: Data) =
//    let size = d.Length
//    let zero = d |> Array.findIndex (fun i -> i[0] = 0)
//    let final = Array.create size 0
//    let rec loop ci step =
//        match ci = zero || step > 3001 with
//        | true -> ()
//        | false ->
//            final[step] <- d[ci][0]
//            loop (d[ci][next]) (step + 1)
//    loop (d[zero][next]) 1
//    final[1000 % size] + final[2000 % size] + final[3000 % size]
