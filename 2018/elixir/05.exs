get_content = fn path ->
  with {:ok, file} = File.open(path),
    content = IO.read(file, :all),
    :ok = File.close(file) do
      content
  end
end

parse = fn s ->
  s
  |> to_charlist()
end

reduce_polymer = fn units ->
  units
  |> Enum.reduce([], fn
    u, [] -> [u]
    u, [un | rest] -> if abs(u - un) == 32, do: rest, else: [u, un | rest]
  end)
  |> Enum.count()
end

optimal_solution = fn units ->
  Enum.to_list(65..90)
  |> Enum.map((&(Enum.filter(units, fn u -> !(u === &1 or u === &1 + 32) end))))
  |> Enum.map(reduce_polymer)
  |> Enum.min()
end

test_01 = parse.("dabAcCaCBAcCcaDA")
10 = reduce_polymer.(test_01)
4 = optimal_solution.(test_01)
puzzle_input = parse.(get_content.("../inputs/05.txt"))
9808 = reduce_polymer.(puzzle_input)
6484 = optimal_solution.(puzzle_input)

IO.puts("Done")
