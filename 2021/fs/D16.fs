module D16

open Common
open System
open Xunit

type Operator =
    | Sum = 0
    | Product = 1
    | Min = 2
    | Max = 3
    | Literal = 4
    | GreaterThan = 5
    | LessThan = 6
    | EqualTo = 7

type LengthType =
    | LenghtInBits = 0
    | NumberOfSubPackets = 1

type Packet =
    | Literal of int * int64
    | Operation of int * Operator * Packet list

let hexToDecimal (c: char) = Convert.ToInt32((string c), 16)

let decimalToBinary (d: int) = Convert.ToString(d, 2).PadLeft(4, '0')

let hexToBinary = hexToDecimal >> decimalToBinary

let part (s: string) f l = s.[f..(f + l - 1)]

let binaryToNumber (s: string) f l = Convert.ToInt32(s.[f..(f + l - 1)], 2)

let parseLiteralValue (data: string) =
    let rec parseLiteralValueRec value consumed n =
        let next = part data (5 * n) 5
        let nextValue = value + part next 1 4

        match next.[0] = '1' with
        | true -> parseLiteralValueRec nextValue (consumed + 5) (n + 1)
        | false -> Convert.ToInt64(nextValue, 2), consumed + 5

    parseLiteralValueRec "" 0 0

// Return Literal and remaining
let parseLiteral (data: string) =
    let version = binaryToNumber data 0 3
    let remaining = data.[6..]
    let (value, consumed) = parseLiteralValue remaining
    (Literal(version, value), data.[6 + consumed..])

let rec parsePacket (data: string) =
    match data = "" with
    | true -> None
    | _ ->
        let operatorType =
            binaryToNumber data 3 3 |> enum<Operator>

        match operatorType with
        | Operator.Literal -> Some(parseLiteral data)
        | _ ->
            let version = binaryToNumber data 0 3

            let lengthType =
                binaryToNumber data 6 1 |> enum<LengthType>

            match lengthType with
            | LengthType.LenghtInBits ->
                let totalLenghtInBits = binaryToNumber data 7 15
                let subPacketsData = part data 22 totalLenghtInBits
                let subPackets = List.unfold parsePacket subPacketsData
                Some(Operation(version, operatorType, subPackets), data.[22 + totalLenghtInBits..])
            | LengthType.NumberOfSubPackets ->
                let numberOfSubPackets = binaryToNumber data 7 11
                let subPacketsData = data.[18..]

                let subPackets, remaining =
                    [ 1 .. numberOfSubPackets ]
                    |> List.fold
                        (fun (ps, sd) _ ->
                            // trusting input here
                            // and hoping Option.get
                            // will not throw error
                            let p, r = parsePacket sd |> Option.get
                            (p :: ps, r))
                        ([], subPacketsData)
                // need List.rev as fold is adding p at the top
                // correct order needed for GreaterThan, LessThan
                Some(Operation(version, operatorType, List.rev subPackets), remaining)
            | _ -> None

let rec versionSum (packet: Packet) =
    match packet with
    | Literal (v, _) -> v
    | Operation (v, _, sp) -> v + List.sumBy versionSum sp

let rec evaluate (packet: Packet) =
    match packet with
    | Literal (_, v) -> v
    | Operation (_, op, sp) ->
        let values = List.map evaluate sp

        match op, values with
        | Operator.Sum, l -> List.sum l
        | Operator.Product, l -> List.reduce (*) l
        | Operator.Min, l -> List.min l
        | Operator.Max, l -> List.max l
        | Operator.GreaterThan, [ a; b ] -> if a > b then 1L else 0L
        | Operator.LessThan, [ a; b ] -> if a < b then 1L else 0L
        | Operator.EqualTo, [ a; b ] -> if a = b then 1L else 0L
        | _ -> failwith "Invalid operation"

let solve (fn: string) =
    let result =
        fn
        |> readText
        |> Seq.map hexToBinary
        |> String.Concat
        |> parsePacket

    match result with
    | None -> 0, 0L
    | Some vr ->
        let packet = fst vr
        versionSum packet, evaluate packet

[<Theory>]
[<InlineData("16-test-0", 31, 54)>]
[<InlineData("16-test-1", 8, 54)>]
[<InlineData("16", 895, 1148595959144L)>]
let test fn (ep1: int) (ep2: int64) =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
