test_01 = "abcdef\nbababc\nabbcde\nabcccd\naabcdd\nabcdee\nababab"
test_02 = "abcde\nfghij\nklmno\npqrst\nfguij\naxcye\nwvxyz"
puzzle_input = with {:ok, file} = File.open("../inputs/02.txt"),
   content = IO.read(file, :all),
   :ok = File.close(file) do
    content
end

update_two_three = fn count, c2, c3 ->
  case count do
    2 -> {  1, c3 }
    3 -> { c2,  1 }
    _ -> { c2, c3 }
  end
end

count_two_and_three = fn box_id ->
  box_id
  |> String.split("", trim: true)
  |> Enum.reduce(%{}, fn c, counts -> Map.update(counts, c, 1, &(&1 + 1)) end)
  |> Enum.reduce_while({0, 0}, fn {_, count}, { c2, c3 } ->
    uc = update_two_three.(count, c2, c3)
    case uc do
      { 1, 1 } -> {:halt, uc }
      { _, _ } -> {:cont, uc }
    end
   end)
end

multiply_two_three = fn { c2, c3 } -> c2 * c3 end

find_check_sum = fn box_ids ->
  box_ids
  |> String.split("\n")
  |> Enum.map(count_two_and_three)
  |> Enum.reduce({0, 0}, fn {c2, c3}, {ac2, ac3} -> {c2 + ac2, c3 + ac3} end)
  |> multiply_two_three.()
end

defmodule D02P02 do
  def common_letters_from_match(nil) do
    nil
  end

  def common_letters_from_match({a, b}) do
    a
    |> Enum.reduce({b, []}, fn ca, {[cb | rest], common} ->
      {rest, (if ca == cb, do: [ca | common], else: common)}
    end)
    |> elem(1)
    |> Enum.reverse()
    |> Enum.join("")
  end

  def differ_by_one_char(a, b) do
    a
    |> Enum.reduce_while({b, 0}, fn ca, {[cb | rest], mismatch} ->
      if ca == cb do
        {:cont, {rest, mismatch}}
      else
        {(if mismatch == 0, do: :cont, else: :halt), {rest, mismatch + 1}}
      end
    end)
    |> elem(1) == 1
  end

  def find_matching_ids([_]) do
    nil
  end

  def find_matching_ids([first | rest]) do
    match = Enum.find(rest, fn i -> differ_by_one_char(first, i) end)
    case match do
      nil -> find_matching_ids(rest)
      _ -> { match, first }
    end
  end

  def find_common_letters (ip) do
    ip
    |> String.split("\n", trim: true)
    |> Enum.map(fn l -> String.split(l, "", trim: true) end)
    |> find_matching_ids()
    |> common_letters_from_match()
    end
end

12   = find_check_sum.(test_01)
9633 = find_check_sum.(puzzle_input)

"fgij" = D02P02.find_common_letters(test_02)
"lujnogabetpmsydyfcovzixaw" = D02P02.find_common_letters(puzzle_input)

IO.puts("Done")
