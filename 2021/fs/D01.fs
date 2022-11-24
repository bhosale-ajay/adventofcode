module D01

open Common
open Xunit

let isIncreasing (a, b) = a < b

let countIfIncrements fn =
    fn
    |> mapLinesToNumber
    |> Array.pairwise
    |> Array.filter isIncreasing
    |> Array.length

let countIfSlidingWindowIncrements fn =
    fn
    |> mapLinesToNumber
    |> Array.windowed 3
    |> Array.map Array.sum
    |> Array.pairwise
    |> Array.filter isIncreasing
    |> Array.length

let countIfLarge acc a b =
    if a < b then
        acc + 1
    else
        acc

let count (seq: int seq) dist =
    (0, seq, seq |> Seq.skip dist) |||>
        Seq.fold2 countIfLarge

[<Theory>]
[<InlineData("01-test", 7)>]
[<InlineData("01", 1791)>]
let P1 fn expected =
    Assert.Equal(expected, countIfIncrements fn)

[<Theory>]
[<InlineData("01-test", 5)>]
[<InlineData("01", 1822)>]
let P2 fn expected =
    Assert.Equal(expected, countIfSlidingWindowIncrements fn)
    Assert.Equal(expected, countIfSlidingWindowIncrements fn)

[<Theory>]
[<InlineData("01-test", 7, 5)>]
[<InlineData("01", 1791, 1822)>]
let P ip ep1 ep2 =
    let numbers = mapLinesToNumber ip
    Assert.Equal(ep1, count numbers 1)
    Assert.Equal(ep2, count numbers 3)
