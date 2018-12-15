# No good option for data structure with random access, end up using Map, only part 1
defmodule D14 do
  def iterate(board, fe, se, count, iterations) do
    fe_rec = Map.get(board, fe) # elem(board, fe)
    se_rec = Map.get(board, se) # elem(board, se)
    if fe_rec == nil do
      IO.inspect(board)
      IO.inspect(fe)
      IO.inspect(se)
    end
    ne_rec = fe_rec + se_rec
    up_board = if ne_rec > 9,
              do: Map.put(Map.put(board, count, 1), count + 1, ne_rec - 10),
              else: Map.put(board, count, ne_rec)
    up_count = count + (if ne_rec > 9, do: 2, else: 1)
    up_fe = rem(fe + fe_rec + 1, up_count)
    up_se = rem(se + se_rec + 1, up_count)
    if up_count < iterations + 10 do
      iterate(up_board, up_fe, up_se, up_count, iterations)
    else
      up_board
      |> Enum.filter(fn {k, _} -> iterations <= k and k < iterations + 10 end)
      |> Enum.sort(fn {k1, _}, {k2, _} -> k1 < k2 end)
      |> Enum.reduce("", fn {_, v}, acc -> "#{acc}#{v}" end)
    end
  end
  def find_score(iterations) do
    iterate(%{0 => 3, 1 => 7}, 0, 1, 2, iterations)
  end
end

"5158916779" = D14.find_score(9)
"0124515891" = D14.find_score(5)
"9251071085" = D14.find_score(18)
"5941429882" = D14.find_score(2018)
"6985103122" = D14.find_score(380621)

IO.puts("Only Part 1")
