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

reduce_polymer = fn units, ignore ->
  units
  |> Enum.reduce([], fn
    u, acc when u == ignore or u == ignore + 32 -> acc
    u, [un | rest] when abs(u - un) == 32 -> rest
    u, acc -> [u | acc]
  end)
  |> Enum.count()
end

optimal_solution = fn units ->
  Enum.to_list(65..90)
  |> Enum.map(&(reduce_polymer.(units, &1)))
  |> Enum.min()
end

test_01 = parse.("dabAcCaCBAcCcaDA")
10 = reduce_polymer.(test_01, 0)
4 = optimal_solution.(test_01)
puzzle_input = parse.(get_content.("../inputs/05.txt"))
9808 = reduce_polymer.(puzzle_input, 0)
6484 = optimal_solution.(puzzle_input)

IO.puts("Done")
