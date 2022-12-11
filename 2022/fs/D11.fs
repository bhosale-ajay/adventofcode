module D11

open Common
open Xunit

type Operation = int64 -> int64
let add p (old : int64) = old + p
let addOld (old : int64) = old + old
let mul p (old : int64) = old * p
let mulOld (old : int64) = old * old

let lineToOperation (line: string) =
    match line[23..].Split(' ') with
    | [| "+"; "old"|] -> addOld
    | [| "+"; n |] -> add (int64 n)
    | [| "*"; "old"|] -> mulOld
    | [| "*"; n |] -> mul (int64 n)
    | _ -> failwith (sprintf "Invalid operation format %s" line)

type Monkey =
    {
        operation : Operation
        divBy: int64
        wt: int
        wf : int
        mutable items: int64 list
        mutable inspected : int64
    }

    static member parse (data: string) =
        let lines = data.Split("\n")
        {
            operation = lineToOperation lines[2]
            divBy = int64 (lines[3][21..])
            wt = int (lines[4][29..])
            wf = int (lines[5][30..])
            items = (lines[1][18..]).Split(", ") |> Seq.map int64 |> List.ofSeq
            inspected = 0
        }

    member self.throw (others : Monkey array) worryFactor =
        self.items
        |> Seq.iter (fun o ->
                let n : int64 = o |> self.operation |> worryFactor
                let at = if n % self.divBy = 0 then self.wt else self.wf
                others[at].catch n)
        self.inspected <- self.inspected + (int64 self.items.Length)
        self.items <- List.empty

    member self.catch (item : int64) =
        self.items <- item :: self.items

let simple n = n / 3L
let complex g n = n % g

let solve fn times isComplex =
    let monkeys =
        fn
        |> splitFile "\n\n"
        |> Array.map Monkey.parse
    let g = monkeys |> Array.map (fun m -> m.divBy) |> Array.reduce (*)
    let wf = if isComplex then complex g else simple
    let round () =
        monkeys |> Seq.iter (fun m -> m.throw monkeys wf)
    repeat round times
    monkeys
    |> Seq.map (fun m -> m.inspected)
    |> Seq.sortDescending
    |> Seq.take 2
    |> Seq.reduce (*)

[<Theory>]
[<InlineData("11-test", 10605L, 2713310158L)>]
[<InlineData("11", 78960L, 14561971968L)>]
let test11 fn ep1 ep2 =
    Assert.Equal(solve fn 20 false, ep1)
    Assert.Equal(solve fn 10000 true, ep2)