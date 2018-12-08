get_content = fn path ->
  with {:ok, file} = File.open(path),
    content = IO.read(file, :all),
    :ok = File.close(file) do
      content
  end
end

build_graph = fn [_, p, c], [graph, dep] ->
  [
    Map.update(graph, p, [c], &([c | &1])),
    Map.update(dep, c, 1, &(&1 + 1))
  ]
end

find_root_nodes = fn [graph, dep] ->
  graph
  |> Map.keys()
  |> Enum.reject(&(Map.has_key?(dep, &1)))
end

parse = fn ip ->
  ip
  |> get_content.()
  |> (&Regex.scan(~r/Step (\w) must be finished before step (\w) can begin./, &1)).()
  |> Enum.reduce([%{}, %{}], build_graph)
end

defmodule NP do
  def traverse_nodes([], _, _, order) do
    order
  end
  def traverse_nodes([n | rest], graph, dep, order) do
    if graph[n] == nil do
      traverse_nodes(rest, graph, dep, order <> n)
    else
      with up_dep = Enum.reduce(graph[n], dep, fn c, up_dep -> Map.update(up_dep, c, 0, &(&1 - 1)) end),
         child_nodes = Enum.filter(graph[n], (&(up_dep[&1] === 0))) do
          traverse_nodes(Enum.sort(rest ++ child_nodes), graph, up_dep, order <> n)
      end
    end
  end
end

determine_order = fn [graph, dep] -> NP.traverse_nodes(find_root_nodes.([graph, dep]), graph, dep, "") end

test_requirements = parse.("../inputs/07-test.txt")
puzzle_requirements = parse.("../inputs/07.txt")

"CABDFE" = determine_order.(test_requirements)
"BDHNEGOLQASVWYPXUMZJIKRTFC" = determine_order.(puzzle_requirements)

IO.puts("Done")
