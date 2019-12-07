import { readFileSync } from 'fs';

export interface Dictionary<T> {
  [key: string]: T;
}

export function getInput(day: string) {
  return readFileSync(`../inputs/${day}.txt`, 'utf8').replace(/\r/g, '');
}

export function seenBefore<T, TKey = T>(
  seed: TKey[],
  keyMaker: (i: T) => TKey = _ => (_ as unknown) as TKey
) {
  const seen = new Set<TKey>(seed);
  return (n: T) => {
    const key = keyMaker(n);
    if (seen.has(key)) {
      return true;
    } else {
      seen.add(key);
      return false;
    }
  };
}

export function getValue<T>(
  dictionary: Dictionary<T>,
  key: string,
  defaultValue: T
): T {
  if (dictionary[key] === undefined) {
    dictionary[key] = defaultValue;
  }
  return dictionary[key];
}

export function generate<T>(
  fromX: number,
  toX: number,
  fromY: number,
  toY: number,
  action: (x: number, y: number) => T
) {
  const result: T[] = [];
  for (let x = fromX; x <= toX; x++) {
    for (let y = fromY; y <= toY; y++) {
      result.push(action(x, y));
    }
  }
  return result;
}

export interface Node<T> {
  value: T;
  prev: Node<T>;
  next: Node<T>;
}
export class LinkedList<T> {
  private length = 0;

  public get count() {
    return this.length;
  }

  public init(value: T): Node<T> {
    const node: any = {
      value
    };
    node.prev = node;
    node.next = node;
    this.length = 1;
    return node as Node<T>;
  }

  public remove(node: Node<T>) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    (node as any).prev = null;
    (node as any).next = null;
    this.length--;
  }

  public insertAfter(node: any, value: T) {
    const currentNext = node.next;
    const newNode = {
      value,
      prev: node,
      next: currentNext
    };
    node.next = newNode;
    currentNext.prev = newNode;
    this.length++;
    return newNode;
  }
}

export function sumIt(source: Iterable<number>) {
  let result = 0;
  for (const item of source) {
    result = result + item;
  }
  return result;
}

export function* combinations(from: number, to: number) {
  function* settings(ignore: number[] = []) {
    for (let i = from; i <= to; i++) {
      if (ignore.findIndex(ti => ti === i) === -1) {
        yield i;
      }
    }
  }
  for (const a of settings()) {
    for (const b of settings([a])) {
      for (const c of settings([a, b])) {
        for (const d of settings([a, b, c])) {
          for (const e of settings([a, b, c, d])) {
            yield [a, b, c, d, e];
          }
        }
      }
    }
  }
}
