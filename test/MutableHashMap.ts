import * as Equal from "@effect/data/Equal"
import * as Hash from "@effect/data/Hash"
import * as HM from "@effect/data/MutableHashMap"
import { pipe } from "@fp-ts/core/Function"
import * as O from "@fp-ts/core/Option"
import { inspect } from "node:util"

class Key implements Equal.Equal {
  constructor(readonly a: number, readonly b: number) {}

  [Hash.symbol]() {
    return Hash.hash(`${this.a}-${this.b}`)
  }

  [Equal.symbol](that: unknown): boolean {
    return that instanceof Key && this.a === that.a && this.b === that.b
  }
}

class Value implements Equal.Equal {
  constructor(readonly c: number, readonly d: number) {}

  [Hash.symbol]() {
    return Hash.hash(`${this.c}-${this.d}`)
  }

  [Equal.symbol](that: unknown): boolean {
    return that instanceof Value && this.c === that.c && this.d === that.d
  }
}

function key(a: number, b: number): Key {
  return new Key(a, b)
}

function value(c: number, d: number): Value {
  return new Value(c, d)
}

describe.concurrent("MutableHashMap", () => {
  it("toString", () => {
    const map = HM.make(
      [0, "a"],
      [1, "b"]
    )

    expect(String(map)).toEqual("MutableHashMap([0, a], [1, b])")
  })

  it("toJSON", () => {
    const map = HM.make(
      [0, "a"],
      [1, "b"]
    )

    expect(JSON.stringify(map)).toEqual(
      JSON.stringify({ _tag: "MutableHashMap", values: [[0, "a"], [1, "b"]] })
    )
  })

  it("inspect", () => {
    const map = HM.make(
      [0, "a"],
      [1, "b"]
    )

    expect(inspect(map)).toEqual(inspect({ _tag: "MutableHashMap", values: [[0, "a"], [1, "b"]] }))
  })

  it("from", () => {
    const map = HM.make(
      [key(0, 0), value(0, 0)],
      [key(1, 1), value(1, 1)]
    )

    assert.strictEqual(HM.size(map), 2)
    assert.isTrue(pipe(map, HM.has(key(0, 0))))
    assert.isTrue(pipe(map, HM.has(key(1, 1))))
  })

  it("iterate", () => {
    class Hello {
      [Hash.symbol]() {
        return 0
      }

      [Equal.symbol](that: unknown) {
        return this === that
      }
    }

    const a = new Hello()
    const b = new Hello()

    const map = HM.make(
      [a, 0],
      [b, 0]
    )

    expect(Array.from(map).length).toEqual(2)
  })

  it("get", () => {
    const map = pipe(
      HM.empty<Key, Value>(),
      HM.set(key(0, 0), value(0, 0)),
      HM.set(key(0, 0), value(1, 1))
    )

    const result = pipe(
      map,
      HM.get(key(0, 0))
    )

    expect(
      result
    ).toEqual(O.some(value(1, 1)))
  })

  it("has", () => {
    const map = HM.make(
      [key(0, 0), value(0, 0)],
      [key(0, 0), value(1, 1)],
      [key(1, 1), value(2, 2)],
      [key(1, 1), value(3, 3)],
      [key(0, 0), value(4, 4)]
    )

    pipe(
      map,
      HM.has(key(0, 0)),
      assert.isTrue
    )

    pipe(
      map,
      HM.has(key(1, 1)),
      assert.isTrue
    )

    pipe(
      map,
      HM.has(key(4, 4)),
      assert.isFalse
    )
  })

  it("modifyAt", () => {
    const map = pipe(
      HM.empty<Key, Value>(),
      HM.set(key(0, 0), value(0, 0)),
      HM.set(key(1, 1), value(1, 1))
    )

    pipe(
      map,
      HM.modifyAt(
        key(0, 0),
        () => O.some(value(0, 1))
      )
    )

    assert.strictEqual(HM.size(map), 2)

    expect(pipe(
      map,
      HM.get(key(0, 0))
    )).toEqual(O.some(value(0, 1)))

    pipe(
      map,
      HM.modifyAt(
        key(2, 2),
        O.match(() => O.some(value(2, 2)), O.some)
      )
    )

    assert.strictEqual(HM.size(map), 3)

    expect(pipe(
      map,
      HM.get(key(2, 2))
    )).toEqual(O.some(value(2, 2)))
  })

  it("remove", () => {
    const map = pipe(
      HM.empty<Key, Value>(),
      HM.set(key(0, 0), value(0, 0)),
      HM.set(key(1, 1), value(1, 1))
    )

    assert.strictEqual(HM.size(map), 2)

    pipe(
      map,
      HM.has(key(1, 1)),
      assert.isTrue
    )

    pipe(
      map,
      HM.remove(key(1, 1))
    )

    assert.strictEqual(HM.size(map), 1)

    pipe(
      map,
      HM.has(key(1, 1)),
      assert.isFalse
    )
  })

  it("set", () => {
    const map = pipe(
      HM.empty<Key, Value>(),
      HM.set(key(0, 0), value(0, 0)),
      HM.set(key(0, 0), value(1, 1)),
      HM.set(key(1, 1), value(2, 2)),
      HM.set(key(1, 1), value(3, 3)),
      HM.set(key(0, 0), value(4, 4))
    )

    expect(Array.from(map)).toEqual([
      [key(0, 0), value(4, 4)],
      [key(1, 1), value(3, 3)]
    ])
  })

  it("size", () => {
    const map = pipe(
      HM.empty<Key, Value>(),
      HM.set(key(0, 0), value(0, 0)),
      HM.set(key(0, 0), value(1, 1)),
      HM.set(key(1, 1), value(2, 2)),
      HM.set(key(1, 1), value(3, 3)),
      HM.set(key(0, 0), value(4, 4))
    )

    assert.strictEqual(HM.size(map), 2)
  })

  it("modify", () => {
    const map = pipe(
      HM.empty<Key, Value>(),
      HM.set(key(0, 0), value(0, 0)),
      HM.set(key(1, 1), value(1, 1))
    )

    pipe(
      map,
      HM.modify(key(0, 0), (v) => value(v.c + 1, v.d + 1))
    )

    expect(pipe(
      map,
      HM.get(key(0, 0))
    )).toEqual(O.some(value(1, 1)))

    pipe(
      map,
      HM.modify(key(1, 1), (v) => value(v.c + 1, v.d + 1))
    )

    expect(pipe(
      map,
      HM.remove(key(0, 0)),
      HM.get(key(0, 0))
    )).toEqual(O.none())
  })
})
