module D07

open Common
open Xunit
open System.Text.RegularExpressions

type Directory = Map<string, int>

let (|CD|_|) (l: string) = if l.StartsWith ("$ cd ") then Some l[5..] else None

let (|File|_|) (l: string) =
   let m = Regex.Match(l,"(\d+)")
   if (m.Success) then Some (int m.Groups.[1].Value) else None

let updateDirectorySize size (directory: Directory) path =
     directory 
     |> Map.change path (function
        | Some s -> Some (s + size)
        | None -> Some size)

let folder (paths: string list, directory: Directory) = function
    | CD "/" -> [""], directory
    | CD ".." -> paths.Tail, directory
    | CD d -> (paths.Head + "/" + d) :: paths, directory
    | File size -> paths, paths |> List.fold (updateDirectorySize size) directory
    | _ -> paths, directory

let solve fileName =
    let (_, d) =
        fileName
        |> seqOfLines
        |> Seq.fold folder (List.Empty, Map.empty)
    let gap = 30000000 - 70000000 + (d.Item "")
    (
        d.Values 
        |> Seq.filter (fun s -> s <= 100000)
        |> Seq.sum,
        d.Values
        |> Seq.filter (fun s -> s > gap)
        |> Seq.min
    )

[<Theory>]
[<InlineData("07-test", 95437, 24933642)>] 
[<InlineData("07", 1583951, 214171)>]
let test07 fn ep1 ep2  =
    let (ap1, ap2) = solve fn
    Assert.Equal(ep1, ap1)
    Assert.Equal(ep2, ap2)