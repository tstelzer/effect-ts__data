/**
 * @since 1.0.0
 */
import type { Chunk } from "@effect/data/Chunk"
import type { Equal } from "@effect/data/Equal"
import * as RBT from "@effect/data/internal/RedBlackTree"
import * as RBTI from "@effect/data/internal/RedBlackTree/iterator"
import type { Option } from "@fp-ts/core/Option"
import type { Order } from "@fp-ts/core/typeclass/Order"

const TypeId: unique symbol = RBT.RedBlackTreeTypeId as TypeId

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 1.0.0
 * @category constants
 */
export const Direction = RBTI.Direction

/**
 * A Red-Black Tree.
 *
 * @since 1.0.0
 * @category models
 */
export interface RedBlackTree<Key, Value> extends Iterable<readonly [Key, Value]>, Equal {
  readonly _id: TypeId
}

/**
 * @since 1.0.0
 */
export declare namespace RedBlackTree {
  export type Direction = number & {
    readonly Direction: unique symbol
  }
}

/**
 * @since 1.0.0
 * @category refinements
 */
export const isRedBlackTree: {
  <K, V>(u: Iterable<readonly [K, V]>): u is RedBlackTree<K, V>
  (u: unknown): u is RedBlackTree<unknown, unknown>
} = RBT.isRedBlackTree

/**
 * Creates an empty `RedBlackTree`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const empty: <K, V = never>(ord: Order<K>) => RedBlackTree<K, V> = RBT.empty

/**
 * Constructs a new tree from an iterable of key-value pairs.
 *
 * @since 1.0.0
 * @category constructors
 */
export const fromIterable: <K, V>(ord: Order<K>) => (entries: Iterable<readonly [K, V]>) => RedBlackTree<K, V> =
  RBT.fromIterable

/**
 * Constructs a new `RedBlackTree` from the specified entries.
 *
 * @since 1.0.0
 * @category constructors
 */
export const make: <K>(
  ord: Order<K>
) => <Entries extends Array<readonly [K, any]>>(
  ...entries: Entries
) => RedBlackTree<K, Entries[number] extends readonly [any, infer V] ? V : never> = RBT.make

/**
 * Returns an iterator that points to the element at the specified index of the
 * tree.
 *
 * **Note**: The iterator will run through elements in order.
 *
 * @since 1.0.0
 * @category traversing
 */
export const at: {
  (index: number): <K, V>(self: RedBlackTree<K, V>) => Iterable<readonly [K, V]>
  <K, V>(self: RedBlackTree<K, V>, index: number): Iterable<readonly [K, V]>
} = RBT.atForwards

/**
 * Returns an iterator that points to the element at the specified index of the
 * tree.
 *
 * **Note**: The iterator will run through elements in reverse order.
 *
 * @since 1.0.0
 * @category traversing
 */
export const atReversed: {
  (index: number): <K, V>(self: RedBlackTree<K, V>) => Iterable<readonly [K, V]>
  <K, V>(self: RedBlackTree<K, V>, index: number): Iterable<readonly [K, V]>
} = RBT.atBackwards

/**
 * Finds all values in the tree associated with the specified key.
 *
 * @since 1.0.0
 * @category elements
 */
export const find: {
  <K>(key: K): <V>(self: RedBlackTree<K, V>) => Chunk<V>
  <K, V>(self: RedBlackTree<K, V>, key: K): Chunk<V>
} = RBT.find

/**
 * Finds the value in the tree associated with the specified key, if it exists.
 *
 * @since 1.0.0
 * @category elements
 */
export const findFirst: {
  <K>(key: K): <V>(self: RedBlackTree<K, V>) => Option<V>
  <K, V>(self: RedBlackTree<K, V>, key: K): Option<V>
} = RBT.findFirst

/**
 * Returns the first entry in the tree, if it exists.
 *
 * @since 1.0.0
 * @category getters
 */
export const first: <K, V>(self: RedBlackTree<K, V>) => Option<readonly [K, V]> = RBT.first

/**
 * Returns the element at the specified index within the tree or `None` if the
 * specified index does not exist.
 *
 * @since 1.0.0
 * @category elements
 */
export const getAt: {
  (index: number): <K, V>(self: RedBlackTree<K, V>) => Option<readonly [K, V]>
  <K, V>(self: RedBlackTree<K, V>, index: number): Option<readonly [K, V]>
} = RBT.getAt

/**
 * Gets the `Order<K>` that the `RedBlackTree<K, V>` is using.
 *
 * @since 1.0.0
 * @category getters
 */
