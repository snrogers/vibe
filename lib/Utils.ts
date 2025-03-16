import { is, mergeWith } from "rambdax";
import type { AnyKey, Xf } from "./Types";

export function dump(obj: unknown) {
  return JSON.stringify(obj, null, 2);
}

type ObjectSpecForPath<Path extends [...string[]], T = unknown> =
  Path extends [infer Head extends AnyKey, ...infer Tail extends string[]]
  ? Tail extends []
    ? { [key in Head]: T }
    : { [key in Head]: ObjectSpecForPath<Tail> }
  : never

type setDeep =
  <Path extends [...string[]], Val>(...path: Path) =>
    <Val>(value: Val) =>
      <T extends ObjectSpecForPath<Path, T>>(obj: T) => T

export const setDeep: setDeep = (...path) => (value) => (obj) => {
  // No path, return the object as is
  if (path.length === 0) return obj;

  // First key in the path
  const [head, ...tail] = path;

  // If this is the last key in the path, set the value
  if (tail.length === 0) {
    return {
      ...obj,
      [head]: value
    };
  }

  // Otherwise, recursively set the value in the nested object
  return {
    ...obj,
    [head]: setDeep(...tail)(value)(obj[head] as never)
  };
}

type overDeep =
  <Path extends [...string[]], Val>(...path: Path) =>
    <Val>(xf: Xf<Val, Val>) =>
      <T extends ObjectSpecForPath<Path, T>>(obj: T) => T

export const overDeep: overDeep = (...path) => (xf) => (obj) => {
  // No path, return the object as is
  if (path.length === 0) return obj;

  // First key in the path
  const [head, ...tail] = path;

  // If this is the last key in the path, apply the transformation function
  if (tail.length === 0) {
    return {
      ...obj,
      [head]: xf(obj[head] as any)
    };
  }

  // Otherwise, recursively apply the transformation in the nested object
  return {
    ...obj,
    [head]: overDeep(...tail)(xf)(obj[head] as never)
  };
}

export const pp = (obj: unknown) => {
  return JSON.stringify(obj, null, 2);
}

type PathFromString<S extends string> =
  S extends `${infer Head extends string}.${infer Tail extends string}`
  ? [Head, ...PathFromString<Tail>]
  : [S]

type _pathfromstringtest = PathFromString<'a.b.c'>

type ObjectSpecForPathString<Path extends string, T = unknown> =
  PathFromString<Path> extends [infer Head extends AnyKey, ...infer Tail extends string[]]
  ? Tail extends []
    ? { [key in Head]: T }
    : { [key in Head]: ObjectSpecForPath<Tail> }
  : never

type _objspec2test = ObjectSpecForPathString<'a.b.c'>

type overDeep2 =
  <Path extends string, Val>(path: Path, xf: Xf<Val, Val>) =>
      <T extends ObjectSpecForPathString<Path, T>>(obj: T) => T

export const overDeep2: overDeep2 = (path, xf) => (obj) => {
  // Split the path string by dots
  const pathParts = path.split('.');

  // Use the existing overDeep function with the split path
  return overDeep(...pathParts)(xf)(obj);
}

export const eternity = new Promise(() => {})

// @ts-expect-error
export function exhaustiveCheck(x: never): never { }

/**
 * Checks if the current file is the entry point in Bun.
 * @returns {boolean} - True if this file is the entry point, false otherwise.
 */
function isEntryPoint(): boolean {
  // import.meta.path is the absolute path of the current file
  // Bun.main is the absolute path of the entry point script
  return import.meta.path === Bun.main;
}
