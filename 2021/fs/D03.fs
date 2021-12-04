module D03

open Common
open System
open Xunit

type Strategy = (int [] [] * int [] []) -> int [] []

let charToInt c = c |> string |> int

let lineToIntArray (l: string) = l.ToCharArray() |> Array.map charToInt

let decideBit count acc sum =
    if sum * 2 > count then
        acc + "1"
    else
        acc + "0"

let findProductOfGammaAndEpsilon (numbers: int [] []) =
    let bitCount = numbers.Length

    numbers
    |> Array.transpose
    |> Array.map Array.sum
    |> Array.fold (decideBit bitCount) ""
    |> fun gb -> (Convert.ToInt32(gb, 2), int (2.0 ** gb.Length))
    |> fun (gamma, tb) -> gamma * (tb - gamma - 1)

let oxygen (z: int [] [], o: int [] []) = if z.Length <= o.Length then o else z

let co2 (z: int [] [], o: int [] []) = if z.Length <= o.Length then z else o

let segregateByBit (position: int) (candidates: int [] []) =
    (Array.filter (fun (c: int []) -> c[ position ] = 0) candidates,
     Array.filter (fun (c: int []) -> c[ position ] = 1) candidates)

let concact acc i = acc + string i

let binaryStringToInt b = Convert.ToInt32(b, 2)

let rec selectCandidate (selector: Strategy) (position: int) (candidates: int [] []) =
    match candidates with
    | [||] -> failwith "No candidates"
    | [| last |] -> last |> Array.fold concact "" |> binaryStringToInt
    | candidates ->
        candidates
        |> segregateByBit position
        |> selector
        |> selectCandidate selector (position + 1)

let findProductOfOxygenAndCo2 ip =
    (selectCandidate oxygen 0 ip)
    * (selectCandidate co2 0 ip)

[<Theory>]
[<InlineData("03-test", 198, 230)>]
[<InlineData("03", 3885894, 4375225)>]
let test fn ep1 ep2 =
    let data = fn |> mapLines lineToIntArray
    Assert.Equal(ep1, findProductOfGammaAndEpsilon data)
    Assert.Equal(ep2, findProductOfOxygenAndCo2 data)
