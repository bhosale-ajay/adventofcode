module D02

open Common
open Xunit

type Set =
    { Red: int32
      Green: int32
      Blue: int32 }

    static member Default = { Red = 0; Green = 0; Blue = 0 }

    static member processColor (c: Set) (data: string array) =
        match data[1] with
        | "red" -> { c with Red = (int) data[0] }
        | "green" -> { c with Green = (int) data[0] }
        | "blue" -> { c with Blue = (int) data[0] }
        | _ -> c

    static member fromString(line: string) =
        line
        |> splitByCharArray [| ','; ' ' |]
        |> Array.windowed 2
        |> Array.fold Set.processColor Set.Default

    static member getMax (mr, mg, mb) (c: Set) =
        (max c.Red mr, max c.Green mg, max c.Blue mb)

type Game =
    { Id: int
      Sets: Set array }

    static member fromString(line: string) =
        let parts = line |> splitByString ": "
        let sets = parts[1] |> splitByString ";" |> Array.map Set.fromString

        { Id = (int) (parts[0][5..])
          Sets = sets }

    static member isPossible(g: Game) =
        g.Sets |> Array.forall (fun s -> s.Red <= 12 && s.Green <= 13 && s.Blue <= 14)

    static member getPower(g: Game) =
        g.Sets |> Array.fold Set.getMax (0, 0, 0) |> (fun (mr, mg, mb) -> mr * mg * mb)

let solve fn =
    let games = fn |> seqOfLines |> Seq.map Game.fromString
    let p1 = games |> Seq.filter Game.isPossible |> Seq.sumBy (fun g -> g.Id)
    let p2 = games |> Seq.map Game.getPower |> Seq.sum
    (p1, p2)

[<Theory>]
[<InlineData("02-t1", 8, 2286)>]
[<InlineData("02", 3099, 72970)>]
let test02 fn ep1 ep2 =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
