import * as Equal from "@effect/data/Equal"
import * as Hash from "@effect/data/Hash"
import * as RedBlackTree from "@effect/data/RedBlackTree"
import { deepStrictEqual } from "@effect/data/test/util"
import { pipe } from "@fp-ts/core/Function"
import * as number from "@fp-ts/core/Number"
import * as Option from "@fp-ts/core/Option"
import * as Order from "@fp-ts/core/typeclass/Order"
import { inspect } from "node:util"

describe.concurrent("RedBlackTree", () => {
  it("toString", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b")
    )

    expect(String(tree)).toEqual("RedBlackTree([0, b], [1, a])")
  })

  it("toJSON", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b")
    )

    expect(JSON.stringify(tree)).toEqual(
      JSON.stringify({ _tag: "RedBlackTree", values: [[0, "b"], [1, "a"]] })
    )
  })

  it("inspect", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b")
    )

    expect(inspect(tree)).toEqual(inspect({ _tag: "RedBlackTree", values: [[0, "b"], [1, "a"]] }))
  })

  it("forEach", () => {
    const ordered: Array<[number, string]> = []
    pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e"),
      RedBlackTree.forEach((n, s) => {
        ordered.push([n, s])
      })
    )

    deepStrictEqual(ordered, [
      [-2, "d"],
      [-1, "c"],
      [0, "b"],
      [1, "a"],
      [3, "e"]
    ])
  })

  it("iterable", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e")
    )

    assert.strictEqual(RedBlackTree.size(tree), 5)
    deepStrictEqual(Array.from(tree), [
      [-2, "d"],
      [-1, "c"],
      [0, "b"],
      [1, "a"],
      [3, "e"]
    ])
  })

  it("iterable empty", () => {
    const tree = RedBlackTree.empty<number, string>(number.Order)

    assert.strictEqual(RedBlackTree.size(tree), 0)
    deepStrictEqual(Array.from(tree), [])
  })

  it("backwards", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e")
    )

    assert.strictEqual(RedBlackTree.size(tree), 5)
    deepStrictEqual(Array.from(RedBlackTree.reversed(tree)), [
      [3, "e"],
      [1, "a"],
      [0, "b"],
      [-1, "c"],
      [-2, "d"]
    ])
  })

  it("backwards empty", () => {
    const tree = RedBlackTree.empty<number, string>(number.Order)

    assert.strictEqual(RedBlackTree.size(tree), 0)
    deepStrictEqual(Array.from(RedBlackTree.reversed(tree)), [])
  })

  it("values", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e")
    )

    assert.strictEqual(RedBlackTree.size(tree), 5)
    deepStrictEqual(Array.from(RedBlackTree.values(tree)), ["d", "c", "b", "a", "e"])
  })

  it("keys", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e")
    )

    assert.strictEqual(RedBlackTree.size(tree), 5)
    deepStrictEqual(Array.from(RedBlackTree.keys(tree)), [-2, -1, 0, 1, 3])
  })

  it("begin/end", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e")
    )

    deepStrictEqual(RedBlackTree.first(tree), Option.some([-2, "d"] as const))
    deepStrictEqual(RedBlackTree.last(tree), Option.some([3, "e"] as const))
    deepStrictEqual(RedBlackTree.getAt(1)(tree), Option.some([-1, "c"] as const))
  })

  it("forEachGreaterThanEqual", () => {
    const ordered: Array<[number, string]> = []
    pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e"),
      RedBlackTree.forEachGreaterThanEqual(0, (k, v) => {
        ordered.push([k, v])
      })
    )

    deepStrictEqual(ordered, [[0, "b"], [1, "a"], [3, "e"]])
  })

  it("forEachLessThan", () => {
    const ordered: Array<[number, string]> = []
    pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e"),
      RedBlackTree.forEachLessThan(0, (k, v) => {
        ordered.push([k, v])
      })
    )

    deepStrictEqual(ordered, [[-2, "d"], [-1, "c"]])
  })

  it("forEachBetween", () => {
    const ordered: Array<[number, string]> = []
    pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e"),
      RedBlackTree.forEachBetween(-1, 2, (k, v) => {
        ordered.push([k, v])
      })
    )

    deepStrictEqual(ordered, [[-1, "c"], [0, "b"], [1, "a"]])
  })

  it("greaterThan", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e")
    )

    deepStrictEqual(Array.from(RedBlackTree.greaterThan(0)(tree)), [
      [1, "a"],
      [3, "e"]
    ])
    deepStrictEqual(
      Array.from(RedBlackTree.greaterThanReversed(0)(tree)),
      [
        [1, "a"],
        [0, "b"],
        [-1, "c"],
        [-2, "d"]
      ]
    )
  })

  it("greaterThanEqual", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e")
    )

    deepStrictEqual(Array.from(RedBlackTree.greaterThanEqual(0)(tree)), [
      [0, "b"],
      [1, "a"],
      [3, "e"]
    ])
    deepStrictEqual(
      Array.from(RedBlackTree.greaterThanEqualReversed(0)(tree)),
      [
        [0, "b"],
        [-1, "c"],
        [-2, "d"]
      ]
    )
  })

  it("lessThan", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e")
    )

    deepStrictEqual(Array.from(RedBlackTree.lessThan(0)(tree)), [
      [-1, "c"],
      [0, "b"],
      [1, "a"],
      [3, "e"]
    ])
    deepStrictEqual(
      Array.from(RedBlackTree.lessThanReversed(0)(tree)),
      [
        [-1, "c"],
        [-2, "d"]
      ]
    )
  })

  it("lessThanEqual", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e")
    )

    deepStrictEqual(Array.from(RedBlackTree.lessThanEqual(0)(tree)), [
      [0, "b"],
      [1, "a"],
      [3, "e"]
    ])
    deepStrictEqual(
      Array.from(RedBlackTree.lessThanEqualReversed(0)(tree)),
      [
        [0, "b"],
        [-1, "c"],
        [-2, "d"]
      ]
    )
  })

  it("find", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(2, "c"),
      RedBlackTree.insert(1, "b"),
      RedBlackTree.insert(3, "d"),
      RedBlackTree.insert(1, "e")
    )

    deepStrictEqual(Array.from(RedBlackTree.find(1)(tree)), ["e", "b", "a"])
  })

  it("find Eq/Ord", () => {
    class Key {
      constructor(readonly n: number, readonly s: string) {}

      [Hash.symbol](): number {
        return Hash.combine(Hash.hash(this.n))(Hash.hash(this.s))
      }

      [Equal.symbol](that: unknown): boolean {
        return that instanceof Key && this.n === that.n && this.s === that.s
      }
    }

    const ord = pipe(number.Order, Order.contramap((key: Key) => key.n))

    const tree = pipe(
      RedBlackTree.empty<Key, string>(ord),
      RedBlackTree.insert(new Key(1, "0"), "a"),
      RedBlackTree.insert(new Key(2, "0"), "c"),
      RedBlackTree.insert(new Key(1, "1"), "b"),
      RedBlackTree.insert(new Key(3, "0"), "d"),
      RedBlackTree.insert(new Key(1, "0"), "e"),
      RedBlackTree.insert(new Key(1, "0"), "f"),
      RedBlackTree.insert(new Key(1, "1"), "g")
    )

    deepStrictEqual(Array.from(RedBlackTree.values(tree)), ["g", "f", "e", "b", "a", "c", "d"])
    deepStrictEqual(Array.from(RedBlackTree.find(new Key(1, "0"))(tree)), ["f", "e", "a"])
    deepStrictEqual(
      Array.from(RedBlackTree.values(RedBlackTree.removeFirst(new Key(1, "1"))(tree))),
      [
        "f",
        "e",
        "b",
        "a",
        "c",
        "d"
      ]
    )
    deepStrictEqual(
      Array.from(RedBlackTree.values(RedBlackTree.removeFirst(new Key(1, "0"))(tree))),
      [
        "g",
        "f",
        "e",
        "b",
        "c",
        "d"
      ]
    )
  })
})
