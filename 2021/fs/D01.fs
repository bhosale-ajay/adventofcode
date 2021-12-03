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
