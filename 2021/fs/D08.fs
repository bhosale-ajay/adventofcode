module D08

open Common
open Xunit

type Pattern = (char * char * char)

let lineToNote (l:string) = l.Split(" | ")

let countByOccurrences (pattern: string) =
    pattern.ToCharArray()
    |> Array.countBy id

let findOneByCount (count: int) (occurrences : (char * int)[]) =
    occurrences
    |> Array.find (fun (_, oc) -> oc = count)
    |> fst

let findByCount (count: int) (occurrences : (char * int)[]) =
    occurrences
    |> Array.filter (fun (_, oc) -> oc = count)
    |> Array.map fst
    |> Set.ofArray

let findPattern (length: int) (patterns: string[]) =
    patterns
    |> Array.find (fun p -> length = p.Length)
    |> (fun p -> p.ToCharArray())
    |> Set.ofArray

let deductPattern (p:string) : Pattern =
    let patterns = p.Split(" ")
    let p4 = patterns |> findPattern 4
    let occurrences = patterns
                        |> String.concat ""
                        |> countByOccurrences
    let b = occurrences |> findOneByCount 6
    let e = occurrences |> findOneByCount 4
    let dg = occurrences |> findByCount 7
    let g = dg - p4
    let d = dg - g |> Seq.head
    (b, d, e)

let decodeValue (pattern: Pattern) (value: string) =
    let (b, d, e) = pattern
    match value.Length with
    | 2 -> ("1", 1)
    | 3 -> ("7", 1)
    | 4 -> ("4", 1)
    | 5 -> (
            if value.Contains(e) then
                ("2", 0)
            elif value.Contains(b) then
                ("5", 0)
            else 
                ("3", 0)
            )
    | 6 -> (
            if value.Contains(d) = false then
                ("0", 0)
            elif value.Contains(e) = false then
                ("9", 0)
            else
                ("6", 0)
            )
    | _ -> ("8", 1)

let mergeValues a b =
    (fst a + fst b, snd a + snd b)

let decodeNote (note: string[]) =
    let pattern = deductPattern note[0]
    note[1].Split(" ")
    |> Array.map (decodeValue pattern)
    |> Array.reduce mergeValues 
    |> (fun d -> (int (fst d), snd d))

let mergeLines a b =
    (fst a + fst b, snd a + snd b)

let solve (fn: string) =
    fn 
    |> mapLines lineToNote
    |> Array.map decodeNote
    |> Array.reduce mergeLines

[<Theory>]
[<InlineData("08-test", 61229, 26)>]
[<InlineData("08", 986179, 278)>]
let test fn (ep1: int64) (ep2:int64) =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
