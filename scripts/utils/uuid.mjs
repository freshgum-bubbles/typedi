/**
 * @param {number} start - The start of the iterator.
 */
export function* createUuidIterator(start = 0) {
  let currentId = start;
  while (true) {
    yield currentId++;
  }
}
