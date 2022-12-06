module D06

open Common
open Xunit

let findDuplicateIndex (m: string) =
    [m.Length - 2 .. -1 .. 0]
    |> Seq.tryFind (fun i -> m[i + 1 .. ].Contains(m[i]))

let solve (buffer: string) size =
    let rec find p =
        if p >= buffer.Length then -1
        else
            match findDuplicateIndex buffer[p - size .. p - 1] with
            | None -> p
            | Some di -> find (p + 1 + di)
    find size

[<Theory>]
[<InlineData("mjqjpqmgbljsphdztnvjfqwrcgsmlb", 7, 19)>]
[<InlineData("bvwbjplbgvbhsrlpgdmjqwftvncz", 5, 23)>]
[<InlineData("nppdvjthqldpwncqszvftbrmjlhg", 6, 23)>]
[<InlineData("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 10, 29)>]
[<InlineData("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 11, 26)>]
[<InlineData("06", 1598, 2414)>]
let test06 (data: string) ep1 ep2 =
    let buffer = if data.Length = 2 then (readFile data) else data
    let ap1 = solve buffer 4
    Assert.Equal(ep1, ap1)
    let ap2 = solve buffer 14
    Assert.Equal(ep2, ap2)