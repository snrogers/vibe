import { is, mergeWith } from "rambdax";
import type { AnyKey, Xf } from "./Types";


type ObjectSpecForPath<Path extends [...string[]], T = unknown> =
  Path extends [infer Head extends AnyKey, ...infer Tail extends string[]]
  ? Tail extends []
    ? { [key in Head]: T }
    : { [key in Head]: ObjectSpecForPath<Tail> }
  : never

export const dump = (obj: unknown) => {
  return JSON.stringify(obj, null, 2);
}

export const eternity = new Promise(() => {})


/**
 * Ensures that all possible cases are handled in a switch statement or similar construct.
 * When used without specifying ExcludedTypes, it helps to check that all types in a union are handled.
 * When used with ExcludedTypes, it allows specifying types that are intentionally not handled.
 *
 * @template [ExcludedTypes=never] - The types that are excluded from the exhaustive check. Defaults to never.
 * @param    {ExcludedTypes} x     - The value to check. Typically, this is the variable being switched on.
 * @returns  This function returns never, indicating that it should not be reached.
 *
 * @example
 * // Without ExcludedTypes
 * type Shape = 'circle' | 'square' | 'triangle';
 * function handleShape(shape: Shape) {
 *     switch (shape) {
 *         case 'circle':
 *             // handle circle
 *             break;
 *         case 'square':
 *             // handle square
 *             break;
 *         case 'triangle':
 *             // handle triangle
 *             break;
 *         default:
 *             exhaustiveCheck(shape);  // TypeScript will error if a new shape is added without handling it
 *             throw new Error('Unreachable');
 *     }
 * }
 *
 * @example
 * // With ExcludedTypes
 * type Shape = 'circle' | 'square' | 'triangle' | 'rectangle';
 * function handleShape(shape: Shape) {
 *     switch (shape) {
 *         case 'circle':
 *             // handle circle
 *             break;
 *         case 'square':
 *             // handle square
 *             break;
 *         default:
 *             exhaustiveCheck<'triangle' | 'rectangle'>(shape);  // Allows 'triangle' and 'rectangle' to be unhandled
 *             // handle default case
 *     }
 * }
 */
export const exhaustiveCheck =
  <ExcludedTypes = never>(x: NoInfer<ExcludedTypes>) => {
    return x as never
  }


/**
 * Checks if the current file is the entry point in Bun.
 * @returns {boolean} - True if this file is the entry point, false otherwise.
 */
function isEntryPoint(): boolean {
  // import.meta.path is the absolute path of the current file
  // Bun.main is the absolute path of the entry point script
  return import.meta.path === Bun.main;
}
