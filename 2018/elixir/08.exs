get_nodes = fn path ->
  with {:ok, file} = File.open(path),
    content = IO.read(file, :all),
    :ok = File.close(file) do
      content
      |> String.split(" ")
      |> Enum.map(&String.to_integer/1)
  end
end

defmodule D08 do
  def traverse_nodes([0, mc | rest]) do
    with s = rest |> Enum.take(mc) |> Enum.sum() do
      [Enum.drop(rest, mc), s, s]
    end
  end
  def traverse_nodes([cc, mc | rest]) do
    with [rest, sum_cm, child_vns] = 1..cc |> Enum.reduce([rest, 0, []], fn _, [r, sum_cm, child_vns] ->
        [r, cm, vn] = traverse_nodes(r)
        [r, sum_cm + cm, child_vns ++ [vn]]
      end),
      meta = Enum.take(rest, mc)
    do
      [
        Enum.drop(rest, mc),
        sum_cm + Enum.sum(meta),
        Enum.reduce(meta, 0, fn m, vn ->
          vn + if m > cc, do: 0, else: Enum.at(child_vns, m - 1)
        end)
      ]
    end
  end
end

[[], 138, 66] = D08.traverse_nodes(get_nodes.("../inputs/08-test.txt"))
[[], 36307, 25154] = D08.traverse_nodes(get_nodes.("../inputs/08.txt"))

IO.puts("Done")