export const getOrder: <K, V>(self: RedBlackTree<K, V>) => Order<K> = RBT.getOrder

/**
 * Returns an iterator that traverse entries in order with keys greater than the
 * specified key.
 *
 * @since 1.0.0
 * @category traversing
 */
export const greaterThan: {
  <K>(key: K): <V>(self: RedBlackTree<K, V>) => Iterable<readonly [K, V]>
  <K, V>(self: RedBlackTree<K, V>, key: K): Iterable<readonly [K, V]>
} = RBT.greaterThanForwards

/**
 * Returns an iterator that traverse entries in reverse order with keys greater
 * than the specified key.
 *
 * @since 1.0.0
 * @category traversing
 */
export const greaterThanReversed: {
  <K>(key: K): <V>(self: RedBlackTree<K, V>) => Iterable<readonly [K, V]>
  <K, V>(self: RedBlackTree<K, V>, key: K): Iterable<readonly [K, V]>
} = RBT.greaterThanBackwards

/**
 * Returns an iterator that traverse entries in order with keys greater than or
 * equal to the specified key.
 *
 * @since 1.0.0
 * @category traversing
 */
export const greaterThanEqual: {
  <K>(key: K): <V>(self: RedBlackTree<K, V>) => Iterable<readonly [K, V]>
  <K, V>(self: RedBlackTree<K, V>, key: K): Iterable<readonly [K, V]>
} = RBT.greaterThanEqualForwards

/**
 * Returns an iterator that traverse entries in reverse order with keys greater
 * than or equal to the specified key.
 *
 * @since 1.0.0
 * @category traversing
 */
export const greaterThanEqualReversed: {
  <K>(key: K): <V>(self: RedBlackTree<K, V>) => Iterable<readonly [K, V]>
  <K, V>(self: RedBlackTree<K, V>, key: K): Iterable<readonly [K, V]>
} = RBT.greaterThanEqualBackwards

/**
 * Finds the item with key, if it exists.
 *
 * @since 1.0.0
 * @category elements
 */
export const has: {
  <K>(key: K): <V>(self: RedBlackTree<K, V>) => boolean
  <K, V>(self: RedBlackTree<K, V>, key: K): boolean
} = RBT.has

/**
 * Insert a new item into the tree.
 *
 * @since 1.0.0
 * @category mutations
 */
export const insert: {
  <K, V>(key: K, value: V): (self: RedBlackTree<K, V>) => RedBlackTree<K, V>
  <K, V>(self: RedBlackTree<K, V>, key: K, value: V): RedBlackTree<K, V>
} = RBT.insert

/**
 * Get all the keys present in the tree in order.
 *
 * @since 1.0.0
 * @category getters
 */
export const keys: <K, V>(self: RedBlackTree<K, V>) => IterableIterator<K> = RBT.keysForward

/**
 * Get all the keys present in the tree in reverse order.
 *
 * @since 1.0.0
 * @category getters
 */
export const keysReversed: <K, V>(self: RedBlackTree<K, V>) => IterableIterator<K> = RBT.keysBackward

/**
 * Returns the last entry in the tree, if it exists.
 *
 * @since 1.0.0
 * @category getters
 */
export const last: <K, V>(self: RedBlackTree<K, V>) => Option<readonly [K, V]> = RBT.last

/**
 * Returns an iterator that traverse entries in order with keys less than the
 * specified key.
 *
 * @since 1.0.0
 * @category traversing
 */
export const lessThan: {
  <K>(key: K): <V>(self: RedBlackTree<K, V>) => Iterable<readonly [K, V]>
  <K, V>(self: RedBlackTree<K, V>, key: K): Iterable<readonly [K, V]>
} = RBT.lessThanForwards

/**
 * Returns an iterator that traverse entries in reverse order with keys less
 * than the specified key.
 *
 * @since 1.0.0
 * @category traversing
 */
export const lessThanReversed: {
  <K>(key: K): <V>(self: RedBlackTree<K, V>) => Iterable<readonly [K, V]>
  <K, V>(self: RedBlackTree<K, V>, key: K): Iterable<readonly [K, V]>
} = RBT.lessThanBackwards

/**
 * Returns an iterator that traverse entries in order with keys less than or
 * equal to the specified key.
 *
 * @since 1.0.0
 * @category traversing
 */
