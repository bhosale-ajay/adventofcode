module Common

open System.IO

let basePath =
    @"D:\Ajay\Projects\adventofcode\2021\inputs"

let readLines fileName =
    Path.Combine(basePath, $"{fileName}.txt")
    |> File.ReadAllLines

let mapLinesToNumber: string -> int [] = readLines >> Array.map int

let mapLines mapper fileName =
    fileName |> readLines |> Array.map mapper

let readText fileName = 
    Path.Combine(basePath, $"{fileName}.txt")
    |> File.ReadAllText;
