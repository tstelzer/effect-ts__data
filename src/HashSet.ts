/**
 * @since 1.0.0
 */

import type { Equal } from "@effect/data/Equal"
import * as HS from "@effect/data/internal/HashSet"
import type { Predicate, Refinement } from "@fp-ts/core/Predicate"

const TypeId: unique symbol = HS.HashSetTypeId as TypeId

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 1.0.0
 * @category models
 */
export interface HashSet<A> extends Iterable<A>, Equal {
  readonly _id: TypeId
}

/**
 * @since 1.0.0
 * @category refinements
 */
export const isHashSet: {
  <A>(u: Iterable<A>): u is HashSet<A>
  (u: unknown): u is HashSet<unknown>
} = HS.isHashSet

/**
 * Creates an empty `HashSet`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const empty: <A = never>() => HashSet<A> = HS.empty

/**
 * Construct a new `HashSet` from a `Collection` of values
 *
 * @since 1.0.0
 * @category constructors
 */
export const fromIterable: <A>(elements: Iterable<A>) => HashSet<A> = HS.fromIterable

/**
 * Construct a new `HashSet` from a variable number of values.
 *
 * @since 1.0.0
 * @category constructors
 */
export const make: <As extends ReadonlyArray<any>>(...elements: As) => HashSet<As[number]> = HS.make

/**
 * Checks if the specified value exists in the `HashSet`.
 *
 * @since 1.0.0
 * @category elements
 */
export const has: {
  <A>(value: A): (self: HashSet<A>) => boolean
  <A>(self: HashSet<A>, value: A): boolean
} = HS.has

/**
 * Returns `true` if any value in the `HashSet` matches the specified predicate.
 *
 * @since 1.0.0
 * @category elements
 */
export const some: {
  <A>(f: Predicate<A>): (self: HashSet<A>) => boolean
  <A>(self: HashSet<A>, f: Predicate<A>): boolean
} = HS.some

/**
 * Returns `true` only if all values in the `HashSet` match the specified
 * predicate.
 *
 * @since 1.0.0
 * @category elements
 */
export const every: {
  <A>(f: Predicate<A>): (self: HashSet<A>) => boolean
  <A>(self: HashSet<A>, f: Predicate<A>): boolean
} = HS.every

/**
 * Returns `true` if and only if every element in the this `HashSet` is an
 * element of the second set,
 *
 * **NOTE**: the hash and equal of both sets must be the same.
 *
 * @since 1.0.0
 * @category elements
 */
export const isSubset: {
  <A>(that: HashSet<A>): (self: HashSet<A>) => boolean
  <A>(self: HashSet<A>, that: HashSet<A>): boolean
} = HS.isSubset

/**
 * Returns an `IterableIterator` of the values in the `HashSet`.
 *
 * @since 1.0.0
 * @category getters
 */
export const values: <A>(self: HashSet<A>) => IterableIterator<A> = HS.values

/**
 * Calculates the number of values in the `HashSet`.
 *
 * @since 1.0.0
 * @category getters
 */
export const size: <A>(self: HashSet<A>) => number = HS.size

/**
 * Marks the `HashSet` as mutable.
 *
 * @since 1.0.0
 * @category mutations
 */
export const beginMutation: <A>(self: HashSet<A>) => HashSet<A> = HS.beginMutation

/**
 * Marks the `HashSet` as immutable.
 *
 * @since 1.0.0
 * @category mutations
 */
export const endMutation: <A>(self: HashSet<A>) => HashSet<A> = HS.endMutation

/**
 * Mutates the `HashSet` within the context of the provided function.
 *
 * @since 1.0.0
 * @category mutations
 */
export const mutate: {
  <A>(f: (set: HashSet<A>) => void): (self: HashSet<A>) => HashSet<A>
  <A>(self: HashSet<A>, f: (set: HashSet<A>) => void): HashSet<A>
} = HS.mutate

/**
 * Adds a value to the `HashSet`.
 *
 * @since 1.0.0
 * @category mutations
 */
export const add: {
  <A>(value: A): (self: HashSet<A>) => HashSet<A>
  <A>(self: HashSet<A>, value: A): HashSet<A>
} = HS.add

/**
 * Removes a value from the `HashSet`.
 *
 * @since 1.0.0
 * @category mutations
 */
export const remove: {
  <A>(value: A): (self: HashSet<A>) => HashSet<A>
  <A>(self: HashSet<A>, value: A): HashSet<A>
} = HS.remove

