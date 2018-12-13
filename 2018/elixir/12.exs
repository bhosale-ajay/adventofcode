defmodule D12 do
  def parse(path) do
    with {:ok, file} = File.open(path),
      content = IO.read(file, :all),
      :ok = File.close(file),
      [fl, _ | comb] = String.split(content, "\n"),
      [_, is] = String.split(fl, ": ") do
        [
          is,
          comb
          |> Enum.map(fn l -> String.split(l, " => ") end)
          |> Enum.reduce(%{}, fn [k, v], c -> Map.put(c, k, v) end)
        ]
    end
  end

  def grow(_, _, _, gen, target, _, _, last_sum, last_diff, 3) do
    last_sum + ((target - gen + 1) * last_diff)
  end

  def grow(<<head :: binary-size(5)>> <> rest, ns, com, gen, target, sum, counter, last_sum, last_diff, streak) do
    with (<<_ :: binary-size(1)>> <> r) = head,
        pot = Map.get(com, head, "."),
        number = (if pot == "#", do: counter + gen * -2, else: 0)
    do
      grow(r <> rest, ns <> pot, com, gen, target, sum + number, counter + 1, last_sum, last_diff, streak)
    end
  end

  def grow(_, _, _, gen, target, sum, _, _, _, _) when gen == target do
    # IO.puts("#{gen} - #{sum} - #{last_diff}")
    sum
  end

  def grow(_, ns, com, gen, target, sum, _, last_sum, last_diff, streak) do
    # IO.puts("#{gen} - #{sum}- #{last_diff}")
    grow("...." <> ns <> "....", "", com, gen + 1, target, 0, 0,
        sum, # last_sum
        sum - last_sum, # last_diff
        (if last_diff == sum - last_sum, do: streak + 1, else: 0))
  end

  def solve(ip, target) do
    with [is, com] = parse(ip) do
      grow("...." <> is <> "....", "", com, 1, target, 0, 0, 0, 0, 0)
    end
  end
end

325 = D12.solve("../inputs/12-test.txt", 20)
2542 = D12.solve("../inputs/12.txt", 20)
2550000000883 = D12.solve("../inputs/12.txt", 50000000000)

IO.puts("Done")
