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
  def get_ready_nodes(n, graph, dep) do
    with up_dep = Enum.reduce(graph[n], dep, fn c, up_dep -> Map.update(up_dep, c, 0, &(&1 - 1)) end),
         child_nodes = Enum.filter(graph[n], (&(up_dep[&1] === 0))) do
        [up_dep, child_nodes]
    end
  end

  def traverse_nodes([], _, _, order) do
    order
  end

  def traverse_nodes([n | rest], graph, dep, order) do
    if graph[n] == nil do
      traverse_nodes(rest, graph, dep, order <> n)
    else
      with [up_dep, child_nodes] = get_ready_nodes(n, graph, dep) do
          traverse_nodes(Enum.sort(rest ++ child_nodes), graph, up_dep, order <> n)
      end
    end
  end

  def fetch_next_nodes(workers, graph, dep) do
    completed = workers |> Enum.filter(fn [_, c] -> c == 0 end) |> Enum.map(fn [n, _] -> n end)
    if Enum.count(completed) == 0 do
      [[], dep]
    else
      completed
      |> Enum.reduce([[], dep], fn n, [nodes, up_dep] ->
        if graph[n] == nil do
          [nodes, up_dep]
        else
          with [up_dep, child_nodes] = get_ready_nodes(n, graph, up_dep) do
            [child_nodes ++ nodes, up_dep]
          end
        end
      end)
    end
  end

  def create_workers(nodes, count, base) do
    nodes
    |> Enum.take(count)
    |> Enum.map(fn n -> [n, base + :binary.first(n) - ?A + 1] end)
  end
  def process_steps([], [], _, _, step_count, _, _) do
    step_count
  end
  def process_steps(nodes, workers, graph, dep, step_count, worker_count, base) do
    with free_wc = worker_count - Enum.count(workers),
          # create workers
          updated_workers = (if free_wc > 0, do: (workers ++ create_workers(nodes, free_wc, base)), else: workers),
          # debug
          # line_status = Enum.reduce(updated_workers, "", fn [n, _], acc -> "#{acc}#{n}\t" end),
          # reduce count
          updated_workers = Enum.map(updated_workers, fn [n, c] -> [n, c - 1] end),
          # for completed tasks get next nodes
          [next_nodes, updated_dep] = fetch_next_nodes(updated_workers, graph, dep),
          # mix them with remaining nodes waiting for workers and sort
          next_nodes = Enum.sort(Enum.drop(nodes, free_wc) ++ next_nodes),
          # drop completed workers
          updated_workers = Enum.filter(updated_workers, fn [_, c] -> c > 0 end) do
            # IO.puts("#{step_count}\t#{line_status}")
            process_steps(next_nodes, updated_workers, graph, updated_dep, step_count + 1, worker_count, base)
          end
  end
end

determine_order = fn [graph, dep] -> NP.traverse_nodes(find_root_nodes.([graph, dep]), graph, dep, "") end
count_steps = fn [graph, dep], worker_count, base -> NP.process_steps(find_root_nodes.([graph, dep]), [], graph, dep, 0, worker_count, base) end

test_requirements = parse.("../inputs/07-test.txt")
puzzle_requirements = parse.("../inputs/07.txt")

"CABDFE" = determine_order.(test_requirements)
"BDHNEGOLQASVWYPXUMZJIKRTFC" = determine_order.(puzzle_requirements)
15 = count_steps.(test_requirements, 2, 0)
1107 = count_steps.(puzzle_requirements, 5, 60)

IO.puts("Done")
