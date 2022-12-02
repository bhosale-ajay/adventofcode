module D01

open Common
open Xunit

let pickTop3 c (m1, m2, m3) = 
    if m3 > c then (m1, m2, m3)
    else if m2 > c then (m1, m2, c)
    else if m1 > c then (m1, c, m2)
    else (c, m1, m2)

let folder (c , m) = function
    | Integer n -> (c + n, m)
    | _ -> (0, pickTop3 c m)

let solve fileName = 
    let (_, (m1, m2, m3)) =
        fileName 
        |> seqOfLinesWEE
        |> Seq.fold folder (0, (0,0,0))
    (m1, m1 + m2 + m3)

[<Theory>]
[<InlineData("01-test", 24000, 45000)>]
[<InlineData("01", 68467, 203420)>]
let test01 fn ep1 ep2  =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)