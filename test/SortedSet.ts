import * as Eq from "@effect/data/Equal"
import * as Hash from "@effect/data/Hash"
import * as SortedSet from "@effect/data/SortedSet"
import { pipe } from "@fp-ts/core/Function"
import * as Str from "@fp-ts/core/String"
import * as Order from "@fp-ts/core/typeclass/Order"
import { inspect } from "node:util"

class Member implements Eq.Equal {
  constructor(readonly id: string) {}

  [Hash.symbol](): number {
    return Hash.hash(this.id)
  }

  [Eq.symbol](u: unknown): boolean {
    return u instanceof Member && this.id === u.id
  }
}

const OrdMember: Order.Order<Member> = pipe(Str.Order, Order.contramap((member) => member.id))

function makeNumericSortedSet(
  ...numbers: Array<number>
): SortedSet.SortedSet<number> {
  return SortedSet.fromIterable({
    compare: (self, that: number) => self > that ? 1 : self < that ? -1 : 0
  })(numbers)
}

describe.concurrent("SortedSet", () => {
  it("toString", () => {
    const set = makeNumericSortedSet(0, 1, 2)
    expect(String(set)).toEqual("SortedSet(0, 1, 2)")
  })

  it("toJSON", () => {
    const set = makeNumericSortedSet(0, 1, 2)
    expect(JSON.stringify(set)).toEqual(JSON.stringify({ _tag: "SortedSet", values: [0, 1, 2] }))
  })

  it("inspect", () => {
    const set = makeNumericSortedSet(0, 1, 2)
    expect(inspect(set)).toEqual(inspect({ _tag: "SortedSet", values: [0, 1, 2] }))
  })

  it("add", () => {
    const set = pipe(
      SortedSet.empty(OrdMember),
      SortedSet.add(new Member("worker_000000")),
      SortedSet.add(new Member("worker_000001")),
      SortedSet.add(new Member("worker_000001")),
      SortedSet.add(new Member("worker_000002")),
      SortedSet.add(new Member("worker_000001"))
    )

    assert.deepEqual(
      Array.from(set),
      [
        new Member("worker_000000"),
        new Member("worker_000001"),
        new Member("worker_000002")
      ]
    )
  })

  it("difference", () => {
    const set1 = pipe(
      SortedSet.empty(OrdMember),
      SortedSet.add(new Member("worker_000000")),
      SortedSet.add(new Member("worker_000001")),
      SortedSet.add(new Member("worker_000002"))
    )

    const set2 = [
      new Member("worker_000001"),
      new Member("worker_000002"),
      new Member("worker_000003")
    ]

    const set3 = [
      new Member("worker_000000"),
      new Member("worker_000001"),
      new Member("worker_000002")
    ]

    assert.deepEqual(
      Array.from(pipe(
        set1,
        SortedSet.difference(set2)
      )),
      [new Member("worker_000000")]
    )
    assert.deepEqual(
      Array.from(pipe(set1, SortedSet.difference(set3))),
      []
    )
  })

  it("every", () => {
    const isWorker = (member: Member) => member.id.indexOf("worker") !== -1
    const isWorker1 = (member: Member) => member.id === "worker_000001"
    const set = pipe(
      SortedSet.empty(OrdMember),
      SortedSet.add(new Member("worker_000000")),
      SortedSet.add(new Member("worker_000001")),
      SortedSet.add(new Member("worker_000002"))
    )

    const result1 = pipe(set, SortedSet.every(isWorker))
    const result2 = pipe(set, SortedSet.every(isWorker1))

    assert.isTrue(result1)
    assert.isFalse(result2)
  })

  it("some", () => {
    const isWorker1 = (member: Member) => member.id === "worker_000001"
    const isWorker4 = (member: Member) => member.id === "worker_000004"
    const set = pipe(
      SortedSet.empty(OrdMember),
      SortedSet.add(new Member("worker_000000")),
      SortedSet.add(new Member("worker_000001")),
      SortedSet.add(new Member("worker_000002"))
    )

    const result1 = pipe(set, SortedSet.some(isWorker1))
    const result2 = pipe(set, SortedSet.some(isWorker4))

    assert.isTrue(result1)
    assert.isFalse(result2)
  })

  it("filter", () => {
    const isWorker1 = (member: Member) => member.id === "worker_000001"
    const set = pipe(
      SortedSet.empty(OrdMember),
      SortedSet.add(new Member("worker_000000")),
      SortedSet.add(new Member("worker_000001")),
      SortedSet.add(new Member("worker_000002"))
    )

    const result = pipe(set, SortedSet.filter(isWorker1))

    assert.deepEqual(Array.from(result), [new Member("worker_000001")])
  })

  it("flatMap", () => {
    const set1 = pipe(
      SortedSet.empty(OrdMember),
      SortedSet.add(new Member("worker_000000")),
      SortedSet.add(new Member("worker_000001")),
      SortedSet.add(new Member("worker_000002"))
    )

    const set2 = [
      new Member("worker_000001"),
      new Member("worker_000002"),
      new Member("worker_000003")
    ]

    const result = pipe(set1, SortedSet.flatMap(OrdMember, (a) => [...set2, a]))

    assert.deepEqual(
      Array.from(result),
      [
        new Member("worker_000000"),
        new Member("worker_000001"),
        new Member("worker_000002"),
        new Member("worker_000003")
      ]
    )
  })

  it("forEach", () => {
    const set1 = pipe(
      SortedSet.empty(OrdMember),
      SortedSet.add(new Member("worker_000000")),
      SortedSet.add(new Member("worker_000001")),
      SortedSet.add(new Member("worker_000002"))
    )

    const result: Array<string> = []

    pipe(
      set1,
      SortedSet.forEach((member) => {
        result.push(member.id)
      })
    )

    assert.deepEqual(result, ["worker_000000", "worker_000001", "worker_000002"])
  })

  it("has", () => {
    const set = pipe(
      SortedSet.empty(OrdMember),
      SortedSet.add(new Member("worker_000000")),
      SortedSet.add(new Member("worker_000001")),
      SortedSet.add(new Member("worker_000002"))
    )

    assert.isTrue(pipe(set, SortedSet.has(new Member("worker_000000"))))
    assert.isFalse(pipe(set, SortedSet.has(new Member("worker_000004"))))
  })

  it("intersection", () => {
    const set1 = pipe(
      SortedSet.empty(OrdMember),
      SortedSet.add(new Member("worker_000000")),
      SortedSet.add(new Member("worker_000001")),
      SortedSet.add(new Member("worker_000002"))
    )

    const set2 = [
      new Member("worker_000001"),
      new Member("worker_000002"),
      new Member("worker_000003")
    ]

    const set3 = [
      new Member("worker_000005")
    ]

    const result1 = pipe(set1, SortedSet.intersection(set2))
    const result2 = pipe(set1, SortedSet.intersection(set3))

    assert.deepEqual(
      Array.from(result1),
      [
        new Member("worker_000001"),
        new Member("worker_000002")
      ]
    )
    assert.deepEqual(Array.from(result2), [])
  })

  it("isSubset", () => {
    const set1 = pipe(
      SortedSet.empty(OrdMember),
      SortedSet.add(new Member("worker_000000")),
      SortedSet.add(new Member("worker_000001")),
      SortedSet.add(new Member("worker_000002"))
    )

    const set2 = pipe(
      SortedSet.empty(OrdMember),
      SortedSet.add(new Member("worker_000001")),
      SortedSet.add(new Member("worker_000002"))
    )

    const set3 = pipe(
      SortedSet.empty(OrdMember),
      SortedSet.add(new Member("worker_000005"))
    )

    assert.isTrue(pipe(set2, SortedSet.isSubset(set1)))
    assert.isFalse(pipe(set3, SortedSet.isSubset(set1)))
  })

  it("map", () => {
    const set = pipe(
      SortedSet.empty(OrdMember),
      SortedSet.add(new Member("worker_000000")),
      SortedSet.add(new Member("worker_000001")),
      SortedSet.add(new Member("worker_000002"))
    )

    const result = pipe(
      set,
      SortedSet.map(Str.Order, (member) => member.id.replace(/_\d+/g, ""))
    )

    assert.deepEqual(Array.from(result), ["worker"])
  })

  it("partition", () => {
    const set = pipe(
      SortedSet.empty(OrdMember),
      SortedSet.add(new Member("worker_000000")),
      SortedSet.add(new Member("worker_000001")),
      SortedSet.add(new Member("worker_000002")),
      SortedSet.add(new Member("worker_000003"))
    )

    const result = pipe(
      set,
      SortedSet.partition((member) => member.id.endsWith("1") || member.id.endsWith("3"))
    )

    assert.deepEqual(
      Array.from(result[0]),
      [
        new Member("worker_000000"),
        new Member("worker_000002")
      ]
    )
    assert.deepEqual(
      Array.from(result[1]),
      [
        new Member("worker_000001"),
        new Member("worker_000003")
      ]
    )
  })

  it("remove", () => {
    const set = pipe(
      SortedSet.empty(OrdMember),
      SortedSet.add(new Member("worker_000000")),
      SortedSet.add(new Member("worker_000001")),
      SortedSet.add(new Member("worker_000002"))
    )

    const result = pipe(set, SortedSet.remove(new Member("worker_000000")))

    assert.deepEqual(
      Array.from(result),
      [
        new Member("worker_000001"),
        new Member("worker_000002")
      ]
    )
  })

  it("size", () => {
    const set = pipe(
      SortedSet.empty(OrdMember),
      SortedSet.add(new Member("worker_000000")),
      SortedSet.add(new Member("worker_000001")),
      SortedSet.add(new Member("worker_000002"))
    )

    assert.strictEqual(SortedSet.size(set), 3)
  })

  it("toggle", () => {
    const member = new Member("worker_000000")
    let set = pipe(
      SortedSet.empty(OrdMember),
      SortedSet.add(new Member("worker_000000")),
      SortedSet.add(new Member("worker_000001")),
      SortedSet.add(new Member("worker_000002"))
    )

    assert.isTrue(pipe(set, SortedSet.has(member)))

    set = pipe(set, SortedSet.toggle(member))

    assert.isFalse(pipe(set, SortedSet.has(member)))

    set = pipe(set, SortedSet.toggle(member))

    assert.isTrue(pipe(set, SortedSet.has(member)))
  })

  it("union", () => {
    const set1 = pipe(
      SortedSet.empty(OrdMember),
      SortedSet.add(new Member("worker_000000")),
      SortedSet.add(new Member("worker_000001")),
      SortedSet.add(new Member("worker_000002"))
    )

    const set2 = pipe(
      SortedSet.empty(OrdMember),
      SortedSet.add(new Member("worker_000001")),
      SortedSet.add(new Member("worker_000002")),
      SortedSet.add(new Member("worker_000003"))
    )

    const set3: Array<Member> = []

    const result1 = pipe(set1, SortedSet.union(set2))
    const result2 = pipe(set1, SortedSet.union(set3))

    assert.deepEqual(
      Array.from(result1),
      [
        new Member("worker_000000"),
        new Member("worker_000001"),
        new Member("worker_000002"),
        new Member("worker_000003")
      ]
    )
    expect(result2).toEqual(set1)
  })
})