/**
 * Computes the set difference between this `HashSet` and the specified
 * `Iterable<A>`.
 *
 * **NOTE**: the hash and equal of the values in both the set and the iterable
 * must be the same.
 *
 * @since 1.0.0
 * @category mutations
 */
export const difference: {
  <A>(that: Iterable<A>): (self: HashSet<A>) => HashSet<A>
  <A>(self: HashSet<A>, that: Iterable<A>): HashSet<A>
} = HS.difference

/**
 * Returns a `HashSet` of values which are present in both this set and that
 * `Iterable<A>`.
 *
 * **NOTE**: the hash and equal of the values in both the set and the iterable
 * must be the same.
 *
 * @since 1.0.0
 * @category mutations
 */
export const intersection: {
  <A>(that: Iterable<A>): (self: HashSet<A>) => HashSet<A>
  <A>(self: HashSet<A>, that: Iterable<A>): HashSet<A>
} = HS.intersection

/**
 * Computes the set union `(`self` + `that`)` between this `HashSet` and the
 * specified `Iterable<A>`.
 *
 * **NOTE**: the hash and equal of the values in both the set and the iterable
 * must be the same.
 *
 * @since 1.0.0
 * @category mutations
 */
export const union: {
  <A>(that: Iterable<A>): (self: HashSet<A>) => HashSet<A>
  <A>(self: HashSet<A>, that: Iterable<A>): HashSet<A>
} = HS.union

/**
 * Checks if a value is present in the `HashSet`. If it is present, the value
 * will be removed from the `HashSet`, otherwise the value will be added to the
 * `HashSet`.
 *
 * @since 1.0.0
 * @category mutations
 */
export const toggle: {
  <A>(value: A): (self: HashSet<A>) => HashSet<A>
  <A>(self: HashSet<A>, value: A): HashSet<A>
} = HS.toggle

/**
 * Maps over the values of the `HashSet` using the specified function.
 *
 * @since 1.0.0
 * @category mapping
 */
export const map: {
  <A, B>(f: (a: A) => B): (self: HashSet<A>) => HashSet<B>
  <A, B>(self: HashSet<A>, f: (a: A) => B): HashSet<B>
} = HS.map

/**
 * Chains over the values of the `HashSet` using the specified function.
 *
 * @since 1.0.0
 * @category sequencing
 */
export const flatMap: {
  <A, B>(f: (a: A) => Iterable<B>): (self: HashSet<A>) => HashSet<B>
  <A, B>(self: HashSet<A>, f: (a: A) => Iterable<B>): HashSet<B>
} = HS.flatMap

/**
 * Applies the specified function to the values of the `HashSet`.
 *
 * @since 1.0.0
 * @category traversing
 */
export const forEach: {
  <A>(f: (value: A) => void): (self: HashSet<A>) => void
  <A>(self: HashSet<A>, f: (value: A) => void): void
} = HS.forEach

/**
 * Reduces the specified state over the values of the `HashSet`.
 *
 * @since 1.0.0
 * @category folding
 */
export const reduce: {
  <A, Z>(zero: Z, f: (accumulator: Z, value: A) => Z): (self: HashSet<A>) => Z
  <A, Z>(self: HashSet<A>, zero: Z, f: (accumulator: Z, value: A) => Z): Z
} = HS.reduce

/**
 * Filters values out of a `HashSet` using the specified predicate.
 *
 * @since 1.0.0
 * @category filtering
 */
export const filter: {
  <A, B extends A>(f: Refinement<A, B>): (self: HashSet<A>) => HashSet<B>
  <A>(f: Predicate<A>): (self: HashSet<A>) => HashSet<A>
  <A, B extends A>(self: HashSet<A>, f: Refinement<A, B>): HashSet<B>
  <A>(self: HashSet<A>, f: Predicate<A>): HashSet<A>
} = HS.filter

/**
 * Partition the values of a `HashSet` using the specified predicate.
 *
 * If a value matches the predicate, it will be placed into the `HashSet` on the
 * right side of the resulting `Tuple`, otherwise the value will be placed into
 * the left side.
 *
 * @since 1.0.0
 * @category partitioning
 */
export const partition: {
  <A, B extends A>(f: Refinement<A, B>): (self: HashSet<A>) => readonly [HashSet<A>, HashSet<B>]
  <A>(f: Predicate<A>): (self: HashSet<A>) => readonly [HashSet<A>, HashSet<A>]
  <A, B extends A>(self: HashSet<A>, f: Refinement<A, B>): readonly [HashSet<A>, HashSet<B>]
  <A>(self: HashSet<A>, f: Predicate<A>): readonly [HashSet<A>, HashSet<A>]
} = HS.partition
