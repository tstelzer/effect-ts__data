---
title: MutableHashMap.ts
nav_order: 19
parent: Modules
---

## MutableHashMap overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [empty](#empty)
  - [make](#make)
- [conversions](#conversions)
  - [fromIterable](#fromiterable)
- [elements](#elements)
  - [get](#get)
  - [has](#has)
  - [size](#size)
- [models](#models)
  - [MutableHashMap (interface)](#mutablehashmap-interface)
- [mutations](#mutations)
  - [modify](#modify)
  - [modifyAt](#modifyat)
  - [remove](#remove)
  - [set](#set)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)

---

# constructors

## empty

**Signature**

```ts
export declare const empty: <K = never, V = never>() => MutableHashMap<K, V>
```

Added in v1.0.0

## make

**Signature**

```ts
export declare const make: <Entries extends (readonly [any, any])[]>(
  ...entries: Entries
) => MutableHashMap<
  Entries[number] extends readonly [infer K, any] ? K : never,
  Entries[number] extends readonly [any, infer V] ? V : never
>
```

Added in v1.0.0

# conversions

## fromIterable

**Signature**

```ts
export declare const fromIterable: <K, V>(entries: Iterable<readonly [K, V]>) => MutableHashMap<K, V>
```

Added in v1.0.0

# elements

## get

**Signature**

```ts
export declare const get: {
  <K>(key: K): <V>(self: MutableHashMap<K, V>) => Option.Option<V>
  <K, V>(self: MutableHashMap<K, V>, key: K): Option.Option<V>
}
```

Added in v1.0.0

## has

**Signature**

```ts
export declare const has: {
  <K>(key: K): <V>(self: MutableHashMap<K, V>) => boolean
  <K, V>(self: MutableHashMap<K, V>, key: K): boolean
}
```

Added in v1.0.0

## size

**Signature**

```ts
export declare const size: <K, V>(self: MutableHashMap<K, V>) => number
```

Added in v1.0.0

# models

## MutableHashMap (interface)

**Signature**

```ts
export interface MutableHashMap<K, V> extends Iterable<readonly [K, V]> {
  readonly _id: TypeId

  /** @internal */
  readonly backingMap: Map<number, Node<K, V>>
  /** @internal */
  length: number
}
```

Added in v1.0.0

# mutations

## modify

Updates the value of the specified key within the `MutableHashMap` if it exists.

**Signature**

```ts
export declare const modify: {
  <K, V>(key: K, f: (v: V) => V): (self: MutableHashMap<K, V>) => MutableHashMap<K, V>
  <K, V>(self: MutableHashMap<K, V>, key: K, f: (v: V) => V): MutableHashMap<K, V>
}
```

Added in v1.0.0

## modifyAt

Set or remove the specified key in the `MutableHashMap` using the specified
update function.

**Signature**

```ts
export declare const modifyAt: {
  <K, V>(key: K, f: (value: Option.Option<V>) => Option.Option<V>): (self: MutableHashMap<K, V>) => MutableHashMap<K, V>
  <K, V>(self: MutableHashMap<K, V>, key: K, f: (value: Option.Option<V>) => Option.Option<V>): MutableHashMap<K, V>
}
```

Added in v1.0.0

## remove

**Signature**

```ts
export declare const remove: {
  <K>(key: K): <V>(self: MutableHashMap<K, V>) => MutableHashMap<K, V>
  <K, V>(self: MutableHashMap<K, V>, key: K): MutableHashMap<K, V>
}
```

Added in v1.0.0

## set

**Signature**

```ts
export declare const set: {
  <K, V>(key: K, value: V): (self: MutableHashMap<K, V>) => MutableHashMap<K, V>
  <K, V>(self: MutableHashMap<K, V>, key: K, value: V): MutableHashMap<K, V>
}
```

Added in v1.0.0

# symbol

## TypeId (type alias)

**Signature**

```ts
export type TypeId = typeof TypeId
```

Added in v1.0.0
