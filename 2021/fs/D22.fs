module D22

open Common
open System.Text.RegularExpressions
open Xunit

let lineRegEx = "-?\d+"

type Range = int * int
type Cube =
    { xRange: Range
      yRange: Range
      zRange: Range }
type Step = bool * Cube
type State = Cube list * Cube list

module Range =
    let size ((f, t) : Range) = (int64)t - (int64)f + 1L
    let isIntersecting ((af, at) : Range) ((bf, bt) : Range) =
        af <= bt && bf <= at
    let merge ((af, at) : Range) ((bf, bt) : Range) : Range =
        max af bf, min at bt

module Cube =
    let getIntersection (a: Cube) (b: Cube) : Option<Cube> =
        match (
            Range.isIntersecting a.xRange b.xRange &&
            Range.isIntersecting a.yRange b.yRange &&
            Range.isIntersecting a.zRange b.zRange) with
        | true -> Some {
                     xRange = Range.merge a.xRange b.xRange
                     yRange = Range.merge a.yRange b.yRange
                     zRange = Range.merge a.zRange b.zRange
                  }
        | false -> None

    let size (c: Cube) =
        Range.size c.xRange *
        Range.size c.yRange *
        Range.size c.zRange

let matchToRanges (l: string) =
    let bs =
        Regex.Matches(l, lineRegEx)
        |> Seq.map (fun m ->
                    m.Groups
                    |> Seq.map (fun g -> int g.Value)
                    |> Seq.toArray
                    |> (fun m -> m[0]))
        |> Seq.toArray
    (bs.[0], bs.[1]), (bs.[2], bs.[3]), (bs.[4], bs.[5])

let lineToStep (l: string) : Step =
    let action = l.[1] = 'n'
    let (xRange, yRange, zRange) = matchToRanges l
    (
        action,
        {
            xRange = xRange
            yRange = yRange
            zRange = zRange
        }
    )

let executeStep ((on, overlapping) : State) ((action, cube) : Step) : State =
    let cOverlapping = on |> List.choose (Cube.getIntersection cube)
    let parts = overlapping |> List.choose (Cube.getIntersection cube)
    let cl = if action then [cube] else List.empty
    on @ parts @ cl, overlapping @ cOverlapping

let reboot (fn: string) =
    let (on, overlapping) =
        fn
        |> readLines
        |> Array.map lineToStep
        |> Array.fold executeStep (list.Empty, list.Empty)
    List.sumBy Cube.size on - List.sumBy Cube.size overlapping

[<Theory>]
[<InlineData("22-test-03", 2758514936282235L)>]
[<InlineData("22", 1165737675582132L)>]
let test (fn: string) (ep: int64) =
    let a = reboot fn
    Assert.Equal(ep, a)
