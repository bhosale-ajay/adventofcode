module D02

open Common
open Xunit

type CommandType = Forward | Down | Up
type Instruction = { Command: CommandType; Unit: int }
type Position = { Horizontal : int; Depth1: int; Depth2 : int; Aim : int }

let parseCommandType = function
    | "forward" -> Forward
    | "down" -> Down
    | "up" -> Up
    | code -> failwith (sprintf "Wrong Command Type! %s" code)

let toInstruction (line : string) =
    let parts = line.Split()
    { Command = parseCommandType parts[0]; Unit = int parts[1] }

let navigate (p:Position) (i: Instruction) =
    match i with
    | { Command = Forward; Unit = u  } -> { p with Horizontal = p.Horizontal + u; Depth2 = p.Depth2 + (u * p.Aim) }
    | { Command = Down; Unit = u } -> { p with Depth1 = p.Depth1 + u; Aim = p.Aim + u }
    | { Command = Up; Unit = u } -> { p with Depth1 = p.Depth1 - u; Aim = p.Aim - u }

let getProducts (p:Position) : (int * int) = (p.Horizontal * p.Depth1, p.Horizontal * p.Depth2)

let solve fn = fn
                |> mapLines toInstruction
                |> Array.fold navigate { Horizontal = 0 ; Depth1 = 0; Depth2 = 0; Aim = 0 }
                |> getProducts

[<Theory>]
[<InlineData("02-test", 150, 900)>]
[<InlineData("02", 1250395, 1451210346)>]
let test fn ep1 ep2 =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
