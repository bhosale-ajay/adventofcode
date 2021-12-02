module D02

open Xunit
open Common

type CommandType = Forward | Down | Up
type Instruction = {command: CommandType; unit: int}
type Position = { horizontal : int; depth1: int; depth2 : int; aim : int }

let parseCommandType = function
    | "forward" -> Forward
    | "down" -> Down
    | "up" -> Up
    | code -> failwith (sprintf "Wrong Command Type! %s" code)

let toInstruction (line : string) : Instruction =
    let parts = line.Split()
    { command = parseCommandType parts[0]; unit = int parts[1] }

let naviagte (p:Position) (i: Instruction) =
    match i with
    | { command = Forward; unit = u  } -> { p with horizontal = p.horizontal + u; depth2 = p.depth2 + (u * p.aim) }
    | { command = Down; unit = u } -> { p with depth1 = p.depth1 + u; aim = p.aim + u }
    | { command = Up; unit = u } -> { p with depth1 = p.depth1 - u; aim = p.aim - u }

let getProducts (p:Position) : (int * int) = (p.horizontal * p.depth1, p.horizontal * p.depth2)

let solve ip = ip
                |> mapLines toInstruction
                |> Array.fold naviagte { horizontal = 0 ; depth1 = 0; depth2 = 0; aim = 0 }
                |> getProducts

[<Theory>]
[<InlineData("02-test", 150, 900)>]
[<InlineData("02", 1250395, 1451210346)>]
let test ip ep1 ep2 =
    let (ap1, ap2) = solve ip
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)
