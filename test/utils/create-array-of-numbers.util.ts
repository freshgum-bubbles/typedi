/**
 * Create an array of numbers from 0, with the end denoting the final number
 * in the array.
 *
 * @example
 * Here is an example:
 * ```ts
 * const array = createArrayOfNumbers(5);
 * // -> [1, 2, 3, 4, 5]
 * ```
 */
export function createArrayOfNumbers(end: number) {
  const numbers: number[] = [];
  let index = 0;

  while (index <= end) {
    numbers.push(index);
    index++;
  }

  return numbers;
}
