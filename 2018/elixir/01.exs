find_resulting_frequency = fn ip -> Enum.sum(ip) end

first_frequency_reaches_twice = fn ip ->
  ip
  |> Stream.cycle()
  |> Enum.reduce_while({0, MapSet.new([0])}, fn i, {current, seen} ->
      frequency = current + i
      if MapSet.member?(seen, frequency) do
        {:halt, frequency}
      else
        {:cont, {frequency, MapSet.put(seen, frequency)}}
      end
    end)
end

puzzle_input = with {:ok, file} = File.open("../inputs/01.txt"),
  content = IO.read(file, :all),
  :ok = File.close(file) do
    content
    |> String.split("\n")
    |> Enum.map(&String.to_integer/1)
end

3   = find_resulting_frequency.([+1, +1, +1])
0   = find_resulting_frequency.([+1, +1, -2])
-6  = find_resulting_frequency.([-1, -2, -3])
466 = find_resulting_frequency.(puzzle_input)

0   = first_frequency_reaches_twice.([+1, -1])
10  = first_frequency_reaches_twice.([+3, +3, +4, -2, -4])
5   = first_frequency_reaches_twice.([-6, +3, +8, +5, -6])
14  = first_frequency_reaches_twice.([+7, +7, -2, -7, -4])
750 = first_frequency_reaches_twice.(puzzle_input)

IO.puts("Done")
