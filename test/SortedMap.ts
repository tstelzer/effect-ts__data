import * as Eq from "@effect/data/Equal"
import * as Hash from "@effect/data/Hash"
import * as SM from "@effect/data/SortedMap"
import { pipe } from "@fp-ts/core/Function"
import * as N from "@fp-ts/core/Number"
import * as O from "@fp-ts/core/Option"
import { inspect } from "node:util"

class Key implements Eq.Equal {
  constructor(readonly id: number) {}

  [Hash.symbol](): number {
    return Hash.hash(this.id)
  }

  [Eq.symbol](u: unknown): boolean {
    return u instanceof Key && this.id === u.id
  }
}

class Value implements Eq.Equal {
  constructor(readonly id: number) {}

  [Hash.symbol](): number {
    return Hash.hash(this.id)
  }

  [Eq.symbol](u: unknown): boolean {
    return u instanceof Value && this.id === u.id
  }
}

function key(n: number): Key {
  return new Key(n)
}

function value(n: number): Value {
  return new Value(n)
}

function makeSortedMap(...numbers: Array<readonly [number, number]>): SM.SortedMap<Key, Value> {
  const entries = numbers.map(([k, v]) => [key(k), value(v)] as const)
  return SM.fromIterable({
    compare: (self: Key, that: Key) => self.id > that.id ? 1 : self.id < that.id ? -1 : 0
  })(entries)
}

function makeNumericSortedMap(
  ...numbers: Array<readonly [number, number]>
): SM.SortedMap<number, number> {
  return SM.fromIterable({
    compare: (self: number, that: number) => self > that ? 1 : self < that ? -1 : 0
  })(numbers)
}

describe.concurrent("SortedMap", () => {
  test("toString", () => {
    const map = makeNumericSortedMap([0, 10], [1, 20], [2, 30])

    expect(String(map)).toEqual("SortedMap([0, 10], [1, 20], [2, 30])")
  })

  test("toJSON", () => {
    const map = makeNumericSortedMap([0, 10], [1, 20], [2, 30])

    expect(JSON.stringify(map)).toEqual(
      JSON.stringify({ _tag: "SortedMap", values: [[0, 10], [1, 20], [2, 30]] })
    )
  })

  test("inspect", () => {
    const map = makeNumericSortedMap([0, 10], [1, 20], [2, 30])

    expect(inspect(map)).toEqual(
      inspect({ _tag: "SortedMap", values: [[0, 10], [1, 20], [2, 30]] })
    )
  })

  test("entries", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    const result = Array.from(map)

    expect([
      [key(0), value(10)],
      [key(1), value(20)],
      [key(2), value(30)]
    ]).toEqual(result)
  })

  it("get", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    assert.deepEqual(pipe(map, SM.get(key(0))), O.some(value(10)))
    assert.deepEqual(pipe(map, SM.get(key(4))), O.none())
  })

  it("has", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    assert.isTrue(pipe(map, SM.has(key(0))))
    assert.isFalse(pipe(map, SM.has(key(4))))
  })

  it("headOption", () => {
    const map1 = makeSortedMap([0, 10], [1, 20], [2, 30])
    const map2 = SM.empty<number, number>(N.Order)

    assert.deepEqual(SM.headOption(map1), O.some([key(0), value(10)] as const))
    assert.deepEqual(SM.headOption(map2), O.none())
  })

  it("isEmpty", () => {
    const map1 = makeSortedMap([0, 10], [1, 20], [2, 30])
    const map2 = SM.empty<number, number>(N.Order)

    assert.isFalse(SM.isEmpty(map1))
    assert.isTrue(SM.isEmpty(map2))
  })

  it("isNonEmpty", () => {
    const map1 = makeSortedMap([0, 10], [1, 20], [2, 30])
    const map2 = SM.empty<number, number>(N.Order)

    assert.isTrue(SM.isNonEmpty(map1))
    assert.isFalse(SM.isNonEmpty(map2))
  })

  it("keys", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    const result = Array.from(SM.keys(map))

    assert.deepEqual(result, [key(0), key(1), key(2)])
  })

  it("map", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    const result = Array.from(pipe(map, SM.map((value) => value.id)))

    assert.deepEqual(
      result,
      [
        [key(0), 10],
        [key(1), 20],
        [key(2), 30]
      ]
    )
  })

  it("mapWithIndex", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    const result = Array.from(pipe(map, SM.mapWithIndex((key, value) => key.id + value.id)))

    assert.deepEqual(
      result,
      [
        [key(0), 10],
        [key(1), 21],
        [key(2), 32]
      ]
    )
  })

  it("reduce", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    const result = pipe(map, SM.reduce("", (acc, value) => acc + value.id))

    assert.strictEqual(result, "102030")
  })

  it("reduceWithIndex", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    const result = pipe(map, SM.reduceWithIndex("", (acc, value, key) => acc + key.id + value.id))

    assert.strictEqual(result, "010120230")
  })

  it("remove", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    assert.isTrue(pipe(map, SM.has(key(0))))

    const result1 = pipe(map, SM.remove(key(0)))

    assert.isFalse(pipe(result1, SM.has(key(0))))
  })

  it("set", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    assert.isFalse(pipe(map, SM.has(key(4))))

    const result1 = pipe(map, SM.set(key(4), value(40)))

    assert.isTrue(pipe(result1, SM.has(key(4))))
  })

  it("size", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    assert.strictEqual(SM.size(map), 3)
  })

  it("values", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    const result = Array.from(SM.values(map))

    assert.deepEqual(result, [value(10), value(20), value(30)])
  })
})
