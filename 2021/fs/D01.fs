module D01

open Xunit
open Common

let isIncreasing (a, b) = b > a

let countIfIncrements ip = ip 
                            |> mapLinesToNumber
                            |> Array.pairwise
                            |> Array.filter isIncreasing
                            |> Array.length

let countIfSlidingWindowIncrements ip = ip 
                                        |> mapLinesToNumber 
                                        |> Array.windowed 3 
                                        |> Array.map Array.sum 
                                        |> Array.pairwise 
                                        |> Array.filter isIncreasing 
                                        |> Array.length

[<Theory>]
[<InlineData("01-test", 7)>]
[<InlineData("01", 1791)>]
let P1 (ip: string, expected: int) =
    Assert.Equal(expected, countIfIncrements ip)

[<Theory>]
[<InlineData("01-test", 5)>]
[<InlineData("01", 1822)>]
let P2 (ip: string, expected: int) =
    Assert.Equal(expected, countIfSlidingWindowIncrements ip)

