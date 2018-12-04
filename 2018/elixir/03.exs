test_01 = "#1 @ 1,3: 4x4\n#2 @ 3,1: 4x4\n#3 @ 5,5: 2x2"
puzzle_input = with {:ok, file} = File.open("../inputs/03.txt"),
   content = IO.read(file, :all),
   :ok = File.close(file) do
    content
end

update_cord = fn [id, x, y, w, h] -> [id, x, y, x + w - 1, y + h - 1] end

parse_line = fn l ->
  l
  |> (&Regex.scan(~r/\d+/, &1)).()
  |> List.flatten()
  |> Enum.map(&String.to_integer/1)
  |> update_cord.()
end

parse = fn ip ->
  ip
  |> String.split("\n")
  |> Enum.map(parse_line)
end

get_squares = fn ([_, x1, y1, x2, y2]) ->
  for x <- x1..x2, y <- y1..y2, do: {x, y}
end

claim_squares = fn (claim, acc) ->
  claim
  |> get_squares.()
  |> Enum.reduce(acc, fn s, {fabric, disputed} ->
    {Map.update(fabric, s, 1, &(&1 + 1)), (if fabric[s] == 1, do: disputed + 1, else: disputed)}
  end)
end

find_undisputed = fn fabric, claims ->
  claims
  |> Enum.find(fn c -> Enum.all?(get_squares.(c), fn s -> fabric[s] == 1 end) end)
end

slice_it = fn ip ->
  with claims = parse.(ip),
    { fabric, disputed } = Enum.reduce(claims, {%{}, 0}, claim_squares),
    [undisputed_id | _] =  find_undisputed.(fabric, claims) do
    [disputed, undisputed_id]
  end
end

[4, 3] = slice_it.(test_01)
[119572, 775] = slice_it.(puzzle_input)

IO.puts("Done")
