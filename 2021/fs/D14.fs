module D14

open Common
open System.Collections.Generic
open Xunit

type CountMap<'Key when 'Key : comparison> = Map<'Key, int64>
type RuleMap = Map<string, string * string * char>
type PairKeyValue = KeyValuePair<string,int64>

let selectValue<'Key> (kv: KeyValuePair<'Key,int64>) = kv.Value

let increment<'Key when 'Key : comparison> (key : 'Key) (by: int64) (cm : CountMap<'Key>) =
    let value = cm.TryFind key |> Option.defaultValue 0L
    cm.Add (key, (value + by))

let charsToString (a: char, b : char) = a.ToString() + b.ToString()

// Given  AB -> C
// Return (AB, (AC, CB, C))
let lineToRule (l:string) =
    (
        charsToString (l[0],l[1]),
        (
         charsToString (l[0],l[6]),
         charsToString (l[6],l[1]),
         l[6]
        )
    )

let applyPair (rules : RuleMap) (polymers: CountMap<char>, pairs : CountMap<string>) (kv : PairKeyValue) =
    let pair = kv.Key
    let value = kv.Value
    let (pair1, pair2, p) = rules.[pair]
    (
        polymers |> increment p value,
        pairs |> increment pair1 value |> increment pair2 value
    )

let rec apply (times: int) (rules : RuleMap) (polymers : CountMap<char>) (pairs : CountMap<string>) =
    match times with
    | 0 -> (polymers, pairs)
    | _ ->
        let (polC, pairC) =
            pairs
            |> Seq.fold (applyPair rules) (polymers, Map.empty)
        apply (times - 1) rules polC pairC

let solve (fn: string) (times : int) =
    let input = readLines fn
    let polymers : CountMap<char> =
        input[0]
        |> Seq.countBy id
        |> Seq.map (fun (key, count) -> key, int64 count)
        |> Map
    let pairs : CountMap<string> =
        input[0]
        |> Seq.pairwise
        |> Seq.countBy id
        |> Seq.map (fun (key, count) -> (charsToString key, int64 count))
        |> Map
    let rules : RuleMap =
        input
        |> Array.skip 2
        |> Array.map lineToRule
        |> Map
    let (finalComposition, _) = apply times rules polymers pairs
    let counts = finalComposition |> Seq.map selectValue
    let mostCommon =  counts |> Seq.max
    let leastCommon = counts |> Seq.min
    mostCommon - leastCommon

[<Theory>]
[<InlineData("14-test", 1588, 2188189693529L)>]
[<InlineData("14", 2797, 2926813379532L)>]
let test fn (ep1: int64) (ep2: int64) =
    let ap1 = solve fn 10
    let ap2 = solve fn 40
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
