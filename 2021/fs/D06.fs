module D06

open Common
open Xunit

let countFishByDay (dw: int64[]) (f:int) =
    dw[f] <- dw[f] + 1L
    dw

let getSea (fn: string) =
    fn
    |> readText
    |> (fun s -> s.Split ',')
    |> Array.map int
    |> Array.fold countFishByDay (Array.create 9 0L)

let simulate (dw: int64[]) (days: int) =
    for i in 1 .. days do
        let adultsReady = dw[0]
        dw[0] <- dw[1]
        dw[1] <- dw[2]
        dw[2] <- dw[3]
        dw[3] <- dw[4]
        dw[4] <- dw[5]
        dw[5] <- dw[6]
        dw[6] <- dw[7] + adultsReady
        dw[7] <- dw[8]
        dw[8] <- adultsReady

let solve fn =
    let sea = getSea fn
    simulate sea 80
    let p1 = Array.sum sea
    simulate sea (256 - 80)
    let p2 = Array.sum sea
    (p1, p2)

[<Theory>]
[<InlineData("06-test", 5934L, 26984457539L)>]
[<InlineData("06", 351092L, 1595330616005L)>]
let test fn (ep1: int64) (ep2:int64) =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
