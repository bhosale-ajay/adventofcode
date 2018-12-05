get_content = fn path ->
  with {:ok, file} = File.open(path),
    content = IO.read(file, :all),
    :ok = File.close(file) do
      content
  end
end

test_01 = get_content.("../inputs/04-test.txt")
puzzle_input = get_content.("../inputs/04.txt")

line_to_log = fn
  ([_, ts, m, a]) -> [a, ts, String.to_integer(m)]
  ([_, ts, _, _, g]) -> ["begins", ts, String.to_integer(g)]
end

update_log = fn (l, k, from, to) ->
  with r = Enum.to_list(from..to-1) do
    Map.update(l, k, r, &(&1 ++ r))
  end
end

build_log = fn [a, _, ap], [lg, from, log] ->
  case a do
    "begins" -> [ap, from, log]
    "falls" -> [lg, ap, log]
    "wakes" -> [lg, from, update_log.(log, lg, from, ap)]
  end
end

build_report = fn sl ->
  sl
  |> Enum.reduce(%{}, fn x, acc -> Map.update(acc, x, 1, &(&1 + 1)) end)
  |> Enum.reduce([0, 0], fn {ik, iv}, [mk, mv] -> if iv > mv, do: [ik, iv], else: [mk, mv] end)
end

solve = fn l, s ->
  l
  |> Enum.reduce(fn mg, g -> if Enum.at(mg, s) > Enum.at(g, s), do: mg, else: g end)
  |> (&(Enum.at(&1, 0) * Enum.at(&1, 2))).()
end

response_record = fn ip ->
  ip
  |> (&Regex.scan(~r/\[(\d+-\d+-\d+\s\d+:(\d+))]\s(falls|wakes|Guard #(\d+))/, &1)).()
  |> Enum.map(line_to_log)
  |> Enum.sort_by(&(Enum.at(&1, 1)))
  |> Enum.reduce([0, 0, %{}], build_log)
  |> Enum.at(2)
  |> Enum.to_list()
  |> Enum.map(fn {g, sl} -> [g, Enum.count(sl)] ++ build_report.(sl) end)
  |> (&([solve.(&1, 1), solve.(&1, 3)])).()
end

[240, 4455] = response_record.(test_01)
[138280, 89347] = response_record.(puzzle_input)

IO.puts("Done")
