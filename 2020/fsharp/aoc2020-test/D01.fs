module D01

open Xunit
open Common

let target = 2020
let IsUnder678 a = a < 678
let IsUnder1010 b = b < 1010

// This is a method syntax
// Uses tuple form to pass arguments
// It can not be used directly in with Pipe Forward
let rec findMatchTupleFormat (state: Set<int>, list : int list) =
    match list with
    | [] -> None
    | a :: tail ->
        match state.Contains(target - a) with
        | true -> Some (a * (target - a))
        // findMatchTupleFormat invoked using tuple syntax
        | false -> findMatchTupleFormat (state.Add(a), tail)

// This is currying syntax
let rec findMatchRec : Set<int> -> int list -> int Option = fun state list ->
    match list with
    | [] -> None
    | a :: tail ->
        match state.Contains(target - a) with
        | true -> Some (a * (target - a))
        | false -> findMatchRec (state.Add a) tail
        // Also works
        // | false -> state.Add a  |> findMatchRec <| tail

// Curried
let findMatch = findMatchRec Set.empty 

let isMatch (a: int, tail: seq<int>) =
    tail
    |> Seq.takeWhile IsUnder1010
    |> Seq.allPairs tail
    |> Seq.filter (fun (b, c) -> b <> c)
    |> Seq.tryFind (fun (b, c) -> a + b + c = target)
    |> function
        | Some (b, c) -> Some(a * b * c)
        | None -> None

let rec findTriplets (list: int list) =
    match list with
    | [] -> None
    | a :: tail ->
        match IsUnder678 a with
        | false -> None
        | true ->
            match isMatch(a, tail) with
            | Some p -> Some p
            | None -> findTriplets tail

let findProduct (list: int list) =
    let sortedList = List.sort list
    assert(List.length sortedList >= 3)
    let sumOfFirstTwo = sortedList.Item 0 + sortedList.Item 1
    let isCandidate n = n < target - sumOfFirstTwo
    sortedList
        |> List.takeWhile isCandidate
        |> findTriplets

[<Theory>]
[<InlineData("01-test", 514579)>]
[<InlineData("01", 788739)>]
let P1TupleFomat (ip: string, expected: int) =
    let numbers = ip 
                |> mapLinesToNumber
    Assert.Equal(Some expected, findMatchTupleFormat(Set.empty, numbers))

[<Theory>]
[<InlineData("01-test", 514579)>]
[<InlineData("01", 788739)>]
let P1 (ip: string, expected: int) =
    let answer = ip 
                |> mapLinesToNumber 
                |> findMatch
    Assert.Equal(Some expected, answer)

[<Theory>]
[<InlineData("01-test", 241861950)>]
[<InlineData("01", 178724430)>]
let P2 (ip: string, expected: int) =
    let answer = ip 
                    |> mapLinesToNumber
                    |> findProduct
    Assert.Equal(Some expected, answer)
