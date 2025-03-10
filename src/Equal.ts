/**
 * @since 1.0.0
 */
import * as Hash from "@effect/data/Hash"
import { structural } from "@effect/data/internal/Equal"
import type { Equivalence } from "@fp-ts/core/typeclass/Equivalence"

/**
 * @since 1.0.0
 * @category symbols
 */
export const symbol: unique symbol = Symbol.for("@effect/data/Equal")

/**
 * @since 1.0.0
 * @category models
 */
export interface Equal extends Hash.Hash {
  [symbol](that: Equal): boolean
}

/**
 * @since 1.0.0
 * @category equality
 */
export function equals<B>(that: B): <A>(self: A) => boolean
/**
 * @since 1.0.0
 * @category equality
 */
export function equals<A, B>(self: A, that: B): boolean
export function equals(): any {
  if (arguments.length === 1) {
    return (self: unknown) => compareBoth(self, arguments[0])
  }
  return compareBoth(arguments[0], arguments[1])
}

function compareBoth(self: unknown, that: unknown) {
  if (self === that) {
    return true
  }
  const selfType = typeof self
  if (selfType !== typeof that) {
    return false
  }
  if (
    (selfType === "object" || selfType === "function") &&
    self !== null &&
    that !== null
  ) {
    if (isEqual(self) && isEqual(that)) {
      return Hash.hash(self) === Hash.hash(that) && self[symbol](that)
    }
    if (
      structural in (self as object | Function) &&
      structural in (that as object | Function)
    ) {
      const selfKeys = Object.keys(self as object | Function)
      const thatKeys = Object.keys(that as object | Function)
      if (selfKeys.length !== thatKeys.length) {
        return false
      }
      for (const key of selfKeys) {
        if (
          !(key in (that as object | Function)) ||
          !equals((self as object | Function)[key], (that as object | Function)[key])
        ) {
          return false
        }
      }
      return true
    }
  }
  return false
}

/**
 * @since 1.0.0
 * @category guards
 */
export const isEqual = (u: unknown): u is Equal => typeof u === "object" && u !== null && symbol in u

/**
 * @since 1.0.0
 * @category instances
 */
export const equivalence: <A>() => Equivalence<A> = () =>
  (self, that) => Hash.hash(self) === Hash.hash(that) && equals(self, that)
