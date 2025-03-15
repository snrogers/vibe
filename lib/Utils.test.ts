import { test, expect } from 'bun:test'
import { overDeep, overDeep2, setDeep } from './Utils';
import { pp } from './Utils';

test('setDeep', () => {
  const input = { a: { b: { c: 1, }, }, };

  const setter = setDeep('a', 'b', 'c') (2);
  const result = setDeep('a', 'b', 'c') (2) (input);
  console.log(pp({ obj: input, result }));

  expect(result).toEqual({ a: { b: { c: 2 } } });
});

test('overDeep', () => {
  const input = { a: { b: { c: 1, }, }, };

  const result = overDeep('a', 'b', 'c') ((x: number) => x + 1) (input);

  console.log(pp({ result }));

  expect(result).toEqual({ a: { b: { c: 2 } } });
});

test('overDeep2', () => {
  const input = { a: { b: { c: 1, }, }, };

  const result = overDeep2('a.b.c', (x: number) => x + 1) (input);

  console.log(pp({ result }));

  expect(result).toEqual({ a: { b: { c: 2 } } });
});
