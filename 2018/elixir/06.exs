get_content = fn path ->
  with {:ok, file} = File.open(path),
    content = IO.read(file, :all),
    :ok = File.close(file) do
      content
  end
end

line_to_cord = fn i, [_, x, y] -> [i, String.to_integer(x), String.to_integer(y)] end

parse_line = fn {l, i} ->
  l
  |> (&Regex.scan(~r/(\d+), (\d+)/, &1)).()
  |> Enum.map((&line_to_cord.(i, &1)))
  |> List.flatten()
end

parse = fn file_name ->
  file_name
  |> get_content.()
  |> String.split("\n")
  |> Enum.with_index()
  |> Enum.map(parse_line)
end

find_boundary = fn [_, x, y], acc ->
  case acc do
    [] -> [x, x, y, y]
    [min_x, max_x, min_y, max_y] -> [min(x, min_x), max(x, max_x), min(y, min_y), max(y, max_y)]
  end
end

claim_location = fn loc, cds ->
  cds
  |> Enum.reduce(loc, fn [name, x, y], l ->
    d = abs(x - l[:x]) + abs(y - l[:y])
    td = l[:td] + d
    [cd, ct] = cond do
      d < l[:cd] or l[:cd] == nil -> [d, name]
      d == l[:cd] -> [d, -1]
      true -> [l[:cd], l[:ct]]
    end
    Map.merge(l, %{ td: td, ct: ct, cd: cd})
  end)
end

build_location_list = fn cds ->
  with [min_x, max_x, min_y, max_y] = Enum.reduce(cds, [], find_boundary) do
    for x <- min_x..max_x, y <- min_y..max_y do
      claim_location.(%{x: x, y: y, edge: (x == min_x) or (y == min_y) or (x == max_x) or (y == max_y), ct: -1, cd: nil, td: 0}, cds)
    end
  end
end

item_count = fn v ->
  if true in v do
    0
  else
    Enum.count(v)
  end
end

solve_chronal_coordinates = fn ip, td ->
  with cds = parse.(ip),
       locations = build_location_list.(cds) do
    [
      locations
      |> Enum.reject((&(&1[:ct] == -1)))
      |> Enum.group_by((&(&1[:ct])), (&(&1[:edge])))
      |> Enum.reduce(0, fn {_, v}, acc -> max(item_count.(v), acc) end),
      locations
      |> Enum.filter((&(&1[:td] < td)))
      |> Enum.count()
    ]
  end
end

[17, 16] = solve_chronal_coordinates.("../inputs/06-test.txt", 32)
[4976, 46462] = solve_chronal_coordinates.("../inputs/06.txt", 10000)

IO.puts("Done")