export const lessThanEqual: {
  <K>(key: K): <V>(self: RedBlackTree<K, V>) => Iterable<readonly [K, V]>
  <K, V>(self: RedBlackTree<K, V>, key: K): Iterable<readonly [K, V]>
} = RBT.lessThanEqualForwards

/**
 * Returns an iterator that traverse entries in reverse order with keys less
 * than or equal to the specified key.
 *
 * @since 1.0.0
 * @category traversing
 */
export const lessThanEqualReversed: {
  <K>(key: K): <V>(self: RedBlackTree<K, V>) => Iterable<readonly [K, V]>
  <K, V>(self: RedBlackTree<K, V>, key: K): Iterable<readonly [K, V]>
} = RBT.lessThanEqualBackwards

/**
 * Execute the specified function for each node of the tree, in order.
 *
 * @since 1.0.0
 * @category traversing
 */
export const forEach: {
  <K, V>(f: (key: K, value: V) => void): (self: RedBlackTree<K, V>) => void
  <K, V>(self: RedBlackTree<K, V>, f: (key: K, value: V) => void): void
} = RBT.forEach

/**
 * Visit each node of the tree in order with key greater then or equal to max.
 *
 * @since 1.0.0
 * @category traversing
 */
export const forEachGreaterThanEqual: {
  <K, V>(min: K, f: (key: K, value: V) => void): (self: RedBlackTree<K, V>) => void
  <K, V>(self: RedBlackTree<K, V>, min: K, f: (key: K, value: V) => void): void
} = RBT.forEachGreaterThanEqual

/**
 * Visit each node of the tree in order with key lower then max.
 *
 * @since 1.0.0
 * @category traversing
 */
export const forEachLessThan: {
  <K, V>(max: K, f: (key: K, value: V) => void): (self: RedBlackTree<K, V>) => void
  <K, V>(self: RedBlackTree<K, V>, max: K, f: (key: K, value: V) => void): void
} = RBT.forEachLessThan

/**
 * Visit each node of the tree in order with key lower than max and greater
 * than or equal to min.
 *
 * @since 1.0.0
 * @category traversing
 */
export const forEachBetween: {
  <K, V>(min: K, max: K, f: (key: K, value: V) => void): (self: RedBlackTree<K, V>) => void
  <K, V>(self: RedBlackTree<K, V>, min: K, max: K, f: (key: K, value: V) => void): void
} = RBT.forEachBetween

/**
 * Reduce a state over the map entries.
 *
 * @since 1.0.0
 * @category folding
 */
export const reduce: {
  <Z, V>(zero: Z, f: (accumulator: Z, value: V) => Z): <K>(self: RedBlackTree<K, V>) => Z
  <Z, K, V>(self: RedBlackTree<K, V>, zero: Z, f: (accumulator: Z, value: V) => Z): Z
} = RBT.reduce

/**
 * Reduce a state over the entries of the tree.
 *
 * @since 1.0.0
 * @category folding
 */
export const reduceWithIndex: {
  <Z, V, K>(zero: Z, f: (accumulator: Z, value: V, key: K) => Z): (self: RedBlackTree<K, V>) => Z
  <Z, V, K>(self: RedBlackTree<K, V>, zero: Z, f: (accumulator: Z, value: V, key: K) => Z): Z
} = RBT.reduceWithIndex

/**
 * Removes the entry with the specified key, if it exists.
 *
 * @since 1.0.0
 * @category mutations
 */
export const removeFirst: {
  <K>(key: K): <V>(self: RedBlackTree<K, V>) => RedBlackTree<K, V>
  <K, V>(self: RedBlackTree<K, V>, key: K): RedBlackTree<K, V>
} = RBT.removeFirst

/**
 * Traverse the tree in reverse order.
 *
 * @since 1.0.0
 * @category traversing
 */
export const reversed: <K, V>(self: RedBlackTree<K, V>) => Iterable<readonly [K, V]> = RBT.reversed

/**
 * Returns the size of the tree.
 *
 * @since 1.0.0
 * @category getters
 */
export const size: <K, V>(self: RedBlackTree<K, V>) => number = RBT.size

/**
 * Get all values present in the tree in order.
 *
 * @since 1.0.0
 * @category getters
 */
export const values: <K, V>(self: RedBlackTree<K, V>) => IterableIterator<V> = RBT.valuesForward

/**
 * Get all values present in the tree in reverse order.
 *
 * @since 1.0.0
 * @category getters
 */
export const valuesReversed: <K, V>(self: RedBlackTree<K, V>) => IterableIterator<V> = RBT.valuesBackward
