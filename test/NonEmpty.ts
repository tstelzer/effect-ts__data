import * as Chunk from "@effect/data/Chunk"
import * as NonEmpty from "@effect/data/NonEmpty"

describe("NonEmpty", () => {
  it("should get head and rest", () => {
    const [head, rest] = NonEmpty.unprepend(Chunk.make(0, 1, 2))
    const restArray: Array<number> = []
    let next = rest.next()
    while (!next.done) {
      restArray.push(next.value)
      next = rest.next()
    }
    expect(head).toEqual(0)
    expect(restArray).toEqual([1, 2])
  })
  it("should throw", () => {
    expect(() => NonEmpty.unprepend(Chunk.empty as any)).toThrow()
  })
})
