module Common

open System.IO

let basePath = @"D:\Ajay\Projects\adventofcode\2020\inputs";

let readLines fileName = Path.Combine(basePath, $"{fileName}.txt") |> File.ReadAllLines;

let mapLinesToNumber : string -> int list = readLines >> Array.map int >> Array.toList

