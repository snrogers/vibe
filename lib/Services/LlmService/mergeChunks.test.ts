import { test, expect } from "bun:test";
import { merge, type AnyChunk } from "./mergeChunks";

// Test Case 1: Merging two flat objects with the same keys
test("merges flat objects with same keys", () => {
  const a: AnyChunk = { name: "John", age: "30" };
  const b: AnyChunk = { name: "Doe", age: "40" };
  const expected: AnyChunk = { name: "JohnDoe", age: "3040" };
  expect(merge(a, b)).toEqual(expected);
});

// Test Case 2: Merging flat objects with different keys
test("merges flat objects with different keys", () => {
  const a: AnyChunk = { name: "John" };
  const b: AnyChunk = { age: "30" };
  const expected: AnyChunk = { name: "John", age: "30" };
  expect(merge(a, b)).toEqual(expected);
});

// Test Case 3: Including keys from both objects when one has extra keys
test("includes keys from both objects", () => {
  const a: AnyChunk = { name: "John", city: "New York" };
  const b: AnyChunk = { name: "Doe" };
  const expected: AnyChunk = { name: "JohnDoe", city: "New York" };
  expect(merge(a, b)).toEqual(expected);
});

// Test Case 4: Merging nested objects with the same keys
test("merges nested objects with same keys", () => {
  const a: AnyChunk = { person: { name: "John", age: "30" } };
  const b: AnyChunk = { person: { name: "Doe", age: "40" } };
  const expected: AnyChunk = { person: { name: "JohnDoe", age: "3040" } };
  expect(merge(a, b)).toEqual(expected);
});

// Test Case 5: Merging nested objects with different keys
test("merges nested objects with different keys", () => {
  const a: AnyChunk = { person: { name: "John" }, location: { city: "New York" } };
  const b: AnyChunk = { person: { age: "30" }, location: { country: "USA" } };
  const expected: AnyChunk = {
    person: { name: "John", age: "30" },
    location: { city: "New York", country: "USA" }
  };
  expect(merge(a, b)).toEqual(expected);
});

// Test Case 6: Merging a string with an object (string from a)
test("merges string with object (string from a)", () => {
  const a: AnyChunk = { key: "prefix_" };
  const b: AnyChunk = { key: { value: "test" } };
  const expected: AnyChunk = { key: { value: "prefix_test" } };
  expect(merge(a, b)).toEqual(expected);
});

// Test Case 7: Merging an object with a string (string from b)
test("merges object with string (string from b)", () => {
  const a: AnyChunk = { key: { value: "test" } };
  const b: AnyChunk = { key: "_suffix" };
  const expected: AnyChunk = { key: { value: "test_suffix" } };
  expect(merge(a, b)).toEqual(expected);
});

// Test Case 8: Merging empty objects
test("merges empty objects", () => {
  const a: AnyChunk = {};
  const b: AnyChunk = {};
  const expected: AnyChunk = {};
  expect(merge(a, b)).toEqual(expected);
});

// Test Case 9: Merging an empty object with a non-empty object
test("merges empty object with non-empty object", () => {
  const a: AnyChunk = {};
  const b: AnyChunk = { name: "John" };
  const expected: AnyChunk = { name: "John" };
  expect(merge(a, b)).toEqual(expected);
});

// Test Case 10: Merging a non-empty object with an empty object
test("merges non-empty object with empty object", () => {
  const a: AnyChunk = { name: "John" };
  const b: AnyChunk = {};
  const expected: AnyChunk = { name: "John" };
  expect(merge(a, b)).toEqual(expected);
});

// Test Case 11: Merging deeply nested structures
test("merges deeply nested structures", () => {
  const a: AnyChunk = { level1: { level2: { level3: "a" } } };
  const b: AnyChunk = { level1: { level2: { level3: "b" } } };
  const expected: AnyChunk = { level1: { level2: { level3: "ab" } } };
  expect(merge(a, b)).toEqual(expected);
});

// Test Case 12: Merging mixed types at different levels
test("merges mixed types at different levels", () => {
  const a: AnyChunk = { key1: "a", key2: { subkey: "b" } };
  const b: AnyChunk = { key1: { subkey: "c" }, key2: "d" };
  const expected: AnyChunk = {
    key1: { subkey: "ac" },
    key2: { subkey: "bd" }
  };
  expect(merge(a, b)).toEqual(expected);
});

// Test Case 13: Merging overlapping nested structures
test("merges overlapping nested structures", () => {
  const a: AnyChunk = { person: { name: "John", address: { city: "New York" } } };
  const b: AnyChunk = { person: { name: "Doe", address: { state: "NY" } } };
  const expected: AnyChunk = {
    person: {
      name: "JohnDoe",
      address: {
        city: "New York",
        state: "NY"
      }
    }
  };
  expect(merge(a, b)).toEqual(expected);
});

// Test Case 14: Merging complex structures with multiple levels and types
test("merges complex structures", () => {
  const a: AnyChunk = {
    key1: "a",
    key2: { subkey1: "b", subkey2: { subsubkey: "c" } },
    key3: "d"
  };
  const b: AnyChunk = {
    key1: { subkey: "e" },
    key2: { subkey1: "f", subkey2: "g" },
    key4: "h"
  };
  const expected: AnyChunk = {
    key1: { subkey: "ae" },
    key2: {
      subkey1: "bf",
      subkey2: { subsubkey: "cg" }
    },
    key3: "d",
    key4: "h"
  };
  expect(merge(a, b)).toEqual(expected);
});

// Test Case 15: Merging moderately deep structures
test("merges moderately deep structures", () => {
  const a: AnyChunk = { l1: { l2: { l3: { l4: "a" } } } };
  const b: AnyChunk = { l1: { l2: { l3: { l4: "b" } } } };
  const expected: AnyChunk = { l1: { l2: { l3: { l4: "ab" } } } };
  expect(merge(a, b)).toEqual(expected);
});
